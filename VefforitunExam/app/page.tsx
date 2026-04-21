import Link from "next/link";
import { KIND_LABELS, TOPICS, topicHref, type TopicKind } from "@/lib/registry";

const KIND_ORDER: TopicKind[] = ["study", "exam", "bonus", "glossary"];
const KIND_BLURB: Record<TopicKind, string> = {
  study: "Deep study guides with definitions, examples, gotchas, and exam traps.",
  exam: "15 practice exams with your answers saved locally and downloadable as Markdown.",
  bonus: "Extra question banks covering gaps in the practice exams.",
  glossary: "Original course glossaries & mock-exam answers.",
};

export default function Home() {
  return (
    <>
      <div className="home-header">
        <h1>Vefforitun Exam Prep</h1>
        <p>
          {TOPICS.length} topics · 474 practice questions · local answer save &amp; download
        </p>
      </div>

      {KIND_ORDER.map((kind) => {
        const items = TOPICS.filter((t) => t.kind === kind);
        if (!items.length) return null;
        return (
          <section key={kind} className="home-section">
            <h2>{KIND_LABELS[kind]}</h2>
            <p style={{ fontSize: 13, color: "#777", marginBottom: 12, fontFamily: "Segoe UI, sans-serif" }}>
              {KIND_BLURB[kind]}
            </p>
            <div className="home-grid">
              {items.map((t) => (
                <Link
                  key={topicHref(t)}
                  href={topicHref(t)}
                  className={`home-card${t.interactive ? " interactive" : ""}`}
                >
                  <div className="title">{t.title}</div>
                  {t.subtitle ? <div className="subtitle">{t.subtitle}</div> : null}
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
