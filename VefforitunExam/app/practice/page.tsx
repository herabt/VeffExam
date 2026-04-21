import type { Metadata } from "next";
import { PracticeShell } from "@/components/PracticeShell";
import { readFragment } from "@/lib/content";
import { TOPICS, topicHref } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Random practice",
  description: "Drill one random exam question at a time until you've seen them all.",
};

export default async function PracticePage() {
  const pool = TOPICS.filter((t) => t.kind === "exam" || t.kind === "bonus");
  const fragments = await Promise.all(
    pool.map(async (topic) => ({ topic, html: await readFragment(topic) })),
  );

  return (
    <section className="content wide">
      <div className="content-inner" style={{ maxWidth: 820 }}>
        <div className="practice-intro">
          <h1>Random practice</h1>
          <p>
            One random question at a time, pulled from all {pool.length} exams &amp; bonus banks.
            Answer, check, click next. Press <kbd className="kbd">n</kbd> for next,&nbsp;
            <kbd className="kbd">↵</kbd> to check.
          </p>
        </div>

        <PracticeShell>
          {/* Hidden source pool — parsed client-side for question data */}
          <div className="practice-source">
            {fragments.map(({ topic, html }) => (
              <div
                key={`${topic.kind}-${topic.slug}`}
                data-exam-kind={topic.kind}
                data-exam-slug={topic.slug}
                data-exam-title={topic.title}
                data-exam-href={topicHref(topic)}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ))}
          </div>
        </PracticeShell>
      </div>
    </section>
  );
}
