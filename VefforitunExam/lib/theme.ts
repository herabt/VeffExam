// Theme: light / dark / system, persisted per device.
// Applied via `data-theme` attribute on <html>.

export type Theme = "light" | "dark" | "system";
const KEY = "vf.theme";

export function readTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const raw = window.localStorage.getItem(KEY);
  return raw === "light" || raw === "dark" ? raw : "system";
}

export function resolveTheme(t: Theme): "light" | "dark" {
  if (t !== "system") return t;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(t: Theme): void {
  const resolved = resolveTheme(t);
  document.documentElement.setAttribute("data-theme", resolved);
}

export function setTheme(t: Theme): void {
  window.localStorage.setItem(KEY, t);
  applyTheme(t);
  window.dispatchEvent(new CustomEvent("vf:theme"));
}

/** Script string — injected inline in <head> to prevent FOUC. */
export const THEME_PREFLIGHT = `
(function(){try{
  var raw=localStorage.getItem('vf.theme');
  var t=(raw==='light'||raw==='dark')?raw:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.setAttribute('data-theme',t);
}catch(e){}})();
`.trim();
