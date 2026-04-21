export type TopicKind = "glossary" | "study" | "exam" | "bonus";

export interface Topic {
  kind: TopicKind;
  slug: string;
  title: string;
  /** path relative to `content/` */
  file: string;
  interactive: boolean;
  /** short subtitle for the landing page */
  subtitle?: string;
}

export const TOPICS: Topic[] = [
  // ── Original glossary panels (ported from glossary-viewer.html panels g0-g6)
  { kind: "glossary", slug: "mock-exam", title: "Mock Exam Q+A", file: "glossary/00-mock-exam.html", interactive: false, subtitle: "Teacher's official answers" },
  { kind: "glossary", slug: "visual-guide", title: "Visual Guide + Teacher Code", file: "glossary/01-visual-guide.html", interactive: false },
  { kind: "glossary", slug: "css-topics", title: "CSS Topics Glossary", file: "glossary/02-css-topics.html", interactive: false },
  { kind: "glossary", slug: "javascript-react", title: "JavaScript & React Glossary", file: "glossary/03-javascript-react.html", interactive: false },
  { kind: "glossary", slug: "nextjs-redux", title: "Next.js, Redux & Patterns Glossary", file: "glossary/04-nextjs-redux.html", interactive: false },
  { kind: "glossary", slug: "quick-reference", title: "Quick Reference", file: "glossary/05-quick-reference.html", interactive: false },
  { kind: "glossary", slug: "weak-areas", title: "Your Weak Areas", file: "glossary/06-weak-areas.html", interactive: false },

  // ── Deep study guides
  { kind: "study", slug: "css", title: "CSS & Layout", file: "study/01-css-layout.html", interactive: false, subtitle: "Flexbox, Grid, BEM, selectors, animations" },
  { kind: "study", slug: "javascript", title: "JavaScript & TypeScript", file: "study/02-javascript-typescript.html", interactive: false, subtitle: "this, promises, event loop, TS" },
  { kind: "study", slug: "react", title: "React", file: "study/03-react.html", interactive: false, subtitle: "Hooks, patterns, lifecycle" },
  { kind: "study", slug: "state", title: "State Management", file: "study/04-state-management.html", interactive: false, subtitle: "Context, Redux, RTK, Zustand" },
  { kind: "study", slug: "nextjs", title: "Next.js App Router", file: "study/05-nextjs.html", interactive: false, subtitle: "RSC, server actions, caching" },
  { kind: "study", slug: "forms", title: "Forms (react-hook-form)", file: "study/06-forms.html", interactive: false, subtitle: "Validation, zod, Controller" },
  { kind: "study", slug: "socketio", title: "Socket.io", file: "study/07-socketio.html", interactive: false, subtitle: "WebSockets, rooms, broadcasting" },
  { kind: "study", slug: "webapis", title: "Web APIs & Other", file: "study/08-web-apis-other.html", interactive: false, subtitle: "HTTP, CORS, auth, a11y, security" },
  { kind: "study", slug: "typescript", title: "TypeScript Quick Reference", file: "study/typescript-glossary.html", interactive: false, subtitle: "Types, generics, utilities, guards" },

  // ── 15 practice exams (interactive)
  { kind: "exam", slug: "1", title: "Practice Exam 1", file: "exams/exam-01.html", interactive: true },
  { kind: "exam", slug: "2", title: "Practice Exam 2", file: "exams/exam-02.html", interactive: true },
  { kind: "exam", slug: "3", title: "Practice Exam 3", file: "exams/exam-03.html", interactive: true },
  { kind: "exam", slug: "4", title: "Practice Exam 4", file: "exams/exam-04.html", interactive: true },
  { kind: "exam", slug: "5", title: "Practice Exam 5", file: "exams/exam-05.html", interactive: true },
  { kind: "exam", slug: "6", title: "Practice Exam 6", file: "exams/exam-06.html", interactive: true },
  { kind: "exam", slug: "7", title: "Practice Exam 7", file: "exams/exam-07.html", interactive: true },
  { kind: "exam", slug: "8", title: "Practice Exam 8", file: "exams/exam-08.html", interactive: true },
  { kind: "exam", slug: "9", title: "Practice Exam 9", file: "exams/exam-09.html", interactive: true },
  { kind: "exam", slug: "10", title: "Practice Exam 10", file: "exams/exam-10.html", interactive: true },
  { kind: "exam", slug: "11", title: "Practice Exam 11", file: "exams/exam-11.html", interactive: true },
  { kind: "exam", slug: "12", title: "Practice Exam 12", file: "exams/exam-12.html", interactive: true },
  { kind: "exam", slug: "13", title: "Practice Exam 13", file: "exams/exam-13.html", interactive: true },
  { kind: "exam", slug: "14", title: "Practice Exam 14", file: "exams/exam-14.html", interactive: true },
  { kind: "exam", slug: "15", title: "Practice Exam 15", file: "exams/exam-15.html", interactive: true },

  // ── Bonus question banks (interactive)
  { kind: "bonus", slug: "css", title: "Bonus: CSS & Layout", file: "exams/bonus-01-css.html", interactive: true, subtitle: "48 extra questions" },
  { kind: "bonus", slug: "js-react", title: "Bonus: JavaScript & React", file: "exams/bonus-02-js-react.html", interactive: true, subtitle: "52 extra questions" },
  { kind: "bonus", slug: "nextjs-state-forms", title: "Bonus: Next.js/State/Forms", file: "exams/bonus-03-nextjs-state-forms.html", interactive: true, subtitle: "50 extra questions" },
  { kind: "bonus", slug: "socket-webapi", title: "Bonus: Socket.io & Web APIs", file: "exams/bonus-04-socket-webapi.html", interactive: true, subtitle: "44 extra questions" },
];

export function findTopic(kind: TopicKind, slug: string): Topic | undefined {
  return TOPICS.find((t) => t.kind === kind && t.slug === slug);
}

export function topicsByKind(kind: TopicKind): Topic[] {
  return TOPICS.filter((t) => t.kind === kind);
}

export function topicHref(t: Topic): string {
  return `/${t.kind}/${t.slug}`;
}

export const KIND_LABELS: Record<TopicKind, string> = {
  glossary: "Glossary",
  study: "Study Guides",
  exam: "Practice Exams",
  bonus: "Bonus Questions",
};
