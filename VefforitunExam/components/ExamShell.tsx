"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildMarkdownDownload,
  clearAnswers,
  loadAnswers,
  saveAnswer,
  triggerDownload,
} from "@/lib/storage";

interface Props {
  topicKey: string;
  title: string;
  children: React.ReactNode;
}

/**
 * Wraps a rendered fragment and adds:
 *   - a textarea under every question so the user can type their answer
 *   - a sticky toolbar: Download (.md), Clear, Show/Hide all answers
 *   - auto-persistence to localStorage, restored on mount
 */
export function ExamShell({ topicKey, title, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string>("");
  const statusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Post-mount: inject textareas + restore saved answers.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stored = loadAnswers(topicKey);

    const headings = root.querySelectorAll("h3.g-h3");
    headings.forEach((h, idx) => {
      // Find the next <details class="ans"> sibling (skip over prompt nodes).
      let cursor: Element | null = h.nextElementSibling;
      while (cursor && !(cursor.tagName === "DETAILS" && cursor.classList.contains("ans"))) {
        if (cursor.tagName === "H3") return; // no answer block, skip
        cursor = cursor.nextElementSibling;
      }
      if (!cursor) return;

      // Don't double-inject if re-rendered.
      if (cursor.previousElementSibling?.classList.contains("qa-answer-box")) return;

      const qid = `${topicKey}-q${idx + 1}`;
      const wrap = document.createElement("div");
      wrap.className = "qa-answer-box";
      const label = document.createElement("label");
      label.textContent = "✏️ Your answer:";
      const ta = document.createElement("textarea");
      ta.dataset.qaId = qid;
      ta.placeholder = "Type your answer here. Auto-saves.";
      ta.value = stored[qid] ?? "";
      ta.addEventListener("input", () => {
        saveAnswer(topicKey, qid, ta.value);
        showStatus("💾 saved");
      });
      wrap.appendChild(label);
      wrap.appendChild(ta);
      cursor.parentNode?.insertBefore(wrap, cursor);
    });
  }, [topicKey]);

  const showStatus = (msg: string) => {
    setStatus(msg);
    if (statusTimerRef.current) clearTimeout(statusTimerRef.current);
    statusTimerRef.current = setTimeout(() => setStatus(""), 1200);
  };

  const toggleAll = (close: boolean) => {
    rootRef.current?.querySelectorAll("details.ans").forEach((d) => {
      if (close) d.removeAttribute("open");
      else d.setAttribute("open", "");
    });
  };

  const handleClear = () => {
    if (!window.confirm("Clear all your answers in this panel?")) return;
    clearAnswers(topicKey);
    rootRef.current?.querySelectorAll<HTMLTextAreaElement>("textarea[data-qa-id]").forEach((t) => {
      t.value = "";
    });
    showStatus("🧹 cleared");
  };

  const handleDownload = () => {
    const root = rootRef.current;
    if (!root) return;
    const current = loadAnswers(topicKey);
    // Ensure DOM values are persisted in case the listener hasn't fired yet
    root.querySelectorAll<HTMLTextAreaElement>("textarea[data-qa-id]").forEach((t) => {
      if (t.dataset.qaId) current[t.dataset.qaId] = t.value;
    });
    const { filename, blob } = buildMarkdownDownload(
      root,
      title,
      (qid) => current[qid] ?? "",
      topicKey,
    );
    triggerDownload(filename, blob);
    showStatus("📥 downloaded");
  };

  return (
    <>
      <div className="qa-bar">
        <button type="button" className="qa-btn" onClick={handleDownload}>
          📥 Download My Answers
        </button>
        <button type="button" className="qa-btn qa-clr" onClick={handleClear}>
          🗑️ Clear
        </button>
        <button type="button" className="qa-btn qa-toggle" onClick={() => toggleAll(false)}>
          ⬇️ Show All Answers
        </button>
        <button type="button" className="qa-btn qa-toggle" onClick={() => toggleAll(true)}>
          ⬆️ Hide All Answers
        </button>
        <span className="qa-status">{status}</span>
      </div>

      <div ref={rootRef}>{children}</div>
    </>
  );
}
