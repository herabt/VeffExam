// Client-side localStorage helpers for interactive exam answers.
// Ports the qaSave / qaRestore / qaClear helpers from the original
// glossary-viewer.html inline script.

export function storageKey(topicKey: string): string {
  return `qaAnswers_${topicKey}`;
}

export function loadAnswers(topicKey: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(storageKey(topicKey)) ?? "{}");
  } catch {
    return {};
  }
}

export function saveAnswer(topicKey: string, questionId: string, value: string): void {
  if (typeof window === "undefined") return;
  const current = loadAnswers(topicKey);
  current[questionId] = value;
  window.localStorage.setItem(storageKey(topicKey), JSON.stringify(current));
}

export function clearAnswers(topicKey: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(storageKey(topicKey));
}

/**
 * Collect all text content within an element (equivalent to the original
 * qaTextOf helper). Strips markup and collapses whitespace.
 */
export function textOf(el: Element | null): string {
  if (!el) return "";
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

/**
 * Walk the rendered content tree and build a markdown document capturing:
 *   question text, user's answer, correct answer (from <details class="ans">).
 * Returns the filename and blob URL.
 */
export function buildMarkdownDownload(
  root: HTMLElement,
  title: string,
  getUserAnswer: (questionId: string) => string,
  topicKey: string,
): { filename: string; blob: Blob } {
  const lines: string[] = [
    `# ${title}`,
    "",
    `**Date:** ${new Date().toLocaleString()}`,
    "",
    "",
  ];

  const questions = root.querySelectorAll("h3.g-h3");
  questions.forEach((h, idx) => {
    const i = idx + 1;
    lines.push(`## ${textOf(h)}`);

    // Walk forward collecting prompt + options until next h3 or qa-answer-box
    const prompt: string[] = [];
    let n = h.nextElementSibling;
    while (n && n.tagName !== "H3" && !n.classList.contains("qa-answer-box")) {
      if (!n.classList.contains("ans")) {
        const tx = textOf(n);
        if (tx) prompt.push(tx);
      }
      n = n.nextElementSibling;
    }
    if (prompt.length) {
      lines.push("", "**Question:**");
      prompt.forEach((p) => lines.push(p));
    }

    lines.push("", "**My Answer:**");
    const userAnswer = getUserAnswer(`${topicKey}-q${i}`);
    lines.push(userAnswer.trim() ? userAnswer : "_(blank)_");

    // Find nearest <details class="ans"> after the h3
    let det: HTMLDetailsElement | null = null;
    let m = h.nextElementSibling;
    while (m && m.tagName !== "H3") {
      if (m.tagName === "DETAILS" && m.classList.contains("ans")) {
        det = m as HTMLDetailsElement;
        break;
      }
      m = m.nextElementSibling;
    }
    if (det) {
      const body = det.querySelector(".ans-body") ?? det;
      const ans = textOf(body)
        .replace(/^▸\s*Show Answer\s*/i, "")
        .replace(/^Show Answer\s*/i, "");
      lines.push("", "**Correct Answer:**", ans);
    }

    lines.push("", "---", "");
  });

  const blob = new Blob([lines.join("\n")], {
    type: "text/markdown;charset=utf-8",
  });
  const safe = title.replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const filename = `${safe}-${new Date().toISOString().slice(0, 10)}.md`;
  return { filename, blob };
}

export function triggerDownload(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 500);
}
