"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  KIND_LABELS,
  TOPICS,
  topicHref,
  type Topic,
  type TopicKind,
} from "@/lib/registry";

interface Props {
  onClose: () => void;
}

interface Row {
  id: string;
  kind: "topic" | "action";
  topicKind?: TopicKind;
  title: string;
  subtitle?: string;
  href?: string;
  keywords: string;
}

// Simple word-based fuzzy: keep rows whose words appear as substrings in order.
function fuzzyScore(needle: string, haystack: string): number {
  if (!needle) return 0;
  const n = needle.toLowerCase();
  const h = haystack.toLowerCase();
  if (h.startsWith(n)) return 1000 - (h.length - n.length);
  const idx = h.indexOf(n);
  if (idx === 0) return 900 - (h.length - n.length);
  if (idx > 0) return 500 - idx;
  // token match: every needle-word must appear
  const tokens = n.split(/\s+/).filter(Boolean);
  if (tokens.every((t) => h.includes(t))) return 200;
  // subsequence
  let i = 0;
  for (const ch of h) {
    if (ch === n[i]) i++;
    if (i === n.length) return 50;
  }
  return -1;
}

export function CommandPalette({ onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const allRows: Row[] = useMemo(() => {
    const rows: Row[] = TOPICS.map((t): Row => ({
      id: topicHref(t),
      kind: "topic",
      topicKind: t.kind,
      title: t.title,
      subtitle: t.subtitle ?? KIND_LABELS[t.kind],
      href: topicHref(t),
      keywords: `${t.kind} ${t.slug} ${t.title} ${t.subtitle ?? ""}`,
    }));
    return rows;
  }, []);

  const filtered: Row[] = useMemo(() => {
    const q = query.trim();
    if (!q) return allRows;
    return allRows
      .map((r) => ({ r, s: fuzzyScore(q, r.keywords) }))
      .filter(({ s }) => s >= 0)
      .sort((a, b) => b.s - a.s)
      .map(({ r }) => r);
  }, [allRows, query]);

  // reset cursor when the list changes
  useEffect(() => {
    setCursor(0);
  }, [query]);

  // Esc to close
  useEffect(() => {
    const h = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", h);
    // Lock scroll behind the palette
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", h);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const choose = (row: Row) => {
    if (row.href) {
      router.push(row.href as Parameters<typeof router.push>[0]);
      onClose();
    }
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(filtered.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = filtered[cursor];
      if (r) choose(r);
    } else if (e.key === "Home") {
      setCursor(0);
    } else if (e.key === "End") {
      setCursor(filtered.length - 1);
    }
  };

  // keep selected row in view
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(".palette-row.selected");
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor, filtered.length]);

  const grouped = groupBy(filtered, (r) => (r.kind === "topic" ? KIND_LABELS[r.topicKind!] : "Actions"));

  return (
    <div className="palette-scrim" role="dialog" aria-modal="true" aria-label="Command palette" onClick={onClose}>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Jump to topic, exam, or action…"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          aria-label="Search"
        />
        <div className="palette-list" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="palette-empty">Nothing matches <code>{query}</code></div>
          ) : (
            Object.entries(grouped).map(([group, rows]) => (
              <div key={group}>
                <div className="palette-group-title">{group}</div>
                {rows.map((r) => {
                  const idx = filtered.indexOf(r);
                  const selected = idx === cursor;
                  return (
                    <div
                      key={r.id}
                      className={`palette-row${selected ? " selected" : ""}`}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setCursor(idx)}
                      onClick={() => choose(r)}
                    >
                      <span className="kind-badge">{r.topicKind ?? "action"}</span>
                      <span className="title">{r.title}</span>
                      {r.subtitle && <span className="hint">{r.subtitle}</span>}
                      <span className="enter">↵</span>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
        <div className="palette-footer">
          <span className="tip"><kbd className="kbd">↑</kbd><kbd className="kbd">↓</kbd> navigate</span>
          <span className="tip"><kbd className="kbd">↵</kbd> open</span>
          <span className="tip"><kbd className="kbd">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

function groupBy<T>(arr: T[], key: (t: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of arr) {
    const k = key(item);
    (out[k] ??= []).push(item);
  }
  return out;
}
