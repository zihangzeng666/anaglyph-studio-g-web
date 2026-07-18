import Image from "next/image";
import { chapters } from "../../../content/chapters";
import { ChapterRail } from "@/components/ChapterRail";

/**
 * Pipeline: large card shots + sticky long-dwell stack.
 * Each chapter sits in a tall dwell wrapper so the next card can
 * rise under the current one (continuous peek) while still pausing long.
 */
export function Pipeline() {
  return (
    <section
      id="pipeline"
      aria-labelledby="pipeline-heading"
      className="scroll-mt-20 border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24">
        <header className="mb-8 max-w-3xl">
          <p className="mb-3 font-mono text-xs tracking-[0.22em] text-accent uppercase">
            Pipeline
          </p>
          <h2
            id="pipeline-heading"
            className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl"
          >
            Explore the pipeline
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Six chapters from case setup to live outline lock. Jump any step via
            the rail, or scroll the stack.
          </p>
        </header>
      </div>

      <div className="relative" data-pipeline-sticky-scope>
        <div className="sticky top-14 z-40 border-b border-[var(--border)] bg-bg/95 backdrop-blur-md md:top-16">
          <div className="mx-auto max-w-[90rem] px-4 py-3 md:px-8">
            <ChapterRail chapters={chapters} />
          </div>
        </div>

        <div
          className="mx-auto max-w-[90rem] px-4 pb-24 pt-4 md:px-8 md:pb-32"
          data-pipeline-chapters
        >
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              data-chapter-dwell
              className="relative"
              /* min-height set by motion on desktop for long dwell */
            >
              <article
                id={chapter.id}
                data-chapter-id={chapter.id}
                data-media-mode={chapter.motion.mediaMode}
                className="chapter-card scroll-mt-40 mb-6 grid gap-6 rounded-sm border border-[var(--border)] bg-panel/50 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[2px] md:mb-8 md:grid-cols-12 md:items-stretch md:gap-8 md:p-8"
                aria-labelledby={`${chapter.id}-title`}
              >
                <div
                  data-chapter-copy
                  className="flex flex-col justify-center md:col-span-4 lg:col-span-3"
                >
                  <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                    {chapter.index} /{" "}
                    {String(chapters.length).padStart(2, "0")}
                  </p>
                  <h3
                    id={`${chapter.id}-title`}
                    className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl"
                  >
                    {chapter.title}
                  </h3>
                  <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted md:text-base">
                    {chapter.body}
                  </p>
                  <ul
                    className="mt-5 flex flex-wrap gap-2"
                    aria-label="Spec chips"
                  >
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

                <figure className="flex min-h-0 flex-col md:col-span-8 lg:col-span-9">
                  <div
                    data-chapter-media
                    className="relative w-full overflow-hidden rounded-sm border border-[var(--border)] bg-frame/50"
                    style={{
                      aspectRatio: "16 / 9",
                      minHeight: "min(56vh, 36rem)",
                    }}
                  >
                    <Image
                      src={chapter.media.src}
                      alt={chapter.media.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 75vw"
                      className="object-cover object-top"
                      priority={
                        chapter.id === "setup" || chapter.id === "solve-cmm"
                      }
                    />
                  </div>
                  <figcaption
                    data-chapter-caption
                    className="mt-3 font-mono text-[11px] text-muted"
                  >
                    {chapter.media.alt}
                  </figcaption>
                </figure>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
