// Tiny global keyboard-shortcut manager.
// Not a React hook so it stays dead-simple and components can register listeners
// in effects without a provider tree.

export type ShortcutHandler = (e: KeyboardEvent) => void;

export interface Shortcut {
  id: string;
  /** Human-readable description for the help modal */
  label: string;
  /** Keys displayed to the user in the help modal */
  keys: string[];
  /** Group for help-modal display order */
  group: "Navigation" | "Study" | "Exam" | "UI";
  /** Match a KeyboardEvent — return true to invoke handler */
  match: (e: KeyboardEvent) => boolean;
  handler: ShortcutHandler;
  /** When true, fires even if focus is in an input/textarea */
  allowInInput?: boolean;
}

const registry = new Map<string, Shortcut>();
let wired = false;

function isTypingTarget(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  if (t.isContentEditable) return true;
  const tag = t.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function onKey(e: KeyboardEvent) {
  for (const s of registry.values()) {
    if (!s.allowInInput && isTypingTarget(e.target)) continue;
    if (s.match(e)) {
      s.handler(e);
      return;
    }
  }
}

export function register(s: Shortcut): () => void {
  registry.set(s.id, s);
  if (!wired && typeof window !== "undefined") {
    window.addEventListener("keydown", onKey);
    wired = true;
  }
  window.dispatchEvent(new CustomEvent("vf:shortcuts"));
  return () => {
    registry.delete(s.id);
    window.dispatchEvent(new CustomEvent("vf:shortcuts"));
  };
}

export function list(): Shortcut[] {
  return Array.from(registry.values());
}

/** Common matchers. */
export const keys = {
  /** Cmd on Mac, Ctrl elsewhere + a single key */
  mod: (k: string) => (e: KeyboardEvent) =>
    (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === k.toLowerCase(),
  plain: (k: string) => (e: KeyboardEvent) =>
    !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey && e.key === k,
  shift: (k: string) => (e: KeyboardEvent) =>
    !e.metaKey && !e.ctrlKey && !e.altKey && e.shiftKey && e.key.toLowerCase() === k.toLowerCase(),
};

export function onShortcutsChange(cb: () => void): () => void {
  const h = () => cb();
  window.addEventListener("vf:shortcuts", h);
  return () => window.removeEventListener("vf:shortcuts", h);
}
