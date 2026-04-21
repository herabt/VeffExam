// Parse an exam fragment's DOM into typed question descriptors.
// Used by ExamShell to drive DigiExam-style interactive inputs.

export type QuestionType = "fillBlank" | "radio" | "checkbox" | "text";

export interface ParsedOption {
  id: string;          // e.g., "A", "B", ...
  label: string;       // plain text (for comparison / storage)
  labelHtml: string;   // original inner HTML (renders with <code> etc.)
  li: HTMLLIElement;
}

export interface ParsedQuestion {
  id: string;                    // slug of the heading (already injected by anchors)
  index: number;                 // zero-based
  heading: HTMLHeadingElement;
  headingText: string;
  type: QuestionType;
  promptEls: HTMLElement[];      // prose between h3 and ul/details
  optionsList?: HTMLUListElement;
  options?: ParsedOption[];
  detailsEl?: HTMLDetailsElement;
  /** Used by FillBlank: number of blank slots found in the prompt */
  blanks?: number;
  correct: {
    fillBlank?: string[];        // accepted values, one per blank
    radio?: string;              // option id
    checkbox?: string[];         // option ids
  };
}

const BLANK_RE = /_{3,}/g;

export function parseQuestions(root: HTMLElement): ParsedQuestion[] {
  const headings = root.querySelectorAll<HTMLHeadingElement>("h3.g-h3");
  const out: ParsedQuestion[] = [];
  headings.forEach((h3, idx) => {
    const headingText = (h3.textContent ?? "").trim();
    const type = detectType(headingText);
    const { promptEls, optionsList, detailsEl } = collectForward(h3);
    const options = optionsList && (type === "radio" || type === "checkbox")
      ? parseOptions(optionsList, type)
      : undefined;
    const blanks = type === "fillBlank" ? countBlanks(promptEls) : 0;
    const correct = parseCorrect({ detailsEl, type, options, blanks });

    out.push({
      id: h3.id || `q${idx + 1}`,
      index: idx,
      heading: h3,
      headingText,
      type,
      promptEls,
      optionsList,
      options,
      detailsEl,
      blanks,
      correct,
    });
  });
  return out;
}

function detectType(heading: string): QuestionType {
  const h = heading.toLowerCase();
  if (/fill in the blank/.test(h)) return "fillBlank";
  if (/select all/.test(h)) return "checkbox";
  if (/multiple choice/.test(h)) return "radio";
  // Written / Code Analysis / Code Output / Essay / What Does This Print → text
  return "text";
}

function collectForward(h3: HTMLHeadingElement) {
  const promptEls: HTMLElement[] = [];
  let optionsList: HTMLUListElement | undefined;
  let detailsEl: HTMLDetailsElement | undefined;
  let cursor: Element | null = h3.nextElementSibling;
  while (cursor) {
    if (cursor.tagName === "H3") break;
    if (cursor.tagName === "H2") break;
    if (cursor.tagName === "DETAILS" && cursor.classList.contains("ans")) {
      detailsEl = cursor as HTMLDetailsElement;
      break;
    }
    if (cursor.tagName === "UL" && !optionsList) {
      optionsList = cursor as HTMLUListElement;
    } else {
      promptEls.push(cursor as HTMLElement);
    }
    cursor = cursor.nextElementSibling;
  }
  return { promptEls, optionsList, detailsEl };
}

function parseOptions(ul: HTMLUListElement, type: QuestionType): ParsedOption[] {
  const lis = Array.from(ul.querySelectorAll<HTMLLIElement>(":scope > li"));
  return lis.map((li, i) => {
    const text = (li.textContent ?? "").trim();
    let id: string;
    let labelHtml = li.innerHTML;
    let label = text;

    if (type === "radio") {
      const m = /^([A-Z])[\).:]\s*/.exec(text);
      if (m) {
        id = m[1]!;
        label = text.slice(m[0].length);
        // strip the letter prefix from inner HTML too
        labelHtml = li.innerHTML.replace(/^\s*([A-Z])[\).:]\s*/, "");
      } else {
        id = String.fromCharCode(65 + i);
      }
    } else {
      // checkbox: strip "[ ]" or "[x]" prefix from display
      id = String.fromCharCode(65 + i);
      const stripped = text.replace(/^\[[\sxX]?\]\s*/, "");
      label = stripped;
      labelHtml = li.innerHTML.replace(/^\s*\[[\sxX]?\]\s*/, "");
    }

    return { id, label, labelHtml, li };
  });
}

function countBlanks(promptEls: HTMLElement[]): number {
  let n = 0;
  for (const el of promptEls) {
    const text = el.textContent ?? "";
    const matches = text.match(BLANK_RE);
    if (matches) n += matches.length;
  }
  return n;
}

function parseCorrect(args: {
  detailsEl?: HTMLDetailsElement;
  type: QuestionType;
  options?: ParsedOption[];
  blanks: number;
}): ParsedQuestion["correct"] {
  const { detailsEl, type, options } = args;
  if (!detailsEl) return {};
  const body = (detailsEl.querySelector(".ans-body") as HTMLElement | null) ?? detailsEl;

  if (type === "fillBlank") {
    // `<p><strong>1.</strong> <code>row</code></p>` pattern
    const values: string[] = [];
    body.querySelectorAll("p").forEach((p) => {
      const strong = p.querySelector(":scope > strong");
      if (!strong) return;
      const label = (strong.textContent ?? "").trim();
      if (!/^\d+\.?$/.test(label)) return;
      const code = p.querySelector("code");
      const raw = code
        ? (code.textContent ?? "").trim()
        : (p.textContent ?? "").replace(strong.textContent ?? "", "").trim();
      // Some answers write "1. row (note: …)" — keep only the first word or code content
      const cleaned = code ? raw : raw.split(/\s*[(—–-]\s*/)[0]!.trim();
      if (cleaned) values.push(cleaned);
    });
    return { fillBlank: values };
  }

  if (type === "radio") {
    // First <strong> whose text is a single letter A-Z
    const strongs = Array.from(body.querySelectorAll("strong"));
    for (const s of strongs) {
      const txt = (s.textContent ?? "").trim();
      const m = /^([A-Z])(?:\b|$)/.exec(txt);
      if (m) return { radio: m[1]! };
    }
    // Fallback: search prose for "Answer: B" / "Correct: B"
    const text = body.textContent ?? "";
    const m = /\b(?:answer|correct)\s*[:=]\s*([A-Z])\b/i.exec(text);
    if (m) return { radio: m[1]! };
    return {};
  }

  if (type === "checkbox" && options) {
    // Parse inner <ul> for [x] / [ ] markers. The inner ul items may be
    // in the same order as the outer ones (common) — match by index first,
    // fall back to fuzzy label matching.
    const innerLis = Array.from(body.querySelectorAll<HTMLLIElement>("li"));
    const correct: string[] = [];
    if (innerLis.length === options.length) {
      innerLis.forEach((li, i) => {
        if (/^\s*\[x\]/i.test(li.textContent ?? "")) {
          correct.push(options[i]!.id);
        }
      });
    } else {
      // Fuzzy match: for each [x] inner li, find the option whose label
      // shares the longest prefix.
      innerLis.forEach((li) => {
        const text = (li.textContent ?? "").trim();
        if (!/^\[x\]/i.test(text)) return;
        const needle = text
          .replace(/^\[x\]\s*/i, "")
          .split(/\s*[—–-]\s*/)[0]!
          .toLowerCase()
          .trim();
        if (!needle) return;
        let best: ParsedOption | undefined;
        let bestScore = 0;
        for (const opt of options) {
          const hay = opt.label.toLowerCase();
          let score = 0;
          while (score < needle.length && score < hay.length && needle[score] === hay[score]) score++;
          if (score > bestScore) { bestScore = score; best = opt; }
        }
        if (best && bestScore > 8 && !correct.includes(best.id)) correct.push(best.id);
      });
    }
    return { checkbox: correct };
  }

  return {};
}

// ─────────────────────────────────────────────────────────────────────
// Answer types — stored in localStorage, serialised per exam panel.
// ─────────────────────────────────────────────────────────────────────

export type Answer =
  | { type: "fillBlank"; values: string[] }
  | { type: "radio"; option: string | null }
  | { type: "checkbox"; options: string[] }
  | { type: "text"; text: string };

export type AnswerMap = Record<string, Answer>;

export function emptyAnswer(type: QuestionType, blanks: number): Answer {
  switch (type) {
    case "fillBlank": return { type: "fillBlank", values: Array.from({ length: blanks }, () => "") };
    case "radio":     return { type: "radio", option: null };
    case "checkbox":  return { type: "checkbox", options: [] };
    case "text":      return { type: "text", text: "" };
  }
}

export function isAnswered(a: Answer | undefined): boolean {
  if (!a) return false;
  switch (a.type) {
    case "fillBlank": return a.values.some((v) => v.trim().length > 0);
    case "radio":     return a.option !== null;
    case "checkbox":  return a.options.length > 0;
    case "text":      return a.text.trim().length > 0;
  }
}

/** Does the answer fully satisfy the correct answer? */
export function isCorrect(q: ParsedQuestion, a: Answer | undefined): boolean | null {
  if (!a) return false;
  switch (a.type) {
    case "fillBlank": {
      if (!q.correct.fillBlank || !q.correct.fillBlank.length) return null;
      if (a.values.length !== q.correct.fillBlank.length) return false;
      return a.values.every((v, i) => normalise(v) === normalise(q.correct.fillBlank![i]!));
    }
    case "radio":
      if (!q.correct.radio) return null;
      return a.option === q.correct.radio;
    case "checkbox": {
      if (!q.correct.checkbox) return null;
      const exp = new Set(q.correct.checkbox);
      const got = new Set(a.options);
      if (exp.size !== got.size) return false;
      for (const v of exp) if (!got.has(v)) return false;
      return true;
    }
    case "text":
      return null; // Not auto-gradable
  }
}

function normalise(s: string): string {
  return s.trim().toLowerCase().replace(/[`"'()]/g, "").replace(/\s+/g, " ");
}
