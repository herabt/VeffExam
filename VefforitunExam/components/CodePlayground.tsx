"use client";

import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { runSnippet, type RunResult } from "@/lib/playground";

interface Props {
  initialSource: string;
}

/** Custom theme built from our OKLCH tokens so light/dark both work. */
function buildTheme(mode: "light" | "dark") {
  // We map CodeMirror tokens to colour-mix of our brand tokens. Using the
  // same code-bg/code-fg as the rest of the site for visual coherence.
  const bg = mode === "dark" ? "oklch(0.12 0.008 240)" : "oklch(0.22 0.01 240)";
  const fg = mode === "dark" ? "oklch(0.92 0.005 240)" : "oklch(0.95 0.003 240)";
  const selectionBg = "oklch(0.45 0.10 200 / 0.35)";
  const lineHighlight = "oklch(0.50 0.05 240 / 0.15)";
  const caret = fg;

  const styles = [
    { tag: [t.keyword, t.modifier], color: "oklch(0.75 0.16 310)", fontWeight: "600" },
    { tag: [t.controlKeyword, t.operatorKeyword], color: "oklch(0.78 0.15 320)" },
    { tag: [t.string, t.special(t.string)], color: "oklch(0.76 0.14 145)" },
    { tag: [t.number, t.bool, t.null, t.atom], color: "oklch(0.78 0.14 30)" },
    { tag: t.comment, color: "oklch(0.62 0.02 240)", fontStyle: "italic" },
    { tag: [t.typeName, t.className], color: "oklch(0.82 0.14 80)" },
    { tag: [t.variableName, t.propertyName], color: fg },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "oklch(0.80 0.13 200)" },
    { tag: [t.definition(t.variableName), t.definition(t.propertyName)], color: "oklch(0.90 0.05 200)" },
    { tag: [t.operator, t.punctuation, t.bracket], color: "oklch(0.72 0.02 240)" },
    { tag: [t.regexp], color: "oklch(0.75 0.16 30)" },
    { tag: [t.meta, t.processingInstruction], color: "oklch(0.60 0.02 240)" },
  ];

  return createTheme({
    theme: mode,
    settings: {
      background: bg,
      foreground: fg,
      caret,
      selection: selectionBg,
      selectionMatch: selectionBg,
      lineHighlight,
      gutterBackground: bg,
      gutterForeground: "oklch(0.50 0.01 240)",
      gutterBorder: "transparent",
      fontFamily: "var(--f-mono)",
    },
    styles,
  });
}

export function CodePlayground({ initialSource }: Props) {
  const [source, setSource] = useState(initialSource);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"light" | "dark">("dark");

  // Watch theme changes from the global toggle.
  useEffect(() => {
    const read = () => {
      const attr = document.documentElement.getAttribute("data-theme");
      setMode(attr === "dark" ? "dark" : "light");
    };
    read();
    const h = () => read();
    window.addEventListener("vf:theme", h);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", h);
    return () => {
      window.removeEventListener("vf:theme", h);
      mq.removeEventListener("change", h);
    };
  }, []);

  const extensions = useMemo(
    () => [javascript({ jsx: false, typescript: true })],
    [],
  );

  // We use a dark-ish code surface in both modes for legibility, but CM needs
  // the "mode" for caret/selection tone defaults.
  const theme = useMemo(() => buildTheme(mode), [mode]);

  const onRun = async () => {
    setRunning(true);
    const r = await runSnippet(source);
    setResult(r);
    setRunning(false);
  };

  const onReset = () => {
    setSource(initialSource);
    setResult(null);
  };

  const onCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(source);
      } else {
        const ta = document.createElement("textarea");
        ta.value = source;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 900);
    } catch {
      setCopied(false);
    }
  };

  const dirty = source !== initialSource;

  return (
    <div className="cp">
      <div className="cp-editor">
        <CodeMirror
          value={source}
          height="auto"
          minHeight="64px"
          maxHeight="560px"
          theme={theme}
          extensions={extensions}
          onChange={(v) => setSource(v)}
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            highlightActiveLine: false,
            highlightActiveLineGutter: false,
            highlightSelectionMatches: false,
            dropCursor: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: false,
            searchKeymap: false,
            tabSize: 2,
          }}
        />
        <div className="cp-toolbar">
          <button
            type="button"
            className="cp-btn cp-run"
            onClick={onRun}
            disabled={running}
            aria-label="Run this snippet"
            title="Run (executes the current editor contents)"
          >
            {running ? "running…" : "run ▶"}
          </button>
          <button
            type="button"
            className="cp-btn cp-reset"
            onClick={onReset}
            disabled={!dirty}
            aria-label="Reset to original"
            title="Restore the original source"
          >
            reset ↺
          </button>
          <button
            type="button"
            className="cp-btn cp-copy"
            onClick={onCopy}
            aria-label="Copy code"
            title="Copy code to clipboard"
          >
            {copied ? "copied" : "copy"}
          </button>
        </div>
      </div>

      {result && (
        <div className={`code-output${result.error ? " code-output-err" : ""}`}>
          <div className="code-output-title">
            <span>output</span>
            <span className="meta">{result.durationMs.toFixed(0)}ms</span>
          </div>
          {result.logs.length === 0 && !result.error && (
            <div className="empty">(no console output)</div>
          )}
          {result.logs.map((l, i) => (
            <div key={i} className={`line lvl-${l.level}`}>{l.text}</div>
          ))}
          {result.error && <div className="line lvl-error">⚠ {result.error}</div>}
        </div>
      )}
    </div>
  );
}
