import { notFound } from "next/navigation";
import { FragmentView } from "@/components/FragmentView";
import { ReaderShell } from "@/components/ReaderShell";
import { findTopic, topicsByKind } from "@/lib/registry";

export function generateStaticParams() {
  return topicsByKind("study").map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = findTopic("study", slug);
  return { title: t ? `${t.title} — Study` : "Study Guide" };
}

export default async function StudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("study", slug);
  if (!topic) notFound();
  return (
    <>
      <section className="content">
        <div className="content-inner">
          <FragmentView topic={topic} />
        </div>
      </section>
      <ReaderShell kind="study" slug={slug} />
    </>
  );
}
