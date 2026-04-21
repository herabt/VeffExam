"use client";

import { useEffect, useState } from "react";
import { highlight, looksLikeCode } from "@/lib/highlight";
import { register, keys } from "@/lib/shortcuts";

interface Props {
  /** How long the article takes to read (computed server-side if we had word count, but we do it client-side). */
}

/**
 * Post-render decoration for study/glossary pages:
 *   - Reading progress bar (fixed top, 2px)
 *   - Est. read time + key concepts chip row injected below the first <h2>
 *   - Callout boxes detected from prose leading words ("Gotcha:", "Tip:", …)
 *   - Syntax highlighting for every code block
 *   - Focus mode (press `f`)
 *   - Expand / collapse all <details> shortcut (`e`)
 */
export function StudyEnhancer(_: Props) {
  const [progress, setProgress] = useState(0);
  const [focus, setFocus] = useState(false);

  // Reading-progress scroll tracking
  useEffect(() => {
    let rAF = 0;
    const tick = () => {
      rAF = 0;
      const h = document.documentElement;
      const denom = h.scrollHeight - h.clientHeight;
      const pct = denom > 0 ? (h.scrollTop / denom) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    const onScroll = () => { if (!rAF) rAF = requestAnimationFrame(tick); };
    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rAF) cancelAnimationFrame(rAF);
    };
  }, []);

  // One-shot enhancements: highlighting, callouts, meta row
  useEffect(() => {
    const article = document.querySelector<HTMLElement>(".fragment.prose");
    if (!article) return;

    syntaxHighlightAll(article);
    annotateCodeBlocks(article);
    convertCallouts(article);
    injectMetaBar(article);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const offs = [
      register({
        id: "focus",
        label: "Toggle reading focus mode",
        keys: ["f"],
        group: "Study",
        match: keys.plain("f"),
        handler: () => setFocus((v) => !v),
      }),
      register({
        id: "expand-all",
        label: "Expand / collapse all details",
        keys: ["e"],
        group: "Study",
        match: keys.plain("e"),
        handler: () => {
          const d = document.querySelectorAll<HTMLDetailsElement>(".fragment details");
          const anyClosed = Array.from(d).some((x) => !x.open);
          d.forEach((x) => (x.open = anyClosed));
        },
      }),
    ];
    return () => offs.forEach((o) => o());
  }, []);

  // Toggle focus-mode class on the body
  useEffect(() => {
    document.body.classList.toggle("focus-mode", focus);
    return () => document.body.classList.remove("focus-mode");
  }, [focus]);

  return (
    <>
      <div className="reading-bar" aria-hidden="true">
        <div style={{ width: `${progress}%` }} />
      </div>
      {focus && (
        <div className="focus-toast" role="status" aria-live="polite">
          focus mode · press <kbd className="kbd">f</kbd> to exit
        </div>
      )}
    </>
  );
}

// ─── Decorators ────────────────────────────────────────────────────────

function syntaxHighlightAll(root: HTMLElement) {
  root.querySelectorAll<HTMLPreElement>(".cb pre").forEach((pre) => {
    if (pre.dataset.hl === "1") return;
    const text = pre.textContent ?? "";
    if (!looksLikeCode(text)) return;
    pre.innerHTML = highlight(text);
    pre.dataset.hl = "1";
  });
}

/** Detect a shebang-style "// path/file.tsx" on the first line and render a label bar. */
function annotateCodeBlocks(root: HTMLElement) {
  root.querySelectorAll<HTMLDivElement>(".cb").forEach((block) => {
    if (block.querySelector(".cb-label")) return;
    const pre = block.querySelector<HTMLPreElement>("pre");
    if (!pre) return;
    const firstLine = (pre.textContent ?? "").split("\n")[0]?.trim() ?? "";
    const m = /^\/\/\s*([\w./@-]+\.(tsx?|jsx?|css|html|md|json|mjs))\b/i.exec(firstLine);
    if (!m) return;
    const label = document.createElement("div");
    label.className = "cb-label";
    label.textContent = m[1] ?? "";
    block.insertBefore(label, pre);
  });
}

interface Callout { rx: RegExp; kind: string; icon: string; }
const CALLOUTS: Callout[] = [
  { rx: /^(gotcha|trap|common\s+trap|warning|danger|careful)\s*[:—-]/i, kind: "warn", icon: "⚠" },
  { rx: /^(tip|pro\s*tip|hint|shortcut)\s*[:—-]/i, kind: "tip", icon: "★" },
  { rx: /^(note|fyi|aside)\s*[:—-]/i, kind: "note", icon: "ℹ" },
  { rx: /^(remember|key\s+point|important)\s*[:—-]/i, kind: "key", icon: "◆" },
  { rx: /^(example|e\.?g\.?)\s*[:—-]/i, kind: "example", icon: "▸" },
  { rx: /^(definition|def\.?)\s*[:—-]/i, kind: "def", icon: "§" },
];

function convertCallouts(root: HTMLElement) {
  // scan paragraphs; if leading text matches a callout, wrap paragraph (and
  // following <ul>/<pre>) into a callout block.
  const paragraphs = Array.from(root.querySelectorAll<HTMLParagraphElement>("p"));
  for (const p of paragraphs) {
    if (p.dataset.cal === "1") continue;
    // Skip if inside details or other callouts
    if (p.closest("details, .callout")) continue;

    // Prefer first <strong> text as the marker, else first 30 chars
    const probe = (p.querySelector("strong")?.textContent ?? p.textContent ?? "").trim();
    const match = CALLOUTS.find((c) => c.rx.test(probe));
    if (!match) continue;

    const box = document.createElement("div");
    box.className = `callout callout-${match.kind}`;
    box.setAttribute("role", "note");
    box.setAttribute("aria-label", match.kind);

    const icon = document.createElement("span");
    icon.className = "callout-icon";
    icon.textContent = match.icon;
    icon.setAttribute("aria-hidden", "true");

    const body = document.createElement("div");
    body.className = "callout-body";

    // Move p and following inline elements (until next <h2/h3/h4/hr>) into body.
    const sibs: Element[] = [p];
    let cur = p.nextElementSibling;
    // Only move if they're NOT headings/breaks and are tightly coupled (immediate siblings within 2 elements for safety)
    const maxAdopt = 2;
    while (cur && sibs.length - 1 < maxAdopt) {
      const tag = cur.tagName;
      if (tag === "H2" || tag === "H3" || tag === "H4" || tag === "HR" || tag === "P") break;
      if (tag === "UL" || tag === "OL" || tag === "DIV" && cur.classList.contains("cb")) {
        sibs.push(cur);
        cur = cur.nextElementSibling;
      } else {
        break;
      }
    }

    const parent = p.parentNode;
    if (!parent) continue;
    parent.insertBefore(box, p);
    box.appendChild(icon);
    box.appendChild(body);
    sibs.forEach((el) => body.appendChild(el));
    p.dataset.cal = "1";
  }
}

function injectMetaBar(root: HTMLElement) {
  const firstH2 = root.querySelector<HTMLHeadingElement>("h2.g-h2");
  if (!firstH2 || firstH2.previousElementSibling?.classList.contains("meta-bar")) return;

  const words = (root.textContent ?? "").trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 240));

  // Collect the top-level section titles (h2s except the very first, which is the title).
  const sections = Array.from(root.querySelectorAll<HTMLHeadingElement>("h2.g-h2"));

  const bar = document.createElement("div");
  bar.className = "meta-bar";

  const stats = document.createElement("div");
  stats.className = "meta-stats";
  stats.innerHTML = `<span class="meta-chip">≈ ${mins} min read</span><span class="meta-chip">${words.toLocaleString()} words</span><span class="meta-chip">${sections.length} sections</span>`;
  bar.appendChild(stats);

  // Chip strip — skip the first h2 (treated as page title)
  const chipSections = sections.slice(1, 13);
  if (chipSections.length > 1) {
    const chips = document.createElement("div");
    chips.className = "meta-chips";
    chipSections.forEach((h, i) => {
      if (!h.id) return;
      const chip = document.createElement("a");
      chip.href = `#${h.id}`;
      chip.className = "meta-chiplink";
      chip.innerHTML = `<span class="meta-n">${String(i + 1).padStart(2, "0")}</span> ${escapeText(h.textContent ?? "")}`;
      chip.addEventListener("click", (e) => {
        e.preventDefault();
        const el = document.getElementById(h.id);
        if (!el) return;
        const y = el.getBoundingClientRect().top + window.pageYOffset - 60;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
      chips.appendChild(chip);
    });
    bar.appendChild(chips);
  }

  firstH2.parentNode?.insertBefore(bar, firstH2.nextSibling);
}

function escapeText(s: string): string {
  const d = document.createElement("div");
  d.textContent = s.trim();
  return d.innerHTML;
}
