"use client";

import { useEffect, useState } from "react";
import { setTheme } from "@/lib/theme";

export function ThemeToggle() {
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const read = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      setResolved(attr === "dark" ? "dark" : "light");
    };
    read();
    const onChange = () => read();
    window.addEventListener("vf:theme", onChange);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("vf:theme", onChange);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const toggle = () => {
    const next = resolved === "dark" ? "light" : "dark";
    setTheme(next);
    setResolved(next);
  };

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label="Toggle theme"
      title={`Switch to ${resolved === "dark" ? "light" : "dark"} theme`}
    >
      {resolved === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}

function Sun() {
  const rays = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" />
      {rays.map((a) => {
        const r = (a * Math.PI) / 180;
        const x1 = 8 + Math.cos(r) * 5;
        const y1 = 8 + Math.sin(r) * 5;
        const x2 = 8 + Math.cos(r) * 7;
        const y2 = 8 + Math.sin(r) * 7;
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />;
      })}
    </svg>
  );
}

function Moon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13 9.5A5.5 5.5 0 0 1 6.5 3c0-.6.1-1.2.3-1.8A6.5 6.5 0 1 0 14.8 9.2c-.6.2-1.2.3-1.8.3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
