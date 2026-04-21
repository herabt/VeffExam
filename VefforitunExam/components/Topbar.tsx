"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { KIND_LABELS, TOPICS, topicHref } from "@/lib/registry";
import { ThemeToggle } from "./ThemeToggle";
import { SessionStat } from "./SessionStat";

interface Props {
  onOpenPalette: () => void;
  onOpenDrawer: () => void;
}

export function Topbar({ onOpenPalette, onOpenDrawer }: Props) {
  const pathname = usePathname();
  const current = useMemo(
    () => TOPICS.find((t) => topicHref(t) === pathname),
    [pathname],
  );
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const modKey = isMac ? "⌘" : "Ctrl";

  return (
    <header className="topbar" role="banner">
      <button
        className="icon-btn mobile-only"
        aria-label="Open navigation"
        onClick={onOpenDrawer}
      >
        <Hamburger />
      </button>

      <Link href="/" className="brand" aria-label="Home">
        veff<span className="dot">.</span>
      </Link>

      <nav className="crumbs" aria-label="Breadcrumb">
        {current ? (
          <>
            <span className="sep">/</span>
            <span>{KIND_LABELS[current.kind]}</span>
            <span className="sep">/</span>
            <span className="current">{current.title}</span>
          </>
        ) : (
          <span>Dashboard</span>
        )}
      </nav>

      <div className="topbar-right">
        <button
          type="button"
          className="palette-trigger"
          onClick={onOpenPalette}
          aria-label="Open command palette"
        >
          <Search />
          <span className="label">Jump to topic or question</span>
          <kbd className="kbd">{modKey}K</kbd>
        </button>
        <SessionStat />
        <ThemeToggle />
      </div>
    </header>
  );
}

function Search() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="11" y1="11" x2="14.5" y2="14.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Hamburger() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <line x1="2" y1="5" x2="16" y2="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="2" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
