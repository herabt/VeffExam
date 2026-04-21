"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  emptyAnswer,
  isAnswered,
  isCorrect,
  parseQuestions,
  serializeQuestion,
  type Answer,
  type ParsedQuestion,
} from "@/lib/examParser";
import { QuestionWidget, VerdictPill } from "./QuestionWidgets";

type Filter = "all" | "unseen" | "radio" | "checkbox" | "fillBlank" | "text";

const SESSION_KEY = "vf.practice.v1";

interface SessionState {
  seenIds: string[];
  answered: number;
  correct: number;
  streak: number;
  bestStreak: number;
}

const EMPTY_SESSION: SessionState = {
  seenIds: [],
  answered: 0,
  correct: 0,
  streak: 0,
  bestStreak: 0,
};

/**
 * Renders a single random question at a time from the hidden source pool.
 * The parent server component is expected to put all exam/bonus fragment HTML
 * inside a `<div class="practice-source" data-exam-kind=... data-exam-slug=...>`
 * hierarchy so we can parse + tag each question's source.
 */
export function PracticeShell({ children }: { children: React.ReactNode }) {
  const [all, setAll] = useState<ParsedQuestion[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [session, setSession] = useState<SessionState>(EMPTY_SESSION);

  // Parse the hidden source on mount
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".practice-source");
    if (!root) return;
    const parsed = parseQuestions(root);
    setAll(parsed);

    // Restore session stats only (not currentId — always pick fresh on load)
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const s = JSON.parse(raw) as SessionState;
        setSession({ ...EMPTY_SESSION, ...s });
      }
    } catch {}
  }, []);

  // When pool / filter changes, pick a question if none selected
  useEffect(() => {
    if (!all.length) return;
    if (currentId) return;
    const pool = poolFor(all, filter, session.seenIds);
    const next = pool[Math.floor(Math.random() * pool.length)];
    if (next) {
      setCurrentId(next.id);
      setAnswer(emptyAnswer(next.type, next.blanks ?? 0));
      setSubmitted(false);
    }
  }, [all, filter, currentId, session.seenIds]);

  // Persist session
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {}
  }, [session]);

  const current = useMemo(
    () => all.find((q) => q.id === currentId) ?? null,
    [all, currentId],
  );

  const nextQuestion = useCallback(
    (markSeen: boolean) => {
      if (!all.length) return;
      const seen = markSeen && currentId
        ? Array.from(new Set([...session.seenIds, currentId]))
        : session.seenIds;

      let pool = poolFor(all, filter, seen);
      // If we've exhausted the pool, restart with a fresh seen set.
      let nextSeen = seen;
      if (!pool.length) {
        nextSeen = [];
        pool = poolFor(all, filter, []);
      }
      // Avoid immediately repeating the current question if the pool has more.
      if (pool.length > 1 && currentId) {
        pool = pool.filter((q) => q.id !== currentId);
      }
      const next = pool[Math.floor(Math.random() * pool.length)];
      setSession((s) => ({ ...s, seenIds: nextSeen }));
      if (next) {
        setCurrentId(next.id);
        setAnswer(emptyAnswer(next.type, next.blanks ?? 0));
        setSubmitted(false);
      }
    },
    [all, currentId, filter, session.seenIds],
  );

  const checkAnswer = useCallback(() => {
    if (!current || !answer) return;
    setSubmitted(true);
    const result = isCorrect(current, answer);
    if (current.detailsEl) current.detailsEl.open = true;
    setSession((s) => {
      const answered = s.answered + 1;
      if (result === true) {
        const streak = s.streak + 1;
        return {
          ...s,
          answered,
          correct: s.correct + 1,
          streak,
          bestStreak: Math.max(s.bestStreak, streak),
        };
      }
      if (result === false) {
        return { ...s, answered, streak: 0 };
      }
      // text — not auto-graded
      return { ...s, answered };
    });
  }, [current, answer]);

  const skip = useCallback(() => {
    setSession((s) => ({ ...s, streak: 0 }));
    nextQuestion(true);
  }, [nextQuestion]);

  const resetSession = useCallback(() => {
    if (!window.confirm("Reset your practice session (history, streak, score)?")) return;
    setSession(EMPTY_SESSION);
    nextQuestion(false);
  }, [nextQuestion]);

  const filterCounts = useMemo(() => {
    const counts: Record<Filter, number> = { all: all.length, unseen: 0, radio: 0, checkbox: 0, fillBlank: 0, text: 0 };
    const seen = new Set(session.seenIds);
    all.forEach((q) => {
      counts[q.type]++;
      if (!seen.has(q.id)) counts.unseen++;
    });
    return counts;
  }, [all, session.seenIds]);

  // Shortcuts: N = next, Enter when not in input = check
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      const inInput = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "n" && !inInput) {
        e.preventDefault();
        nextQuestion(true);
      }
      if (e.key === "Enter" && !inInput && !submitted && answer && isAnswered(answer)) {
        e.preventDefault();
        checkAnswer();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [nextQuestion, submitted, answer, checkAnswer]);

  // The hidden source still needs to be rendered (invisibly) so DOM parsing works.
  // `children` is the hidden tree from the server component.

  if (!all.length) {
    return (
      <>
        <div style={{ display: "none" }}>{children}</div>
        <div className="p-empty">Loading practice questions…</div>
      </>
    );
  }

  if (!current) {
    return (
      <>
        <div style={{ display: "none" }}>{children}</div>
        <div className="p-empty">No questions match this filter.</div>
      </>
    );
  }

  const { promptHtml, detailsBodyHtml } = serializeQuestion(current);
  const hitPct = session.answered ? Math.round((session.correct / session.answered) * 100) : 0;
  const seenCount = new Set(session.seenIds).size;

  return (
    <>
      <div style={{ display: "none" }}>{children}</div>

      {/* Stats bar */}
      <div className="practice-bar">
        <div className="practice-stats">
          <div className="p-stat">
            <div className="k">answered</div>
            <div className="v">{session.answered}</div>
          </div>
          <div className="p-stat">
            <div className="k">correct</div>
            <div className="v">{session.correct}<span className="pct">/{session.answered}</span></div>
            {session.answered > 0 && <div className="sub">{hitPct}%</div>}
          </div>
          <div className="p-stat">
            <div className="k">streak</div>
            <div className="v">{session.streak}🔥</div>
            {session.bestStreak > 0 && <div className="sub">best {session.bestStreak}</div>}
          </div>
          <div className="p-stat">
            <div className="k">seen</div>
            <div className="v">{seenCount}<span className="pct">/{all.length}</span></div>
          </div>
        </div>
        <div className="practice-actions">
          <label className="p-filter">
            from
            <select value={filter} onChange={(e) => { setFilter(e.target.value as Filter); setCurrentId(null); }}>
              <option value="all">any type ({filterCounts.all})</option>
              <option value="unseen">unseen only ({filterCounts.unseen})</option>
              <option value="radio">multiple choice ({filterCounts.radio})</option>
              <option value="checkbox">select all ({filterCounts.checkbox})</option>
              <option value="fillBlank">fill blanks ({filterCounts.fillBlank})</option>
              <option value="text">written ({filterCounts.text})</option>
            </select>
          </label>
          <button type="button" className="btn danger" onClick={resetSession} title="Reset stats + seen history">reset session</button>
        </div>
      </div>

      {/* The question card */}
      <article className="practice-card fragment prose">
        <header className="practice-head">
          <h3 className="g-h3" style={{ margin: 0, border: 0, padding: 0 }}>{current.headingText}</h3>
          {current.source && (
            <Link href={current.source.href} className="p-source">
              {current.source.title}
            </Link>
          )}
        </header>

        <div className="practice-prompt" dangerouslySetInnerHTML={{ __html: promptHtml }} />

        <QuestionWidget
          question={current}
          answer={answer ?? emptyAnswer(current.type, current.blanks ?? 0)}
          onChange={setAnswer}
          submitted={submitted}
        />

        <div className="practice-footer">
          {!submitted ? (
            <>
              <button
                type="button"
                className="btn primary"
                onClick={checkAnswer}
                disabled={!answer || !isAnswered(answer)}
              >
                Check answer <kbd className="kbd">↵</kbd>
              </button>
              <button type="button" className="btn" onClick={skip}>
                Skip
              </button>
            </>
          ) : (
            <>
              <VerdictPill question={current} answer={answer!} />
              <button type="button" className="btn primary" onClick={() => nextQuestion(true)}>
                Next question <kbd className="kbd">n</kbd>
              </button>
            </>
          )}
          <span className="q-spacer" />
          <span className="q-idx">{current.type}</span>
        </div>

        {submitted && detailsBodyHtml && (
          <details className="ans" open>
            <summary>▸ Explanation</summary>
            <div className="ans-body" dangerouslySetInnerHTML={{ __html: detailsBodyHtml }} />
          </details>
        )}
      </article>
    </>
  );
}

function poolFor(all: ParsedQuestion[], filter: Filter, seen: string[]): ParsedQuestion[] {
  const seenSet = new Set(seen);
  return all.filter((q) => {
    if (filter === "unseen") return !seenSet.has(q.id);
    if (filter !== "all" && q.type !== filter) return false;
    return true;
  });
}
