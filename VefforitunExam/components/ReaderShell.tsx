"use client";

import { useEffect } from "react";
import { ReadingTOC } from "./ReadingTOC";
import { StudyEnhancer } from "./StudyEnhancer";
import { markVisit } from "@/lib/session";
import { topicKey as pKey, updateTopic } from "@/lib/progress";
import type { TopicKind } from "@/lib/registry";

interface Props {
  kind: TopicKind;
  slug: string;
}

/**
 * Client-side rail for study/glossary pages.
 *   - Tracks visit + max scroll percentage
 *   - Wires copy buttons on every code block
 *   - Renders the right-rail TOC
 */
export function ReaderShell({ kind, slug }: Props) {
  const key = pKey({ kind, slug });

  useEffect(() => {
    markVisit(key);

    let rAF = 0;
    const onScroll = () => {
      if (rAF) return;
      rAF = requestAnimationFrame(() => {
        rAF = 0;
        const h = document.documentElement;
        const denom = h.scrollHeight - h.clientHeight;
        if (denom > 0) {
          const pct = Math.min(100, Math.round((h.scrollTop / denom) * 100));
          updateTopic(key, { scrollPct: pct });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rAF) cancelAnimationFrame(rAF);
    };
  }, [key]);

  // Inject copy buttons on every code block.
  // Uses event delegation so the handler survives React StrictMode double-effects
  // and repeated injection across client-side navigation.
  useEffect(() => {
    // 1. Ensure every .cb has a visible button element.
    document.querySelectorAll<HTMLDivElement>(".fragment .cb").forEach((block) => {
      if (block.querySelector(".copy-btn")) return;
      if (!block.querySelector("pre")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.textContent = "copy";
      block.appendChild(btn);
    });

    // 2. Delegated click handler — one per document, idempotent.
    const onClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest<HTMLButtonElement>(".fragment .cb .copy-btn");
      if (!btn) return;
      e.preventDefault();
      const pre = btn.parentElement?.querySelector("pre");
      if (!pre) return;
      const text = pre.textContent ?? "";
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // http:// fallback (covers local dev on some setups)
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          ta.remove();
        }
        btn.textContent = "copied";
        btn.dataset.state = "ok";
        setTimeout(() => { btn.textContent = "copy"; delete btn.dataset.state; }, 900);
      } catch {
        btn.textContent = "error";
        btn.dataset.state = "err";
        setTimeout(() => { btn.textContent = "copy"; delete btn.dataset.state; }, 1200);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <>
      <StudyEnhancer />
      <aside className="rail" aria-label="Page navigation">
        <section className="rail-section">
          <ReadingTOC />
        </section>
      </aside>
    </>
  );
}
