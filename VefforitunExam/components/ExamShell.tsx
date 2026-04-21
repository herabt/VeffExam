"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildMarkdownDownload,
  clearAnswers,
  loadAnswers,
  saveAnswer,
  triggerDownload,
} from "@/lib/storage";
import { register, keys } from "@/lib/shortcuts";
import { markVisit } from "@/lib/session";
import { topicKey as pKey, updateTopic } from "@/lib/progress";
import type { TopicKind } from "@/lib/registry";

interface Props {
  topicKey: string;
  topicKind: TopicKind;
  topicSlug: string;
  title: string;
  children: React.ReactNode;
}

interface QState {
  id: string;
  answered: boolean;
  revealed: boolean;
}

export function ExamShell({ topicKey, topicKind, topicSlug, title, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<QState[]>([]);
  const [current, setCurrent] = useState<number>(0);
  const [status, setStatus] = useState("");
  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressKey = pKey({ kind: topicKind, slug: topicSlug });

  const showStatus = useCallback((msg: string) => {
    setStatus(msg);
    if (statusTimer.current) clearTimeout(statusTimer.current);
    statusTimer.current = setTimeout(() => setStatus(""), 1200);
  }, []);

  const refreshStatus = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const headings = root.querySelectorAll("h3.g-h3");
    const list: QState[] = [];
    headings.forEach((h, idx) => {
      const id = `${topicKey}-q${idx + 1}`;
      const ta = root.querySelector<HTMLTextAreaElement>(`textarea[data-qa-id="${id}"]`);
      const det = nextDetails(h);
      list.push({
        id,
        answered: !!ta?.value.trim(),
        revealed: !!det?.open,
      });
    });
    setQuestions(list);

    // persist topic-level progress
    const answered = list.filter((q) => q.answered).length;
    const revealed = list.filter((q) => q.revealed).length;
    updateTopic(progressKey, { answered, total: list.length, revealed });
  }, [topicKey, progressKey]);

  // Post-mount: inject textareas + restore saved answers + wire listeners.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    markVisit(progressKey);

    const stored = loadAnswers(topicKey);
    const headings = root.querySelectorAll("h3.g-h3");
    headings.forEach((h, idx) => {
      const det = nextDetails(h);
      if (!det) return;
      // Don't double-inject on React re-runs.
      if (det.previousElementSibling?.classList.contains("qa-answer-box")) return;

      const qid = `${topicKey}-q${idx + 1}`;
      const wrap = document.createElement("div");
      wrap.className = "qa-answer-box";
      const label = document.createElement("label");
      label.textContent = `Your answer · Q${idx + 1}`;
      const ta = document.createElement("textarea");
      ta.dataset.qaId = qid;
      ta.placeholder = "Type your answer. Auto-saves. Press Tab to move on.";
      ta.value = stored[qid] ?? "";
      ta.addEventListener("input", () => {
        saveAnswer(topicKey, qid, ta.value);
        refreshStatus();
        showStatus("saved");
      });
      ta.addEventListener("focus", () => setCurrent(idx));
      wrap.appendChild(label);
      wrap.appendChild(ta);
      det.parentNode?.insertBefore(wrap, det);

      // Also wire <details> toggle so we can track revealed state
      det.addEventListener("toggle", refreshStatus);
    });

    refreshStatus();

    // IntersectionObserver to track current question as user scrolls
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          const h = visible[0]!.target as HTMLElement;
          const idx = Array.from(headings).indexOf(h);
          if (idx >= 0) setCurrent(idx);
        }
      },
      { rootMargin: "-90px 0px -70% 0px", threshold: [0, 1] },
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicKey, progressKey]);

  // Keyboard shortcuts (scoped to exam pages)
  useEffect(() => {
    const offs = [
      register({
        id: "q-next",
        label: "Next question",
        keys: ["n"],
        group: "Exam",
        match: keys.plain("n"),
        handler: () => jumpToQuestion(current + 1),
      }),
      register({
        id: "q-prev",
        label: "Previous question",
        keys: ["p"],
        group: "Exam",
        match: keys.plain("p"),
        handler: () => jumpToQuestion(current - 1),
      }),
      register({
        id: "q-reveal",
        label: "Toggle current answer",
        keys: ["a"],
        group: "Exam",
        match: keys.plain("a"),
        handler: () => toggleCurrent(),
      }),
      register({
        id: "q-reveal-all",
        label: "Show / hide all answers",
        keys: ["Shift", "a"],
        group: "Exam",
        match: keys.shift("a"),
        handler: () => toggleAll(),
      }),
      register({
        id: "q-download",
        label: "Download my answers",
        keys: ["d"],
        group: "Exam",
        match: keys.plain("d"),
        handler: () => handleDownload(),
      }),
    ];
    return () => offs.forEach((o) => o());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, questions.length]);

  const jumpToQuestion = (idx: number) => {
    const root = rootRef.current;
    if (!root) return;
    const headings = root.querySelectorAll<HTMLHeadingElement>("h3.g-h3");
    const target = headings[Math.max(0, Math.min(idx, headings.length - 1))];
    if (!target) return;
    const y = target.getBoundingClientRect().top + window.pageYOffset - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
    // Also focus the associated textarea after the scroll settles
    setTimeout(() => {
      const qid = `${topicKey}-q${idx + 1}`;
      const ta = root.querySelector<HTMLTextAreaElement>(`textarea[data-qa-id="${qid}"]`);
      ta?.focus({ preventScroll: true });
    }, 350);
  };

  const toggleCurrent = () => {
    const root = rootRef.current;
    if (!root) return;
    const h = root.querySelectorAll<HTMLHeadingElement>("h3.g-h3")[current];
    const det = h ? nextDetails(h) : null;
    if (det) {
      det.open = !det.open;
      refreshStatus();
    }
  };

  const toggleAll = () => {
    const root = rootRef.current;
    if (!root) return;
    const ds = root.querySelectorAll<HTMLDetailsElement>("details.ans");
    const anyClosed = Array.from(ds).some((d) => !d.open);
    ds.forEach((d) => (d.open = anyClosed));
    refreshStatus();
  };

  const handleClear = () => {
    if (!window.confirm("Clear all your answers in this exam?")) return;
    clearAnswers(topicKey);
    rootRef.current
      ?.querySelectorAll<HTMLTextAreaElement>("textarea[data-qa-id]")
      .forEach((t) => { t.value = ""; });
    refreshStatus();
    showStatus("cleared");
  };

  const handleDownload = () => {
    const root = rootRef.current;
    if (!root) return;
    const current = loadAnswers(topicKey);
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
    showStatus("downloaded");
  };

  const answered = questions.filter((q) => q.answered).length;
  const total = questions.length;
  const pct = total ? Math.round((answered / total) * 100) : 0;
  const hasAnswers = answered > 0;

  return (
    <>
      <div className="exam-bar" role="toolbar" aria-label="Exam controls">
        <div className="exam-progress">
          <span className="pct">{pct}%</span>
          <div className="track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="count">{answered}/{total}</span>
        </div>
        <div className="exam-actions">
          <button type="button" className="btn" onClick={() => jumpToQuestion(current - 1)} aria-label="Previous question (p)">
            <kbd className="kbd">p</kbd> Prev
          </button>
          <button type="button" className="btn" onClick={() => jumpToQuestion(current + 1)} aria-label="Next question (n)">
            Next <kbd className="kbd">n</kbd>
          </button>
          <button type="button" className="btn" onClick={toggleCurrent} aria-label="Toggle current answer (a)">
            <kbd className="kbd">a</kbd> Reveal
          </button>
          <button type="button" className="btn" onClick={toggleAll} aria-label="Show or hide all answers (Shift+A)">
            Reveal all
          </button>
          <button
            type="button"
            className="btn primary"
            onClick={handleDownload}
            disabled={!hasAnswers}
            title={hasAnswers ? "Download a .md of your answers and the correct answers" : "Answer at least one question to enable download"}
          >
            <Down /> Download
          </button>
          <button type="button" className="btn danger" onClick={handleClear}>
            Clear
          </button>
          {status && <span style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-muted)", marginLeft: 4 }}>{status}</span>}
        </div>
      </div>

      <div ref={rootRef}>{children}</div>

      {/* Floating question map in the right rail */}
      <aside className="rail" aria-label="Question map">
        <section className="rail-section">
          <div className="rail-title">Questions</div>
          <div className="q-nav">
            {questions.map((q, i) => (
              <button
                key={q.id}
                type="button"
                className={
                  "q-dot" +
                  (q.revealed ? " revealed" : q.answered ? " answered" : "") +
                  (i === current ? " current" : "")
                }
                onClick={() => jumpToQuestion(i)}
                aria-label={`Question ${i + 1}${q.answered ? " (answered)" : ""}${q.revealed ? " (revealed)" : ""}`}
                title={`Q${i + 1}${q.answered ? " · answered" : ""}${q.revealed ? " · revealed" : ""}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div style={{ marginTop: "var(--s-3)", fontFamily: "var(--f-mono)", fontSize: 10.5, color: "var(--fg-subtle)", lineHeight: 1.5 }}>
            <Legend color="var(--surface-alt)" label="not answered" />
            <Legend color="color-mix(in oklch, var(--accent) 20%, var(--surface))" label="answered" />
            <Legend color="color-mix(in oklch, var(--success) 20%, var(--surface))" label="revealed" />
          </div>
        </section>
        <section className="rail-section">
          <div className="rail-title">Shortcuts</div>
          <div style={{ fontFamily: "var(--f-mono)", fontSize: 11, color: "var(--fg-muted)", lineHeight: 1.8 }}>
            <div><kbd className="kbd">n</kbd> / <kbd className="kbd">p</kbd> next / prev</div>
            <div><kbd className="kbd">a</kbd> toggle answer</div>
            <div><kbd className="kbd">Shift</kbd>+<kbd className="kbd">A</kbd> all</div>
            <div><kbd className="kbd">d</kbd> download</div>
            <div><kbd className="kbd">?</kbd> all shortcuts</div>
          </div>
        </section>
      </aside>
    </>
  );
}

function nextDetails(h: Element): HTMLDetailsElement | null {
  let cursor: Element | null = h.nextElementSibling;
  while (cursor) {
    if (cursor.tagName === "H3") return null;
    if (cursor.tagName === "DETAILS" && cursor.classList.contains("ans")) return cursor as HTMLDetailsElement;
    cursor = cursor.nextElementSibling;
  }
  return null;
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, margin: "2px 0" }}>
      <span style={{ display: "inline-block", width: 10, height: 10, background: color, borderRadius: 2, border: "1px solid var(--border)" }} />
      <span>{label}</span>
    </div>
  );
}

function Down() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 1v8m0 0L3 6.5M6 9l3-2.5M2 11h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
