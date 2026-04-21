import type { Topic } from "@/lib/registry";
import { readFragment } from "@/lib/content";

interface Props {
  topic: Topic;
  rootId?: string;
}

export async function FragmentView({ topic, rootId }: Props) {
  const html = await readFragment(topic);
  return (
    <article
      id={rootId}
      className="fragment prose"
      data-topic-kind={topic.kind}
      data-topic-slug={topic.slug}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
