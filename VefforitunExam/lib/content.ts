import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Topic } from "./registry";
import { injectAnchors } from "./anchors";

const CONTENT_ROOT = path.join(process.cwd(), "content");

/**
 * Read a topic's HTML fragment from disk and inject anchor IDs so TOCs work.
 * Cached per-request via React `cache`.
 */
export const readFragment = cache(async (topic: Topic): Promise<string> => {
  const abs = path.join(CONTENT_ROOT, topic.file);
  const raw = await readFile(abs, "utf8");
  return injectAnchors(raw, `${topic.kind}-${topic.slug}`);
});
