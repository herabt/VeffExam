"use client";

import { useEffect, useState } from "react";

interface Heading { id: string; text: string; depth: 2 | 3; }

interface Props {
  /** Selector for the root containing the content */
  rootSelector?: string;
}

export function ReadingTOC({ rootSelector = ".content-inner" }: Props) {
  const [items, setItems] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const found: Heading[] = [];
    root.querySelectorAll<HTMLHeadingElement>("h2.g-h2, h3.g-h3").forEach((h) => {
      if (!h.id) return;
      found.push({
        id: h.id,
        text: (h.textContent ?? "").trim(),
        depth: h.tagName === "H2" ? 2 : 3,
      });
    });
    setItems(found);

    // IntersectionObserver to track active heading.
    const targets = found
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el != null);
    if (!targets.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          setActive(visible[0]!.target.id);
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: [0, 1] },
    );
    targets.forEach((t) => obs.observe(t));
    return () => obs.disconnect();
  }, [rootSelector]);

  if (items.length < 2) return null;

  return (
    <nav className="toc" aria-label="On this page">
      <div className="rail-title">On this page</div>
      <ol>
        {items.map((h) => (
          <li key={h.id} className={`depth-${h.depth}`}>
            <a
              href={`#${h.id}`}
              className={active === h.id ? "active" : ""}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(h.id);
                if (!el) return;
                const y = el.getBoundingClientRect().top + window.pageYOffset - 60;
                window.scrollTo({ top: y, behavior: "smooth" });
                history.replaceState(null, "", `#${h.id}`);
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
