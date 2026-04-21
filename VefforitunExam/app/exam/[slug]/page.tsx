import { notFound } from "next/navigation";
import { ExamShell } from "@/components/ExamShell";
import { FragmentView } from "@/components/FragmentView";
import { findTopic, topicsByKind } from "@/lib/registry";

export function generateStaticParams() {
  return topicsByKind("exam").map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = findTopic("exam", slug);
  return { title: t ? `${t.title}` : "Practice Exam" };
}

export default async function ExamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("exam", slug);
  if (!topic) notFound();
  return (
    <section className="content">
      <div className="content-inner">
        <ExamShell
          topicKey={`exam-${slug}`}
          topicKind="exam"
          topicSlug={slug}
          title={topic.title}
        >
          <FragmentView topic={topic} />
        </ExamShell>
      </div>
    </section>
  );
}
