# Style reference for HTML fragments

The website `glossary-viewer.html` uses these CSS classes. Convert markdown to HTML using these EXACTLY so the fragment matches the existing panels.

## CSS classes available
- `.g-h2` — top section heading (maps to markdown `##`)
- `.g-h3` — subsection heading (maps to markdown `###`)
- `.g-h4` — sub-subsection heading (maps to markdown `####`)
- `.cb` + nested `<pre>` — code block wrapper. Use: `<div class="cb"><pre>...</pre></div>`
- `.tw` — table wrapper for horizontal scroll: `<div class="tw"><table>...</table></div>`
- `code` (inline) — use `<code>...</code>` for inline code
- `strong` — used for emphasis (renders red)
- `mark` — highlight (yellow)
- `ul` / `li` — standard lists

## Rules
1. DO NOT include `<html>`, `<head>`, `<body>`, `<style>` or any wrapper. Output ONLY the inner HTML body fragment.
2. The fragment will be inserted as `<div class="panel" id="gN">...YOUR FRAGMENT...</div>`
3. Wrap paragraphs in `<p>...</p>`. Wrap all tables in `<div class="tw">...</div>`. Wrap all `<pre>` in `<div class="cb">...</div>`.
4. Use `&lt;` `&gt;` `&amp;` entities inside code blocks for `<`, `>`, `&`.
5. Preserve ALL content from the source markdown file. Do not summarize. Do not omit sections.
6. Use `<br>` inside `<pre>` for line breaks only if needed — otherwise preserve newlines inside `<pre>`.
7. Tables: use `<thead><tr><th>...</th></tr></thead><tbody><tr><td>...</td></tr></tbody>` or just `<tr><th>` / `<tr><td>`.
8. Keep the fragment self-contained — no links to other fragments.
