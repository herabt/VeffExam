"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  emptyAnswer,
  isAnswered,
  isCorrect,
  parseQuestions,
  type Answer,
  type AnswerMap,
  type ParsedQuestion,
} from "@/lib/examParser";
import { QuestionWidget, VerdictPill } from "./QuestionWidgets";
import { markVisit } from "@/lib/session";
import { topicKey as pKey, updateTopic } from "@/lib/progress";
import { triggerDownload } from "@/lib/storage";
import { register, keys } from "@/lib/shortcuts";
import type { TopicKind } from "@/lib/registry";

interface Props {
  topicKey: string;           // e.g., "exam-3"
  topicKind: TopicKind;
  topicSlug: string;
  title: string;
  children: React.ReactNode;  // <FragmentView>
}

const STORAGE_PREFIX = "qaAnswers_";

export function ExamShell({ topicKey, topicKind, topicSlug, title, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [mountPoints, setMountPoints] = useState<Record<string, HTMLElement>>({});
  const progressKey = pKey({ kind: topicKind, slug: topicSlug });

  // Parse DOM + hide original option lists / blank <p>s + create mount points
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    markVisit(progressKey);
    const parsed = parseQuestions(root);

    const mounts: Record<string, HTMLElement> = {};
    parsed.forEach((q) => {
      // Hide original <ul> of options for radio / checkbox
      if ((q.type === "radio" || q.type === "checkbox") && q.optionsList) {
        q.optionsList.dataset.qHidden = "1";
        q.optionsList.style.display = "none";
      }
      // For fillBlank: hide any prompt <p> that contains the blank pattern
      if (q.type === "fillBlank") {
        q.promptEls.forEach((el) => {
          if (el.tagName === "P" && /_{3,}/.test(el.textContent ?? "")) {
            el.dataset.qHidden = "1";
            el.style.display = "none";
          }
        });
      }

      // Mount point inserted before <details>
      const mount = document.createElement("div");
      mount.className = "q-mount";
      mount.dataset.qid = q.id;
      const target = q.detailsEl ?? q.heading.parentElement?.appendChild?.bind(q.heading.parentElement);
      if (q.detailsEl?.parentNode) {
        q.detailsEl.parentNode.insertBefore(mount, q.detailsEl);
      } else {
        // no details? append after the prompt
        (q.promptEls.at(-1) ?? q.heading).insertAdjacentElement("afterend", mount);
      }
      mounts[q.id] = mount;
      void target;
    });

    setQuestions(parsed);
    setMountPoints(mounts);

    // Restore saved answers + submitted flags
    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + topicKey);
      if (raw) {
        const saved = JSON.parse(raw) as { answers?: AnswerMap; submitted?: Record<string, boolean> };
        if (saved.answers) setAnswers(saved.answers);
        if (saved.submitted) setSubmitted(saved.submitted);
      }
    } catch {
      // ignore
    }

    return () => {
      // Clean up mount points; restore hidden elements
      Object.values(mounts).forEach((m) => m.remove());
      parsed.forEach((q) => {
        q.optionsList?.removeAttribute("data-q-hidden");
        if (q.optionsList) q.optionsList.style.display = "";
        q.promptEls.forEach((el) => {
          el.removeAttribute("data-q-hidden");
          el.style.display = "";
        });
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicKey, progressKey]);

  // Persist answers whenever they change
  useEffect(() => {
    if (!questions.length) return;
    try {
      window.localStorage.setItem(
        STORAGE_PREFIX + topicKey,
        JSON.stringify({ answers, submitted }),
      );
    } catch {}
  }, [answers, submitted, questions.length, topicKey]);

  // Keep global progress (sidebar/dashboard) in sync
  useEffect(() => {
    if (!questions.length) return;
    const answered = questions.filter((q) => isAnswered(answers[q.id])).length;
    const revealed = Object.values(submitted).filter(Boolean).length;
    updateTopic(progressKey, {
      answered,
      total: questions.length,
      revealed,
    });
  }, [answers, submitted, questions, progressKey]);

  // Score derivation
  const score = useMemo(() => {
    let correct = 0;
    let gradable = 0;
    let submittedCount = 0;
    questions.forEach((q) => {
      if (submitted[q.id]) {
        submittedCount++;
        const res = isCorrect(q, answers[q.id]);
        if (res === true) correct++;
        if (res !== null) gradable++;
      }
    });
    const answered = questions.filter((q) => isAnswered(answers[q.id])).length;
    return { correct, gradable, submitted: submittedCount, answered, total: questions.length };
  }, [questions, answers, submitted]);

  // ── Handlers ────────────────────────────────────────────────────────
  const onAnswerChange = useCallback((qid: string, a: Answer) => {
    setAnswers((prev) => ({ ...prev, [qid]: a }));
  }, []);

  const submitQuestion = useCallback((qid: string) => {
    setSubmitted((prev) => ({ ...prev, [qid]: true }));
    const q = questions.find((x) => x.id === qid);
    if (q?.detailsEl) q.detailsEl.open = true;
    // Scroll heading into view
    q?.heading.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [questions]);

  const unsubmitQuestion = useCallback((qid: string) => {
    setSubmitted((prev) => {
      const next = { ...prev };
      delete next[qid];
      return next;
    });
    const q = questions.find((x) => x.id === qid);
    if (q?.detailsEl) q.detailsEl.open = false;
  }, [questions]);

  const submitAll = useCallback(() => {
    const next: Record<string, boolean> = {};
    questions.forEach((q) => { if (isAnswered(answers[q.id])) next[q.id] = true; });
    setSubmitted(next);
    questions.forEach((q) => { if (q.detailsEl && next[q.id]) q.detailsEl.open = true; });
  }, [questions, answers]);

  const resetAll = useCallback(() => {
    if (!window.confirm("Clear all your answers for this exam?")) return;
    const blank: AnswerMap = {};
    questions.forEach((q) => { blank[q.id] = emptyAnswer(q.type, q.blanks ?? 0); });
    setAnswers(blank);
    setSubmitted({});
    questions.forEach((q) => { if (q.detailsEl) q.detailsEl.open = false; });
  }, [questions]);

  const download = useCallback(() => {
    const blob = buildMarkdown({ title, questions, answers, submitted });
    triggerDownload(
      `${title.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${new Date().toISOString().slice(0, 10)}.md`,
      blob,
    );
  }, [title, questions, answers, submitted]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────
  useEffect(() => {
    const offs = [
      register({
        id: "exam-submit-all",
        label: "Submit all answered questions",
        keys: ["Shift", "Enter"],
        group: "Exam",
        match: (e) => !e.metaKey && !e.ctrlKey && !e.altKey && e.shiftKey && e.key === "Enter",
        handler: (e) => { e.preventDefault(); submitAll(); },
        allowInInput: true,
      }),
      register({
        id: "exam-download",
        label: "Download my answers",
        keys: ["d"],
        group: "Exam",
        match: keys.plain("d"),
        handler: download,
      }),
    ];
    return () => offs.forEach((o) => o());
  }, [submitAll, download]);

  // ── Render ──────────────────────────────────────────────────────────
  const progress = questions.length
    ? Math.round((score.answered / questions.length) * 100)
    : 0;

  return (
    <>
      <div className="exam-bar" role="toolbar" aria-label="Exam controls">
        <div className="exam-progress">
          <span className="pct">{progress}%</span>
          <div className="track" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div className="fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="count">
            {score.answered}/{score.total}
          </span>
          {score.submitted > 0 && score.gradable > 0 && (
            <span className="score-chip" title="Auto-gradable questions only; written answers aren't scored">
              score&nbsp;<b>{score.correct}/{score.gradable}</b>
            </span>
          )}
        </div>
        <div className="exam-actions">
          <button type="button" className="btn primary" onClick={submitAll} disabled={score.answered === 0}>
            Submit all
          </button>
          <button type="button" className="btn" onClick={download} disabled={score.answered === 0} title="Export a .md with your answers and the correct answers">
            Download
          </button>
          <button type="button" className="btn danger" onClick={resetAll}>
            Reset
          </button>
        </div>
      </div>

      <div ref={rootRef}>{children}</div>

      {/* Render widgets into per-question mount points via portals */}
      {questions.map((q) => {
        const mount = mountPoints[q.id];
        if (!mount) return null;
        const answer = answers[q.id] ?? emptyAnswer(q.type, q.blanks ?? 0);
        const sub = !!submitted[q.id];
        const answered = isAnswered(answer);
        return createPortal(
          <div className={`q-box q-type-${q.type}${sub ? " submitted" : ""}`}>
            <QuestionWidget
              question={q}
              answer={answer}
              onChange={(a) => onAnswerChange(q.id, a)}
              submitted={sub}
            />
            <div className="q-footer">
              {!sub ? (
                <button
                  type="button"
                  className="btn primary sm"
                  onClick={() => submitQuestion(q.id)}
                  disabled={!answered}
                >
                  Check answer
                </button>
              ) : (
                <>
                  <VerdictPill question={q} answer={answer} />
                  <button type="button" className="btn sm" onClick={() => unsubmitQuestion(q.id)}>
                    Edit
                  </button>
                </>
              )}
              <span className="q-spacer" />
              <span className="q-idx">
                Q{q.index + 1}/{questions.length}
              </span>
            </div>
          </div>,
          mount,
          q.id,
        );
      })}
    </>
  );
}

// ─── Markdown download ────────────────────────────────────────────────
function buildMarkdown(args: {
  title: string;
  questions: ParsedQuestion[];
  answers: AnswerMap;
  submitted: Record<string, boolean>;
}): Blob {
  const { title, questions, answers, submitted } = args;
  const lines: string[] = [
    `# ${title}`,
    "",
    `**Date:** ${new Date().toLocaleString()}`,
    "",
    "",
  ];
  let correct = 0;
  let gradable = 0;
  questions.forEach((q, i) => {
    const a = answers[q.id];
    const was = !!submitted[q.id];
    const verdict = was ? isCorrect(q, a) : null;
    if (verdict === true) correct++;
    if (verdict !== null && was) gradable++;

    lines.push(`## Q${i + 1}. ${q.headingText}`);

    const prompt = q.promptEls
      .filter((el) => !el.dataset.qHidden)
      .map((el) => (el.textContent ?? "").trim())
      .filter(Boolean)
      .join("\n\n");
    if (prompt) lines.push("", prompt);

    if ((q.type === "radio" || q.type === "checkbox") && q.options) {
      lines.push("", ...q.options.map((o) => `- ${o.id}) ${o.label}`));
    }

    lines.push("", "**My answer:**");
    lines.push(formatAnswer(q, a));

    lines.push("", "**Correct answer:**");
    lines.push(formatCorrect(q));

    if (was) {
      if (verdict === true) lines.push("", "✅ correct");
      else if (verdict === false) lines.push("", "❌ not quite");
    }

    lines.push("", "---", "");
  });

  lines.unshift(
    "",
    `**Score:** ${correct}/${gradable} auto-graded correct` +
      (questions.length > gradable ? ` · ${questions.length - gradable} written answers not auto-graded` : ""),
    "",
  );

  return new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
}

function formatAnswer(q: ParsedQuestion, a: Answer | undefined): string {
  if (!a) return "_(blank)_";
  switch (a.type) {
    case "fillBlank":
      if (!a.values.some((v) => v.trim())) return "_(blank)_";
      return a.values.map((v, i) => `${i + 1}. ${v.trim() || "_(blank)_"}`).join("\n");
    case "radio": {
      if (!a.option) return "_(blank)_";
      const o = q.options?.find((x) => x.id === a.option);
      return `${a.option}) ${o?.label ?? ""}`;
    }
    case "checkbox":
      if (!a.options.length) return "_(blank)_";
      return a.options.map((id) => {
        const o = q.options?.find((x) => x.id === id);
        return `- ${id}) ${o?.label ?? ""}`;
      }).join("\n");
    case "text":
      return a.text.trim() ? a.text : "_(blank)_";
  }
}

function formatCorrect(q: ParsedQuestion): string {
  if (q.correct.fillBlank?.length) {
    return q.correct.fillBlank.map((v, i) => `${i + 1}. ${v}`).join("\n");
  }
  if (q.correct.radio) {
    const o = q.options?.find((x) => x.id === q.correct.radio);
    return `${q.correct.radio}) ${o?.label ?? ""}`;
  }
  if (q.correct.checkbox?.length) {
    return q.correct.checkbox.map((id) => {
      const o = q.options?.find((x) => x.id === id);
      return `- ${id}) ${o?.label ?? ""}`;
    }).join("\n");
  }
  // text: pull from details body
  const body = q.detailsEl?.querySelector(".ans-body");
  return (body?.textContent ?? "").trim() || "_(not provided)_";
}
