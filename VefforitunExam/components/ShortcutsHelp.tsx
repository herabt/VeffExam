"use client";

import { useEffect, useState } from "react";
import { list, onShortcutsChange, type Shortcut } from "@/lib/shortcuts";

interface Props { onClose: () => void; }

const GROUP_ORDER: Shortcut["group"][] = ["Navigation", "Study", "Exam", "UI"];

export function ShortcutsHelp({ onClose }: Props) {
  const [items, setItems] = useState<Shortcut[]>([]);
  useEffect(() => {
    setItems(list());
    return onShortcutsChange(() => setItems(list()));
  }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", h); document.body.style.overflow = prev; };
  }, [onClose]);

  const grouped: Record<string, Shortcut[]> = {};
  for (const s of items) {
    if (s.id === "g-prefix") continue; // internal
    (grouped[s.group] ??= []).push(s);
  }

  return (
    <div className="help-scrim" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" onClick={onClose}>
      <div className="help-panel" onClick={(e) => e.stopPropagation()}>
        <h2>Keyboard shortcuts</h2>
        {GROUP_ORDER.map((g) => {
          const entries = grouped[g];
          if (!entries?.length) return null;
          return (
            <section key={g}>
              <h3>{g}</h3>
              <table>
                <tbody>
                  {entries.map((s) => (
                    <tr key={s.id}>
                      <td>{s.label}</td>
                      <td>
                        {s.keys.map((k, i) => (
                          <span key={i}>
                            {i > 0 && <span style={{ margin: "0 4px", color: "var(--fg-subtle)" }}>then</span>}
                            <kbd className="kbd">{k}</kbd>
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          );
        })}
        <div style={{ marginTop: "var(--s-4)", fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-subtle)" }}>
          Press <kbd className="kbd">Esc</kbd> to close this panel.
        </div>
      </div>
    </div>
  );
}
