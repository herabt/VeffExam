"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";
import { CommandPalette } from "./CommandPalette";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { register, keys } from "@/lib/shortcuts";
import { applyTheme, readTheme } from "@/lib/theme";

export function AppShell({ children }: { children: ReactNode }) {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);

  // Apply theme once on client hydration (handles system → resolved case)
  useEffect(() => {
    applyTheme(readTheme());
  }, []);

  // Global shortcuts
  useEffect(() => {
    const offs = [
      register({
        id: "palette",
        label: "Open command palette",
        keys: ["⌘", "K"],
        group: "UI",
        match: (e) => keys.mod("k")(e),
        handler: (e) => {
          e.preventDefault();
          setPaletteOpen((v) => !v);
        },
        allowInInput: true,
      }),
      register({
        id: "help",
        label: "Show keyboard shortcuts",
        keys: ["?"],
        group: "UI",
        match: (e) => !e.metaKey && !e.ctrlKey && !e.altKey && e.key === "?",
        handler: (e) => {
          e.preventDefault();
          setHelpOpen((v) => !v);
        },
      }),
      register({
        id: "home",
        label: "Go home",
        keys: ["g", "h"],
        group: "Navigation",
        match: keys.plain("h"),
        handler: () => {
          if (pendingG) {
            window.location.href = "/";
            pendingG = false;
          }
        },
      }),
      register({
        id: "g-prefix",
        label: "Start navigation prefix",
        keys: ["g"],
        group: "Navigation",
        match: keys.plain("g"),
        handler: () => {
          pendingG = true;
          setTimeout(() => { pendingG = false; }, 900);
        },
      }),
      register({
        id: "esc-drawer",
        label: "Close drawer",
        keys: ["Esc"],
        group: "UI",
        match: keys.plain("Escape"),
        handler: () => setDrawerOpen(false),
      }),
    ];
    return () => offs.forEach((off) => off());
  }, []);

  return (
    <div className="app">
      <Topbar
        onOpenPalette={openPalette}
        onOpenDrawer={() => setDrawerOpen(true)}
      />
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      {children}

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
      {helpOpen && <ShortcutsHelp onClose={() => setHelpOpen(false)} />}
    </div>
  );
}

// module-scoped flag so "g h" chord works across the two shortcut handlers
let pendingG = false;
