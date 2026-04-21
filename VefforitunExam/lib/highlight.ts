// Lightweight JS/TS/JSX/HTML/CSS syntax highlighter.
// Hand-rolled so we don't ship Prism/Shiki to the client.
// Emits spans with className "tk-k" (keyword) "tk-s" (string) "tk-c" (comment)
// "tk-n" (number) "tk-t" (type / capitalized identifier) "tk-r" (regex)
// "tk-p" (punctuation/operator, styled loosely).

const KEYWORDS = new Set([
  "abstract", "any", "as", "async", "await", "boolean", "break", "case",
  "catch", "class", "const", "constructor", "continue", "declare", "default",
  "delete", "do", "else", "enum", "export", "extends", "false", "finally",
  "for", "from", "function", "get", "if", "implements", "import", "in",
  "instanceof", "interface", "is", "keyof", "let", "module", "namespace",
  "never", "new", "null", "number", "object", "of", "private", "protected",
  "public", "readonly", "return", "satisfies", "set", "static", "string",
  "super", "switch", "symbol", "this", "throw", "true", "try", "type",
  "typeof", "undefined", "unknown", "var", "void", "while", "yield",
]);

const GLOBALS = new Set([
  "console", "window", "document", "process", "globalThis", "Math", "JSON",
  "Promise", "Array", "Object", "String", "Number", "Boolean", "Set", "Map",
  "Date", "RegExp", "Error", "React", "useState", "useEffect", "useRef",
  "useMemo", "useCallback", "useContext", "useReducer", "fetch", "setTimeout",
  "clearTimeout", "setInterval", "clearInterval", "localStorage", "sessionStorage",
  "addEventListener", "removeEventListener", "dispatchEvent", "setTheme",
]);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function highlight(src: string): string {
  let i = 0;
  const n = src.length;
  const out: string[] = [];

  const push = (cls: string, val: string) => {
    out.push(`<span class="tk-${cls}">${escapeHtml(val)}</span>`);
  };

  while (i < n) {
    const ch = src[i]!;
    const nxt = src[i + 1];

    // line comment
    if (ch === "/" && nxt === "/") {
      const end = src.indexOf("\n", i);
      const e = end === -1 ? n : end;
      push("c", src.slice(i, e));
      i = e;
      continue;
    }
    // block comment
    if (ch === "/" && nxt === "*") {
      const end = src.indexOf("*/", i + 2);
      const e = end === -1 ? n : end + 2;
      push("c", src.slice(i, e));
      i = e;
      continue;
    }
    // HTML comment
    if (ch === "<" && src.startsWith("<!--", i)) {
      const end = src.indexOf("-->", i + 4);
      const e = end === -1 ? n : end + 3;
      push("c", src.slice(i, e));
      i = e;
      continue;
    }
    // strings: ' " `
    if (ch === '"' || ch === "'" || ch === "`") {
      const quote = ch;
      let j = i + 1;
      while (j < n) {
        const q = src[j]!;
        if (q === "\\") { j += 2; continue; }
        if (q === quote) { j++; break; }
        // template literal interpolation
        if (quote === "`" && q === "$" && src[j + 1] === "{") {
          let depth = 1;
          j += 2;
          while (j < n && depth > 0) {
            if (src[j] === "{") depth++;
            else if (src[j] === "}") depth--;
            j++;
          }
          continue;
        }
        j++;
      }
      push("s", src.slice(i, j));
      i = j;
      continue;
    }
    // numbers
    if (/[0-9]/.test(ch) || (ch === "." && /[0-9]/.test(nxt ?? ""))) {
      let j = i;
      while (j < n && /[0-9a-fA-FxXoObBnE_.]/.test(src[j]!)) j++;
      push("n", src.slice(i, j));
      i = j;
      continue;
    }
    // identifiers
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < n && /[A-Za-z0-9_$]/.test(src[j]!)) j++;
      const word = src.slice(i, j);
      if (KEYWORDS.has(word)) push("k", word);
      else if (GLOBALS.has(word)) push("g", word);
      else if (/^[A-Z]/.test(word)) push("t", word);
      else out.push(escapeHtml(word));
      i = j;
      continue;
    }
    // punctuation that we want highlighted lightly
    if (/[{}()[\];,.]/.test(ch)) {
      push("p", ch);
      i++;
      continue;
    }
    if (/[=+\-*/%<>!&|^~?:]/.test(ch)) {
      push("o", ch);
      i++;
      continue;
    }
    out.push(escapeHtml(ch));
    i++;
  }
  return out.join("");
}

/** Detect the language flavour from a <pre>'s text; used only to skip huge non-code blocks. */
export function looksLikeCode(text: string): boolean {
  // anything with more than ~3 lines of text OR containing semicolons/arrows/braces
  if (text.length < 3) return false;
  return /[{};=><]|=>/.test(text);
}
