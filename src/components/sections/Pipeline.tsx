import { chapters } from "../../../content/chapters";
import { ChapterRail } from "@/components/ChapterRail";
import { SectionShell } from "./SectionShell";

/**
 * Pipeline — Setup → Tags → Camera K → Solve/CMM → Scene → Track.
 * Scroll pins owned by lib/motion.ts (via ChapterRail island); reduced-motion
 * shows the full static stack. Hold scrub is never driven from scroll.
 */
export function Pipeline() {
  return (
    <SectionShell
      id="pipeline"
      eyebrow="Pipeline"
      title="Explore the pipeline"
    >
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted">
        Six chapters from case setup to live outline lock. Jump any step via the
        rail. Desktop may pin chapters for scroll storytelling; reduced-motion
        users get the full static stack with instant anchors.
      </p>

      {/* Client island: GSAP loads dynamically inside lib/motion.ts */}
      <ChapterRail chapters={chapters} />

      <div className="space-y-8" data-pipeline-chapters>
        {chapters.map((chapter) => (
          <article
            key={chapter.id}
            id={chapter.id}
            data-chapter-id={chapter.id}
            data-media-mode={chapter.motion.mediaMode}
            className="scroll-mt-28 grid gap-6 rounded-sm border border-[var(--border)] bg-panel/40 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:p-8"
            aria-labelledby={`${chapter.id}-title`}
          >
            <div>
              <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                {chapter.index} / {String(chapters.length).padStart(2, "0")}
              </p>
              <h3
                id={`${chapter.id}-title`}
                className="mt-2 font-display text-2xl font-semibold text-ink"
              >
                {chapter.title}
              </h3>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted md:text-base">
                {chapter.body}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Spec chips">
                {chapter.chips.map((chip) => (
                  <li
                    key={`${chapter.id}-${chip.label}`}
                    className="rounded-sm border border-[var(--border)] bg-frame/80 px-2.5 py-1 font-mono text-[11px] tracking-wide text-ink/90"
                  >
                    {chip.label}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="flex min-h-[12rem] flex-col justify-between rounded-sm border border-[var(--border)] bg-bg/70 p-4">
              <div
                className="flex flex-1 items-center justify-center border border-dashed border-[var(--border)] bg-frame/30"
                role="img"
                aria-label={chapter.media.alt}
              >
                <span className="px-4 text-center font-mono text-[11px] tracking-wide text-muted">
                  Media placeholder
                  <br />
                  <span className="text-ink/50">{chapter.media.src}</span>
                </span>
              </div>
              <figcaption className="mt-3 font-mono text-[11px] text-muted">
                {chapter.media.alt}
              </figcaption>
            </figure>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
