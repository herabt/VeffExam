"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  TOPICS,
  KIND_LABELS,
  topicHref,
  topicsByKind,
  type TopicKind,
} from "@/lib/registry";
import { onProgressChange, readProgress, topicKey, type ProgressMap } from "@/lib/progress";

const KIND_ORDER: TopicKind[] = ["study", "exam", "bonus", "glossary"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(readProgress());
    return onProgressChange(() => setProgress(readProgress()));
  }, []);

  return (
    <aside
      className={`sidebar${open ? " open" : ""}`}
      aria-label="Topic navigation"
    >
      <nav onClick={(e) => {
        // close drawer after clicking a link on mobile
        const t = e.target as HTMLElement;
        if (t.closest("a")) onClose();
      }}>
        <div className="sidebar-section">
          <ul role="list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <Link
                href="/practice"
                className={`sidebar-link${pathname === "/practice" ? " active" : ""}`}
                aria-current={pathname === "/practice" ? "page" : undefined}
              >
                <span className="title">🎲 Random practice</span>
              </Link>
            </li>
          </ul>
        </div>

        {KIND_ORDER.map((kind) => {
          const items = topicsByKind(kind);
          if (!items.length) return null;
          const total = items.length;
          return (
            <div key={kind} className="sidebar-section">
              <div className="sidebar-section-title">
                <span>{KIND_LABELS[kind]}</span>
                <span className="count">{total}</span>
              </div>
              <ul role="list" style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((t) => {
                  const href = topicHref(t);
                  const p = progress[topicKey(t)];
                  const isActive = pathname === href;
                  const progressLabel = progressBadge(t.kind, p);
                  const isDone =
                    (t.kind === "exam" || t.kind === "bonus") &&
                    p?.answered != null &&
                    p.total != null &&
                    p.answered >= p.total;
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={`sidebar-link${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <span className="title">{t.title}</span>
                        {progressLabel && <span className="progress">{progressLabel}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function progressBadge(
  kind: TopicKind,
  p: ProgressMap[string] | undefined,
): string | null {
  if (!p) return null;
  if (kind === "exam" || kind === "bonus") {
    if (p.answered != null && p.total != null) return `${p.answered}/${p.total}`;
    if (p.answered != null) return `${p.answered}`;
    return "·";
  }
  if (p.scrollPct != null) return `${p.scrollPct}%`;
  return "·";
}
