// Minimal code playground.
// - Detects whether a <pre> contains JS/TS-runnable source
// - Strips the most common TS type annotations so simple examples run
// - Executes via new Function() with a captured console
// - Returns collected log lines and any error for display

export function looksRunnable(text: string): boolean {
  if (!text || text.length < 3) return false;
  // Skip HTML / JSX blocks that start with `<`
  const trimmed = text.trimStart();
  if (trimmed.startsWith("<!") || /^<[A-Za-z]/.test(trimmed)) return false;
  // Skip pure CSS blocks
  if (/^[.#:\w][\w\s,.#[\]="':*>~+-]*\{[^}]*\}/m.test(trimmed) && !/(console\.|=>|function\s|const\s|let\s)/.test(trimmed)) return false;
  // Must look like JS
  return /\b(console\.|=>|\bfunction\b|\bconst\b|\blet\b|\bvar\b|\bclass\b|\basync\b|new\s+Promise)\b/.test(text);
}

/** Strip easy TypeScript annotations so JS-like examples run in new Function. */
export function stripTypes(src: string): string {
  let s = src;
  // Strip whole `interface X {...}` and `type X = ...;` declarations
  s = s.replace(/^[ \t]*(?:export\s+)?interface\s+\w+(?:<[^>]+>)?\s*(?:extends\s+[^{]+)?\{[^}]*\}\s*$/gm, "");
  s = s.replace(/^[ \t]*(?:export\s+)?type\s+\w+[^=]*=\s*[^;]+;?\s*$/gm, "");
  // `declare ...;`
  s = s.replace(/^[ \t]*declare\s+[^;\n]+;?\s*$/gm, "");
  // `as Type` / `as const`
  s = s.replace(/\s+as\s+(?:const\b|[A-Za-z_$][\w$]*(?:<[^>]+>)?(?:\[\])?)/g, "");
  // Non-null assertion `!` after identifier before .  ( or [
  s = s.replace(/([A-Za-z_$)\]])!(?=[.([])/g, "$1");
  // Param type annotations: (name: Type) → (name). Do a couple of passes.
  for (let pass = 0; pass < 3; pass++) {
    s = s.replace(/(\([^()]*?)([A-Za-z_$][\w$]*)\s*:\s*[A-Za-z_$][\w$]*(?:<[^<>]*>)?(?:\s*\|\s*[A-Za-z_$][\w$]*(?:<[^<>]*>)?)*(?:\[\])?/g, "$1$2");
  }
  // Variable type annotations: const x: Type = ... → const x = ...
  s = s.replace(/(\b(?:const|let|var)\s+[A-Za-z_$][\w$]*)\s*:\s*[^=\n;]+?(\s*=)/g, "$1$2");
  // Function return type: ): Foo {  →  ) {
  s = s.replace(/\)\s*:\s*[A-Za-z_$][\w$]*(?:<[^<>]*>)?(?:\[\])?(?:\s*\|\s*[A-Za-z_$][\w$]*)*\s*(\{|=>)/g, ")$1 ");
  // Generic parameters on function signatures: `function foo<T>(…)` → `function foo(…)`
  s = s.replace(/(\bfunction\s+[A-Za-z_$][\w$]*)<[^>]+>/g, "$1");
  // Arrow generics `<T>(…) =>` → `(…) =>`
  s = s.replace(/(^|\s|=)<[A-Z][\w,]*(?:\s+extends\s+[^>]+)?>(?=\s*\()/g, "$1");
  // `!` after a `)`
  s = s.replace(/\)!/g, ")");
  return s;
}

export interface RunResult {
  logs: Array<{ level: "log" | "warn" | "error" | "info"; text: string }>;
  error: string | null;
  durationMs: number;
}

/** Run a snippet in a fresh function scope with a captured console. */
export async function runSnippet(source: string): Promise<RunResult> {
  const logs: RunResult["logs"] = [];
  const formatter = (...args: unknown[]): string =>
    args.map((a) => {
      try {
        if (typeof a === "string") return a;
        if (a instanceof Error) return `${a.name}: ${a.message}`;
        return JSON.stringify(a, (_, v) => (typeof v === "function" ? `[Function ${v.name || ""}]` : v), 2);
      } catch {
        return String(a);
      }
    }).join(" ");

  const fakeConsole = {
    log: (...args: unknown[]) => logs.push({ level: "log", text: formatter(...args) }),
    info: (...args: unknown[]) => logs.push({ level: "info", text: formatter(...args) }),
    warn: (...args: unknown[]) => logs.push({ level: "warn", text: formatter(...args) }),
    error: (...args: unknown[]) => logs.push({ level: "error", text: formatter(...args) }),
  };

  const started = performance.now();
  try {
    const js = stripTypes(source);
    // Wrap in async fn so top-level `await` works
    const fn = new Function(
      "console",
      `return (async () => {\n${js}\n})();`,
    ) as (c: typeof fakeConsole) => Promise<unknown>;
    const maybe = fn(fakeConsole);
    // Support top-level expressions that resolve to values
    const result = await Promise.race([
      maybe,
      new Promise<string>((_, rej) => setTimeout(() => rej(new Error("timeout after 2000ms")), 2000)),
    ]);
    if (result !== undefined && logs.length === 0) {
      logs.push({ level: "log", text: `→ ${formatter(result)}` });
    }
    return { logs, error: null, durationMs: performance.now() - started };
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return { logs, error: msg, durationMs: performance.now() - started };
  }
}
