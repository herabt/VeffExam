import { notFound } from "next/navigation";
import { FragmentView } from "@/components/FragmentView";
import { ReaderShell } from "@/components/ReaderShell";
import { findTopic, topicsByKind } from "@/lib/registry";

export function generateStaticParams() {
  return topicsByKind("glossary").map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = findTopic("glossary", slug);
  return { title: t ? `${t.title} — Glossary` : "Glossary" };
}

export default async function GlossaryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = findTopic("glossary", slug);
  if (!topic) notFound();
  return (
    <>
      <section className="content">
        <div className="content-inner">
          <FragmentView topic={topic} />
        </div>
      </section>
      <ReaderShell kind="glossary" slug={slug} />
    </>
  );
}
