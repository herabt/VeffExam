"use client";

import { useEffect, useState } from "react";
import {
  boot,
  elapsedSeconds,
  formatDuration,
  onSessionChange,
  visitedCount,
} from "@/lib/session";

export function SessionStat() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    boot();
    return onSessionChange(() => setTick((t) => t + 1));
  }, []);
  // tick is a render trigger; values come from session getters
  void tick;
  const dur = formatDuration(elapsedSeconds());
  const v = visitedCount();
  return (
    <span
      className="palette-trigger"
      style={{ minWidth: 0, cursor: "default" }}
      aria-label={`Session: ${dur}, ${v} topics visited`}
      title="This session"
    >
      <span style={{ color: "var(--fg-subtle)" }}>session</span>
      <span style={{ fontVariantNumeric: "tabular-nums" }}>{dur}</span>
      <span style={{ color: "var(--fg-subtle)" }}>· {v}</span>
    </span>
  );
}
