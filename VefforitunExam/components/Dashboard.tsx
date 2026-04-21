"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  KIND_LABELS,
  TOPICS,
  topicHref,
  topicsByKind,
  findTopic,
  type Topic,
  type TopicKind,
} from "@/lib/registry";
import {
  onProgressChange,
  readProgress,
  recent,
  topicKey as pKey,
  type ProgressMap,
} from "@/lib/progress";

export function Dashboard() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    setProgress(readProgress());
    return onProgressChange(() => setProgress(readProgress()));
  }, []);

  const recents = recent(5)
    .map((r) => {
      const [kind, slug] = r.key.split(":") as [TopicKind, string];
      const t = findTopic(kind, slug);
      return t ? { t, p: r.data } : null;
    })
    .filter((x): x is { t: Topic; p: ProgressMap[string] } => x != null);

  const hero = recents[0];
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  // Aggregate per-kind stats
  const stats = (kind: TopicKind) => {
    const items = topicsByKind(kind);
    let visited = 0, answered = 0, total = 0, complete = 0;
    for (const t of items) {
      const p = progress[pKey(t)];
      if (!p) continue;
      visited++;
      if (p.answered != null) answered += p.answered;
      if (p.total != null) total += p.total;
      if (
        (kind === "exam" || kind === "bonus") &&
        p.answered != null && p.total != null && p.answered >= p.total
      ) complete++;
    }
    return { visited, answered, total, complete, count: items.length };
  };

  const examStats = stats("exam");
  const bonusStats = stats("bonus");
  const studyStats = stats("study");

  return (
    <div className="home">
      {/* Resume hero */}
      <div className="home-hero">
        <div>
          <div className="label">{hero ? "Pick up where you left off" : "Start studying"}</div>
          {hero ? (
            <>
              <h1>{hero.t.title}</h1>
              <div className="sub">
                {KIND_LABELS[hero.t.kind]}
                {hero.p.answered != null && hero.p.total != null &&
                  ` · ${hero.p.answered}/${hero.p.total} answered`}
                {hero.p.scrollPct != null && ` · ${hero.p.scrollPct}% read`}
              </div>
            </>
          ) : (
            <>
              <h1>Ready when you are.</h1>
              <div className="sub">Press {isMac ? "⌘" : "Ctrl"}+K to jump anywhere.</div>
            </>
          )}
        </div>
        <div style={{ display: "flex", gap: "var(--s-2)" }}>
          {hero && (
            <Link href={topicHref(hero.t)} className="btn primary" style={{ fontSize: 13, padding: "8px 14px" }}>
              Resume →
            </Link>
          )}
          <Link href="/practice" className="btn primary" style={{ fontSize: 13, padding: "8px 14px" }}>
            🎲 Random drill
          </Link>
          <Link href="/exam/1" className="btn" style={{ fontSize: 13, padding: "8px 14px" }}>
            Exam 1
          </Link>
          <Link href="/study/css" className="btn" style={{ fontSize: 13, padding: "8px 14px" }}>
            Study CSS
          </Link>
        </div>
      </div>

      {/* Per-kind stat cards */}
      <div className="session-stats">
        <div className="stat-card">
          <div className="k">Exams complete</div>
          <div className="v">{examStats.complete}<span style={{ color: "var(--fg-subtle)", fontWeight: 400 }}>/{examStats.count}</span></div>
          <div className="sub">{examStats.answered} questions answered</div>
        </div>
        <div className="stat-card">
          <div className="k">Bonus complete</div>
          <div className="v">{bonusStats.complete}<span style={{ color: "var(--fg-subtle)", fontWeight: 400 }}>/{bonusStats.count}</span></div>
          <div className="sub">{bonusStats.answered} questions answered</div>
        </div>
        <div className="stat-card">
          <div className="k">Study guides visited</div>
          <div className="v">{studyStats.visited}<span style={{ color: "var(--fg-subtle)", fontWeight: 400 }}>/{studyStats.count}</span></div>
          <div className="sub">{TOPICS.filter(t => t.kind === "study").length} total guides</div>
        </div>
        <div className="stat-card">
          <div className="k">Total material</div>
          <div className="v">474</div>
          <div className="sub">questions across all exams</div>
        </div>
      </div>

      {recents.length > 1 && (
        <TopicSection
          title="Recent"
          meta="most recently opened"
          items={recents.slice(1).map((r) => r.t)}
          progress={progress}
        />
      )}

      <TopicSection
        title="Practice exams"
        meta={`${examStats.complete}/${examStats.count} complete`}
        items={topicsByKind("exam")}
        progress={progress}
      />
      <TopicSection
        title="Bonus question banks"
        meta={`${bonusStats.complete}/${bonusStats.count} complete`}
        items={topicsByKind("bonus")}
        progress={progress}
      />
      <TopicSection
        title="Study guides"
        meta={`${studyStats.visited}/${studyStats.count} visited`}
        items={topicsByKind("study")}
        progress={progress}
      />
      <TopicSection
        title="Glossary"
        items={topicsByKind("glossary")}
        progress={progress}
      />
    </div>
  );
}

interface SectionProps {
  title: string;
  meta?: string;
  items: Topic[];
  progress: ProgressMap;
}

function TopicSection({ title, meta, items, progress }: SectionProps) {
  if (!items.length) return null;
  return (
    <section className="topic-section">
      <header className="topic-section-head">
        <h2>{title}</h2>
        {meta && <span className="meta">{meta}</span>}
      </header>
      <div className="topic-list">
        {items.map((t) => {
          const p = progress[pKey(t)];
          const pct = percentFor(t.kind, p);
          const done = pct === 100;
          return (
            <Link key={topicHref(t)} href={topicHref(t)} className={`topic-row${done ? " done" : ""}`}>
              <span className="badge">{t.kind === "bonus" ? "bonus" : t.kind.slice(0, 4)}</span>
              <div className="body">
                <div className="title">{t.title}</div>
                <div className="sub">
                  {t.subtitle ?? KIND_LABELS[t.kind]}
                  {p && pct != null && (
                    <>
                      <span className="sep">·</span>
                      <span>{t.kind === "exam" || t.kind === "bonus" ? `${p.answered ?? 0}/${p.total ?? "?"}` : `${pct}%`}</span>
                    </>
                  )}
                </div>
              </div>
              {pct != null && (
                <div className="bar" aria-hidden="true">
                  <div className="fill" style={{ width: `${pct}%` }} />
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function percentFor(kind: TopicKind, p: ProgressMap[string] | undefined): number | null {
  if (!p) return null;
  if (kind === "exam" || kind === "bonus") {
    if (p.answered != null && p.total != null && p.total > 0) {
      return Math.round((p.answered / p.total) * 100);
    }
    return null;
  }
  return p.scrollPct ?? null;
}
