// Lightweight session tracking: time-since-load + topics visited this session.
// Session = current browser tab load; resets on reload.

let startedAt = 0;
const visited = new Set<string>();

export function boot(): void {
  if (!startedAt) startedAt = Date.now();
}

export function markVisit(topicKey: string): void {
  boot();
  visited.add(topicKey);
  window.dispatchEvent(new CustomEvent("vf:session"));
}

export function elapsedSeconds(): number {
  if (!startedAt) return 0;
  return Math.floor((Date.now() - startedAt) / 1000);
}

export function visitedCount(): number {
  return visited.size;
}

export function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  if (m < 1) return `${sec}s`;
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

export function onSessionChange(cb: () => void): () => void {
  const h = () => cb();
  window.addEventListener("vf:session", h);
  const t = window.setInterval(h, 30_000); // refresh duration every 30s
  return () => {
    window.removeEventListener("vf:session", h);
    window.clearInterval(t);
  };
}
