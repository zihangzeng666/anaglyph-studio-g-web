"use client";

import { useEffect, useState } from "react";
import type { Chapter } from "../../content/types";
import {
  destroyMotion,
  getPrefersReducedMotion,
  registerChapters,
} from "@/lib/motion";

type ChapterRailProps = {
  chapters: readonly Chapter[];
  rootSelector?: string;
};

/**
 * Pipeline chapter chips only (no progress bar).
 * Sticky parent keeps this visible while scrolling chapters.
 */
export function ChapterRail({
  chapters,
  rootSelector = "#pipeline",
}: ChapterRailProps) {
  const [activeId, setActiveId] = useState<string | null>(
    chapters[0]?.id ?? null,
  );
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(getPrefersReducedMotion());

    const root = document.querySelector<HTMLElement>(rootSelector);
    if (!root) return;

    let cancelled = false;

    void registerChapters({
      root,
      chapters,
      onActiveChange: (id) => {
        if (cancelled) return;
        if (id) setActiveId(id);
      },
    });

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener("change", onMq);

    return () => {
      cancelled = true;
      mq.removeEventListener("change", onMq);
      void destroyMotion();
    };
  }, [chapters, rootSelector]);

  return (
    <nav
      aria-label="Pipeline chapters"
      data-reduced-motion={reduced ? "true" : "false"}
    >
      <div className="flex flex-wrap gap-2">
        {chapters.map((chapter) => {
          const current = activeId === chapter.id;
          return (
            <a
              key={chapter.id}
              href={`#${chapter.id}`}
              aria-current={current ? "true" : undefined}
              className={[
                "rounded-sm border px-3 py-1.5 font-mono text-xs",
                "transition-[color,background-color,border-color] duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                current
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-[var(--border)] bg-panel/40 text-muted hover:border-accent/40 hover:text-accent",
              ].join(" ")}
            >
              <span className="text-accent/80">{chapter.index}</span>{" "}
              {chapter.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
