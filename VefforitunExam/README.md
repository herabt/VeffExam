# Vefforitun Exam Prep

Next.js 15 (App Router) + React 19 + TypeScript study app for Web Programming II. Built with **Bun**.

## What's inside

- **7 Glossary panels** — the original course glossaries and mock-exam answers
- **9 Study guides** — CSS, JS/TS, React, State, Next.js, Forms, Socket.io, Web APIs, TypeScript
- **15 Practice exams** — every question with an inline "Show Answer", plus a textarea for your own answer
- **4 Bonus question banks** — 194 extra questions covering gaps in the practice exams

Every practice exam and bonus bank is **interactive**: your typed answers auto-save to `localStorage`, and the "📥 Download My Answers" button exports a Markdown file containing the question, your answer, and the correct answer — ideal for review.

## Scripts

```bash
bun install
bun run dev        # http://localhost:3000
bun run build
bun run start      # production server
```

## Project layout

```
app/                               — Next.js routes
  layout.tsx, globals.css, page.tsx
  study/[slug]/page.tsx            → /study/css, /study/react, …
  glossary/[slug]/page.tsx
  exam/[slug]/page.tsx             → interactive
  bonus/[slug]/page.tsx            → interactive

components/
  Topbar.tsx, TopicNav.tsx         — sticky header with grouped dropdown
  SearchBar.tsx                    — TreeWalker <mark> highlighter (focus with "/")
  FragmentView.tsx                 — server component, renders content HTML
  ExamShell.tsx                    — client wrapper for exams (textareas, download)

lib/
  registry.ts                      — single source of truth for every topic
  content.ts                       — reads fragment HTML, injects anchor ids
  anchors.ts                       — slugifies headings, rewrites TOC <li>s
  storage.ts                       — localStorage + markdown export helpers

content/
  glossary/*.html                  — extracted from the old glossary-viewer.html
  study/*.html                     — deep study guides
  exams/exam-*.html                — 15 practice exams
  exams/bonus-*.html               — 4 bonus banks
```

## Adding a new topic

1. Drop the HTML fragment into the relevant folder under `content/`.
2. Append an entry to `TOPICS` in `lib/registry.ts` with `{ kind, slug, title, file, interactive }`.

The landing page, topbar dropdown, and dynamic route enumeration all pick it up automatically.

## Keyboard shortcuts

- `/` — focus the search box
- `Esc` — clear search and unfocus

## Printing

The print stylesheet hides the sticky toolbar and expands all answer blocks so you can print a filled-out exam as PDF.
