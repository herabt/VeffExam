import { notFound } from "next/navigation";
import { ExamShell } from "@/components/ExamShell";
import { FragmentView } from "@/components/FragmentView";
import { findTopic, topicsByKind } from "@/lib/registry";

export function generateStaticParams() {
  return topicsByKind("bonus").map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = findTopic("bonus", slug);
  return { title: t ? `${t.title}` : "Bonus Questions" };
}

export default async function BonusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("bonus", slug);
  if (!topic) notFound();
  return (
    <ExamShell topicKey={`bonus-${slug}`} title={topic.title}>
      <FragmentView topic={topic} />
    </ExamShell>
  );
}
