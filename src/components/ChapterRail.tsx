"use client";

import { useEffect, useMemo, useState } from "react";
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
 * Pipeline status chips + progress bar.
 * Parent provides sticky positioning so this stays visible while
 * scrolling all chapters (see Pipeline data-pipeline-sticky-scope).
 */
export function ChapterRail({
  chapters,
  rootSelector = "#pipeline",
}: ChapterRailProps) {
  const [activeId, setActiveId] = useState<string | null>(
    chapters[0]?.id ?? null,
  );
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  const activeIndex = useMemo(() => {
    const i = chapters.findIndex((c) => c.id === activeId);
    return i < 0 ? 0 : i;
  }, [activeId, chapters]);

  const pct = Math.round(Math.min(1, Math.max(0, progress)) * 100);

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
      onPipelineProgress: (p) => {
        if (cancelled) return;
        setProgress(p);
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
      className="space-y-3"
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

      <div
        className="space-y-1.5"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Pipeline scroll progress"
        aria-valuetext={`${pct} percent, step ${activeIndex + 1} of ${chapters.length}`}
      >
        <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] tracking-wide text-muted uppercase">
          <span>
            Pipeline · {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(chapters.length).padStart(2, "0")}
            {activeId ? (
              <span className="text-accent">
                {" "}
                · {chapters.find((c) => c.id === activeId)?.title}
              </span>
            ) : null}
          </span>
          <span className="tabular-nums text-accent">{pct}%</span>
        </div>

        <div className="relative h-2 overflow-hidden rounded-full bg-frame ring-1 ring-[var(--border)]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
          <div
            className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-accent-hi shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_80%,transparent)] transition-[left] duration-500 ease-out"
            style={{ left: `max(0px, calc(${pct}% - 6px))` }}
            aria-hidden
          />
        </div>
      </div>
    </nav>
  );
}
