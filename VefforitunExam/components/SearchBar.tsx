"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Search the active page's <main> content and wrap matches in <mark>.
 * Ports the searchG() helper from the original glossary-viewer.html.
 */
export function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Focus on "/" like most docs sites
      if (e.key === "/" && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        setValue("");
        clearMarks();
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    const needle = value.trim();
    clearMarks();
    if (needle.length < 2) return;
    highlight(needle);
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Search this page…  (press / to focus)"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      aria-label="Search"
    />
  );
}

function clearMarks() {
  document.querySelectorAll("main mark").forEach((m) => {
    const parent = m.parentNode;
    if (!parent) return;
    parent.replaceChild(document.createTextNode(m.textContent ?? ""), m);
    parent.normalize();
  });
}

function highlight(needle: string) {
  const main = document.querySelector("main");
  if (!main) return;
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const re = new RegExp(`(${escapeRegex(needle)})`, "gi");
  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (re.test(node.textContent ?? "")) textNodes.push(node as Text);
    re.lastIndex = 0;
  }
  let first: HTMLElement | null = null;
  textNodes.forEach((n) => {
    const span = document.createElement("span");
    span.innerHTML = (n.textContent ?? "").replace(re, "<mark>$1</mark>");
    n.parentNode?.replaceChild(span, n);
    if (!first) first = span.querySelector("mark");
  });
  if (first) (first as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
