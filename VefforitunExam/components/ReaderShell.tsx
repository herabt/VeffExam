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
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLDivElement>(".fragment .cb");
    const cleanups: Array<() => void> = [];
    blocks.forEach((block) => {
      if (block.querySelector(".copy-btn")) return;
      const pre = block.querySelector("pre");
      if (!pre) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.textContent = "copy";
      const handler = async () => {
        try {
          await navigator.clipboard.writeText(pre.textContent ?? "");
          btn.textContent = "copied";
          setTimeout(() => (btn.textContent = "copy"), 900);
        } catch {
          btn.textContent = "error";
          setTimeout(() => (btn.textContent = "copy"), 1200);
        }
      };
      btn.addEventListener("click", handler);
      block.appendChild(btn);
      cleanups.push(() => btn.removeEventListener("click", handler));
    });
    return () => cleanups.forEach((c) => c());
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
