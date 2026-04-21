# HTML fragment format for practice exams

Convert `practice-exam-N.md` into a self-contained HTML fragment that will be inserted into `glossary-viewer.html` as a new panel.

## Output file
`/Users/tomas/Desktop/School/VeffExam/study-guide/fragments/exams/exam-NN.html` (use NN = zero-padded exam number, e.g. `exam-01.html`, `exam-02.html`, `exam-15.html`).

## Rules
1. Output ONLY inner HTML — no `<html>`, `<head>`, `<body>`, `<style>` wrappers. The fragment will be inserted as `<div class="panel" id="...">...YOUR FRAGMENT...</div>`.
2. Preserve ALL questions and ALL answers from the source markdown. No summarization.
3. Heading convention:
   - Exam title → `<h2 class="g-h2">Practice Exam N — Topic</h2>`
   - Section headers (SECTION A, SECTION B, etc.) → `<h2 class="g-h2">SECTION A: ...</h2>`
   - Each question → `<h3 class="g-h3">Question N — Type</h3>`
4. For each question:
   - Render the question prompt as `<p>...</p>`
   - Render choices as `<ul><li>...</li></ul>` (multiple choice / select all) — keep letter labels (A, B, C, D) or checkbox markers
   - Render code blocks as `<div class="cb"><pre>...</pre></div>` with `&lt;`, `&gt;`, `&amp;` entities
   - Wrap the answer in a collapsible block:
     ```
     <details class="ans"><summary>▸ Show Answer</summary>
     <div class="ans-body">... answer content ...</div>
     </details>
     ```
   - Answer content: include ALL explanation text, code, tables from the answer key. Use `<strong>` for bold, `<code>` for inline code.
5. Tables → `<div class="tw"><table><thead>...<tbody>...</table></div>`.
6. Inline code → `<code>...</code>`.
7. Use `<hr>` between major sections where the markdown uses `---`.
8. Keep the fragment linear top-to-bottom: all questions first, optionally followed by the answer key section, OR inline per-question answers (inline is preferred — easier to study).

## Example skeleton
```html
<h2 class="g-h2">Practice Exam 1 — CSS, JavaScript & Async Patterns</h2>

<h2 class="g-h2">SECTION A: CSS Flexbox & Grid</h2>

<h3 class="g-h3">Question 1 — Fill in the blanks</h3>
<p>The <code>flex-direction</code> property defaults to 1. ________, ...</p>
<details class="ans"><summary>▸ Show Answer</summary>
<div class="ans-body">
  <p><strong>1.</strong> <code>row</code></p>
  <p><strong>2.</strong> <code>stretch</code></p>
  <p><strong>Explanation:</strong> ...</p>
</div>
</details>
```

## Notes
- If the source markdown puts all answers at the end in an "ANSWER KEY" section, pair each question with its answer inline in the HTML output (easier for students).
- Preserve code fidelity — indentation, operators, everything.
