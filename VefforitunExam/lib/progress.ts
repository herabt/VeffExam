// Per-topic progress + recent-visits tracking.
// All state is in a single localStorage key so reads stay cheap.

import type { Topic } from "./registry";

export interface TopicProgress {
  lastVisitedAt: number;
  scrollPct?: number;       // 0–100, for study/glossary pages
  answered?: number;        // count of textareas with non-empty value (exams)
  total?: number;           // question count (exams)
  revealed?: number;        // count of opened <details class="ans"> (optional)
}

export type ProgressMap = Record<string, TopicProgress>;

const KEY = "vf.progress.v1";

export function topicKey(t: Pick<Topic, "kind" | "slug">): string {
  return `${t.kind}:${t.slug}`;
}

export function readProgress(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as ProgressMap;
  } catch {
    return {};
  }
}

export function writeProgress(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent("vf:progress"));
}

export function updateTopic(key: string, patch: Partial<TopicProgress>): void {
  const m = readProgress();
  m[key] = { ...m[key], ...patch, lastVisitedAt: Date.now() };
  writeProgress(m);
}

export function recent(limit = 8): Array<{ key: string; data: TopicProgress }> {
  const m = readProgress();
  return Object.entries(m)
    .map(([key, data]) => ({ key, data }))
    .sort((a, b) => b.data.lastVisitedAt - a.data.lastVisitedAt)
    .slice(0, limit);
}

export function onProgressChange(cb: () => void): () => void {
  const h = () => cb();
  window.addEventListener("vf:progress", h);
  window.addEventListener("storage", h);
  return () => {
    window.removeEventListener("vf:progress", h);
    window.removeEventListener("storage", h);
  };
}
