# Plan — Convert VeffExam study site into a Next.js 15 app (Bun) at `../VefforitunExam`

## Context
Today the study material lives in a single 1.7 MB `glossary-viewer.html` with ~34 panels (study guides, glossaries, 15 practice exams, 4 bonus question banks). A bespoke Python merge pipeline stitches fragments together and injects interactive answer textareas and a markdown-download feature. It works, but:
- Everything ships in one giant HTML blob — no routing, slow to scan, hard to share a specific topic.
- Search, panel-switching, interactive exam inputs, and TOC anchors are hand-rolled vanilla JS.
- Adding/editing a topic means re-running Python scripts against the monolith.

The goal is to port this to a **Next.js 15 App Router** project using **Bun** as the toolchain, giving us:
- Per-topic URLs (`/study/react`, `/exam/3`, `/bonus/css`, …) that can be bookmarked and shared
- Type-safe content registry, proper search, TOC navigation, and componentised exam interactivity
- A clean repo that's easy to iterate on — each topic is just a file in `content/`

Content fidelity is preserved: the existing ~28 HTML fragments in `VeffExam/study-guide/fragments/` already match the site's style (`g-h2`, `g-h3`, `cb`, `tw`, `details.ans`, …) — we reuse them as-is.

---

## Target location
`/Users/tomas/Desktop/School/VefforitunExam` (sibling to `VeffExam`). New directory; does not exist yet.

## Tech stack
- **Runtime / package manager:** Bun ≥ 1.1
- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript (strict)
- **Styling:** Plain CSS Modules + one `globals.css` (port of the existing inline CSS). No Tailwind — the existing classes are intentionally minimal.
- **No backend** — all content is static; answers persist in `localStorage` on the client.
- **No ESLint/Prettier opinionation** for v1 beyond Next.js defaults.

---

## Directory layout

```
VefforitunExam/
├── package.json                # bun scripts: dev, build, start, lint
├── bun.lock
├── tsconfig.json               # strict, paths: { "@/*": ["./*"] }
├── next.config.ts              # output: 'standalone' (allow static later)
├── README.md
├── .gitignore
│
├── app/
│   ├── layout.tsx              # <html>, <body>, sticky Topbar, global <Search> provider
│   ├── globals.css             # ported from glossary-viewer.html <style>
│   ├── page.tsx                # landing: grouped cards linking to every topic
│   │
│   ├── glossary/[slug]/page.tsx    # original glossary panels 0–6 (mock Q+A, visual, css topics, js+react, nextjs+redux, quick ref, weak areas)
│   ├── study/[slug]/page.tsx       # 9 study guides (css, javascript, react, state, nextjs, forms, socketio, webapis, typescript)
│   ├── exam/[slug]/page.tsx        # exams 1–15 (interactive)
│   └── bonus/[slug]/page.tsx       # bonus banks: css, js-react, nextjs-state-forms, socket-webapi (interactive)
│
├── content/                    # static HTML fragments copied from VeffExam/study-guide/fragments/
│   ├── study/
│   │   ├── 01-css-layout.html
│   │   ├── 02-javascript-typescript.html
│   │   ├── 03-react.html
│   │   ├── 04-state-management.html
│   │   ├── 05-nextjs.html
│   │   ├── 06-forms.html
│   │   ├── 07-socketio.html
│   │   ├── 08-web-apis-other.html
│   │   └── typescript-glossary.html
│   ├── exams/
│   │   ├── exam-01.html … exam-15.html
│   │   ├── bonus-01-css.html
│   │   ├── bonus-02-js-react.html
│   │   ├── bonus-03-nextjs-state-forms.html
│   │   └── bonus-04-socket-webapi.html
│   └── glossary/
│       └── 00-mock-exam.html … 06-weak-areas.html   # extracted from glossary-viewer.html panels g0–g6
│
├── lib/
│   ├── registry.ts             # single source of truth: TOPIC_INDEX array with { kind, slug, title, file, interactive }
│   ├── content.ts              # readFragment(kind, slug) — server-only fs.readFile + anchor-id injection
│   ├── anchors.ts              # slugify() + "inject id= on every h2/h3/h4" (ports Python fix-toc.py)
│   └── storage.ts              # client: localStorage keys ("qaAnswers_{slug}") + helpers
│
└── components/
    ├── Topbar.tsx              # sticky bar: title, grouped topic select, search input (client)
    ├── TopicNav.tsx            # <select> or side drawer; grouped by kind
    ├── FragmentView.tsx        # server component: renders HTML via dangerouslySetInnerHTML
    ├── ExamShell.tsx           # client wrapper around FragmentView for /exam/** and /bonus/**
    │                              - post-mounts: finds every <details class="ans">, injects
    │                                <textarea data-qa-id="…"> before it, wires oninput→save
    │                              - renders sticky QA toolbar (Download, Clear, Show/Hide All)
    │                              - on Download: walks panel DOM, builds markdown, triggers Blob download
    ├── SearchBar.tsx           # client: wraps page content in a <div ref>, runs TreeWalker+<mark>
    └── TableOfContents.tsx     # client: builds sidebar from h2/h3 ids in current page
```

### Why `dangerouslySetInnerHTML` over MDX conversion
The 28 fragments already contain the exact HTML we want, with entities correctly escaped in code blocks. Converting them to MDX would be a lossy round-trip with no benefit. We render them verbatim on the server, post-process server-side to inject anchor IDs (reusing the logic from `VeffExam /tmp/fix-toc.py`), and layer interactivity with a sibling client component.

---

## Key mechanics (ported from current site)

| Current (vanilla) | Next.js port | File |
|---|---|---|
| `<select id="gs">` + `showG(id)` swaps `.panel.active` | Next.js route groups + `<Link>` navigation, `<TopicNav>` uses `useRouter().push()` | `components/TopicNav.tsx` |
| Inline `searchG(t)` TreeWalker + `<mark>` | Same algorithm, scoped to the `<main>` of the active route | `components/SearchBar.tsx` |
| `jumpTo(e,id)` sticky-offset scroll | Replaced by CSS `scroll-margin-top: 80px` on h2/h3/h4 + native hash links | `globals.css` |
| Python `fix-toc.py` adds `id=` to headings and rewrites `<li>` into `<a href="#id">` | Server-side HTML transform inside `readFragment()` before send | `lib/anchors.ts` |
| Python `make-exams-interactive.py` injects textareas and toolbar | Client component `<ExamShell>` runs the same transform in `useEffect` after mount | `components/ExamShell.tsx` |
| `qaSave` / `qaRestore` / `qaClear` / `qaToggleAll` / `qaDownload` | Ported verbatim into `lib/storage.ts` + `<ExamShell>` handlers (TypeScript, typed) | `lib/storage.ts`, `ExamShell.tsx` |
| Markdown download (`qaDownload`) builds `.md` from DOM | Identical DOM walk; React ref to `<article>` instead of `document.getElementById` | `ExamShell.tsx` |

### Content registry
`lib/registry.ts` is the single source of truth that the landing page, topbar, and dynamic routes all consume:

```ts
export type TopicKind = "glossary" | "study" | "exam" | "bonus";
export interface Topic { kind: TopicKind; slug: string; title: string; file: string; interactive: boolean; }
export const TOPICS: Topic[] = [
  { kind: "study", slug: "css", title: "CSS & Layout", file: "study/01-css-layout.html", interactive: false },
  { kind: "study", slug: "typescript", title: "TypeScript", file: "study/typescript-glossary.html", interactive: false },
  { kind: "exam", slug: "1", title: "Practice Exam 1", file: "exams/exam-01.html", interactive: true },
  // …
];
```

This lets `generateStaticParams()` in each dynamic route enumerate its slugs and lets the topbar render a grouped dropdown.

---

## Bootstrap sequence (exact commands)

```bash
cd /Users/tomas/Desktop/School
bun create next-app VefforitunExam --ts --app --no-tailwind --no-eslint --src-dir=false --import-alias '@/*' --use-bun
cd VefforitunExam
rm -rf app/favicon.ico app/page.module.css   # scrub boilerplate we're replacing

# copy content as-is (paths from project root)
mkdir -p content/study content/exams
cp ../VeffExam/study-guide/fragments/0*.html ../VeffExam/study-guide/fragments/typescript-glossary.html content/study/
cp ../VeffExam/study-guide/fragments/exams/exam-*.html ../VeffExam/study-guide/fragments/exams/bonus-*.html content/exams/

# then write app/, components/, lib/ per the layout above
bun install
bun run dev           # http://localhost:3000
```

We will also extract panels `g0`–`g6` from `glossary-viewer.html` into separate files under `content/glossary/` using a small one-off script.

---

## Implementation order (phased)

1. **Scaffold + globals** — Next.js app, copy `content/`, port CSS from `glossary-viewer.html` into `app/globals.css`, add `<html lang="en">` and serif body font.
2. **Content plumbing** — `lib/registry.ts`, `lib/content.ts`, `lib/anchors.ts`. Unit-test `slugify()` against the existing Python output so anchor IDs match.
3. **Read-only routes** — `/study/[slug]`, `/glossary/[slug]` rendering via `<FragmentView>` (server component, `dangerouslySetInnerHTML`). Verify anchor links + TOC clicks.
4. **Topbar + TopicNav + landing page** — grouped dropdown matching the existing 34-panel list (plus the new TypeScript panel). Add keyboard `/` shortcut to focus search.
5. **SearchBar** — TreeWalker highlighter scoped to `<main>`; Esc clears; retains existing UX.
6. **Interactive exams** — `<ExamShell>` client wrapper on `/exam/[slug]` and `/bonus/[slug]`. Port `qaSave/Restore/Clear/ToggleAll/Download` as typed functions in `lib/storage.ts`.
7. **QA polish** — scroll-margin for anchors, responsive checks on mobile, print stylesheet (so students can print answer-filled exams).
8. **Docs** — README with `bun dev/build/start`, project structure, how to add a new topic (drop a `.html` in `content/`, append to `TOPICS`).

---

## Files to create / port

| New file | Purpose | Source (if any) |
|---|---|---|
| `app/layout.tsx` | Root HTML + Topbar | new |
| `app/globals.css` | Styles | ported from `<style>` in `glossary-viewer.html` |
| `app/page.tsx` | Landing w/ topic cards | new |
| `app/{glossary,study,exam,bonus}/[slug]/page.tsx` | Dynamic topic routes + `generateStaticParams` | new |
| `components/Topbar.tsx`, `TopicNav.tsx`, `SearchBar.tsx`, `FragmentView.tsx`, `ExamShell.tsx`, `TableOfContents.tsx` | UI | new, mechanics ported from inline JS in `glossary-viewer.html` |
| `lib/registry.ts`, `content.ts`, `anchors.ts`, `storage.ts` | Data + helpers | `anchors.ts` ports `/tmp/fix-toc.py`, `storage.ts` ports `qaSave/Restore/Clear/Download` from `glossary-viewer.html`, `content.ts` ports read+inject from `/tmp/merge-viewer.py` |
| `content/**/*.html` | Content | **copied verbatim** from `VeffExam/study-guide/fragments/**` + extracted panels `g0`–`g6` from `VeffExam/glossary-viewer.html` |

No files in `VeffExam/` are modified — it remains the source-of-truth backup.

---

## Verification

After `bun run dev`:
1. Landing page at `/` lists all 34+ topics grouped by kind (Glossary, Study, Exams, Bonus).
2. `/study/css` renders the full CSS study guide identical to panel `g7` today, including code blocks, tables, pseudo-element examples.
3. `/study/typescript` shows the new TypeScript glossary (today's panel is unmerged locally).
4. TOC click on any `<li>` inside a fragment jumps smoothly to the correct heading, sticky-bar offset respected.
5. Search input highlights matches via `<mark>` within the active page only.
6. `/exam/3`:
   - Shows Q&A with a textarea under every question
   - Typing saves to `localStorage['qaAnswers_exam-3']`; refresh restores
   - **📥 Download My Answers** produces `Practice-Exam-3-YYYY-MM-DD.md` containing every question, my answer, and the correct answer
   - **Show/Hide All Answers** toggles every `<details>`
7. `bun run build` completes without errors; `bun run start` serves production build.
8. Lighthouse on a content page ≥ 95 performance (static HTML, no JS hydration needed on read-only pages).
