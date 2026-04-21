"use client";

import type { ReactNode } from "react";
import type { Answer, ParsedQuestion } from "@/lib/examParser";
import { isCorrect } from "@/lib/examParser";

export interface WidgetProps {
  question: ParsedQuestion;
  answer: Answer;
  onChange: (a: Answer) => void;
  submitted: boolean;
}

export function QuestionWidget(props: WidgetProps): ReactNode {
  const { question } = props;
  switch (question.type) {
    case "radio": return <RadioWidget {...props} />;
    case "checkbox": return <CheckboxWidget {...props} />;
    case "fillBlank": return <FillBlankWidget {...props} />;
    case "text": return <TextWidget {...props} />;
  }
}

// ─── Radio ────────────────────────────────────────────────────────────
function RadioWidget({ question, answer, onChange, submitted }: WidgetProps) {
  if (answer.type !== "radio") return null;
  const correct = question.correct.radio;
  return (
    <div className="q-choices" role="radiogroup" aria-label={question.headingText}>
      {question.options?.map((opt) => {
        const checked = answer.option === opt.id;
        const isRight = submitted && correct === opt.id;
        const isWrong = submitted && checked && correct !== opt.id;
        return (
          <label
            key={opt.id}
            className={`q-opt${checked ? " selected" : ""}${isRight ? " correct" : ""}${isWrong ? " wrong" : ""}`}
          >
            <input
              type="radio"
              name={`q-${question.id}`}
              checked={checked}
              disabled={submitted}
              onChange={() => onChange({ type: "radio", option: opt.id })}
            />
            <span className="q-opt-id">{opt.id}</span>
            <span className="q-opt-label" dangerouslySetInnerHTML={{ __html: opt.labelHtml }} />
            {isRight && <span className="q-mark ok" aria-label="correct">✓</span>}
            {isWrong && <span className="q-mark bad" aria-label="wrong">✗</span>}
          </label>
        );
      })}
    </div>
  );
}

// ─── Checkbox ─────────────────────────────────────────────────────────
function CheckboxWidget({ question, answer, onChange, submitted }: WidgetProps) {
  if (answer.type !== "checkbox") return null;
  const correctSet = new Set(question.correct.checkbox ?? []);
  const selected = new Set(answer.options);
  return (
    <div className="q-choices" role="group" aria-label={question.headingText}>
      {question.options?.map((opt) => {
        const checked = selected.has(opt.id);
        const shouldBe = correctSet.has(opt.id);
        const isRight = submitted && shouldBe;
        const isWrong = submitted && checked !== shouldBe;
        return (
          <label
            key={opt.id}
            className={`q-opt${checked ? " selected" : ""}${isRight ? " correct" : ""}${isWrong ? " wrong" : ""}`}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={submitted}
              onChange={(e) => {
                const next = new Set(selected);
                if (e.target.checked) next.add(opt.id);
                else next.delete(opt.id);
                onChange({ type: "checkbox", options: Array.from(next).sort() });
              }}
            />
            <span className="q-opt-id">{opt.id}</span>
            <span className="q-opt-label" dangerouslySetInnerHTML={{ __html: opt.labelHtml }} />
            {isRight && <span className="q-mark ok" aria-label="correct">✓</span>}
            {isWrong && <span className="q-mark bad" aria-label="wrong">✗</span>}
          </label>
        );
      })}
    </div>
  );
}

// ─── Fill in the blank ────────────────────────────────────────────────
function FillBlankWidget({ question, answer, onChange, submitted }: WidgetProps) {
  if (answer.type !== "fillBlank") return null;
  const values = answer.values;
  const expected = question.correct.fillBlank ?? [];
  return (
    <div className="q-blanks">
      <div className="q-blanks-label">Fill in the blanks:</div>
      {values.map((v, i) => {
        const exp = expected[i];
        const state = !submitted
          ? ""
          : !exp
          ? ""
          : normalise(v) === normalise(exp)
          ? " correct"
          : " wrong";
        return (
          <div key={i} className={`q-blank${state}`}>
            <span className="q-blank-n">{i + 1}.</span>
            <input
              type="text"
              value={v}
              disabled={submitted}
              spellCheck={false}
              placeholder="type here…"
              onChange={(e) => {
                const next = values.slice();
                next[i] = e.target.value;
                onChange({ type: "fillBlank", values: next });
              }}
            />
            {submitted && exp && state === " wrong" && (
              <span className="q-blank-correct">
                correct: <code>{exp}</code>
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Written / code ───────────────────────────────────────────────────
function TextWidget({ question, answer, onChange, submitted }: WidgetProps) {
  if (answer.type !== "text") return null;
  const isCode = /code|output|print/i.test(question.headingText);
  return (
    <div className={`q-text${isCode ? " is-code" : ""}`}>
      <label>Your answer</label>
      <textarea
        value={answer.text}
        disabled={submitted}
        placeholder={isCode ? "Paste or write code…" : "Type your answer here. Auto-saves."}
        spellCheck={!isCode}
        onChange={(e) => onChange({ type: "text", text: e.target.value })}
      />
      {submitted && (
        <p className="q-text-note">
          Model answer revealed below — text answers aren't auto-graded.
        </p>
      )}
    </div>
  );
}

function normalise(s: string): string {
  return s.trim().toLowerCase().replace(/[`"'()]/g, "").replace(/\s+/g, " ");
}

// ─── Verdict pill (shown next to the check button after submit) ───────
export function VerdictPill({ question, answer }: { question: ParsedQuestion; answer: Answer }) {
  const v = isCorrect(question, answer);
  if (v === null) return <span className="q-verdict q-v-reveal">model answer shown</span>;
  if (v) return <span className="q-verdict q-v-correct">✓ correct</span>;
  return <span className="q-verdict q-v-wrong">✗ not quite</span>;
}
