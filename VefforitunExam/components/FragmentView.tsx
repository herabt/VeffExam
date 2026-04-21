import type { Topic } from "@/lib/registry";
import { readFragment } from "@/lib/content";

interface Props {
  topic: Topic;
  /** id to apply to the rendered wrapper — useful for scoping search & exam shell */
  rootId?: string;
}

export async function FragmentView({ topic, rootId }: Props) {
  const html = await readFragment(topic);
  return (
    <article
      id={rootId}
      className="fragment"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
