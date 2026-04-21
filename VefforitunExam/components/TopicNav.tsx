"use client";

import { useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";
import { TOPICS, KIND_LABELS, topicHref, type TopicKind } from "@/lib/registry";

const KIND_ORDER: TopicKind[] = ["glossary", "study", "exam", "bonus"];

export function TopicNav() {
  const router = useRouter();
  const pathname = usePathname();

  const currentHref = useMemo(() => {
    const t = TOPICS.find((topic) => topicHref(topic) === pathname);
    return t ? topicHref(t) : "";
  }, [pathname]);

  return (
    <select
      value={currentHref}
      onChange={(e) => {
        if (e.target.value) router.push(e.target.value);
      }}
    >
      <option value="">— jump to topic —</option>
      {KIND_ORDER.map((kind) => (
        <optgroup key={kind} label={KIND_LABELS[kind]}>
          {TOPICS.filter((t) => t.kind === kind).map((t) => (
            <option key={topicHref(t)} value={topicHref(t)}>
              {t.title}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
