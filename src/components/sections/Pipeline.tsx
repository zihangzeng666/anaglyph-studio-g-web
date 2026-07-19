import { chapters } from "../../../content/chapters";
import { sectionFigure } from "../../../content/site";
import { ChapterRail } from "@/components/ChapterRail";
import { assetPath } from "@/lib/assetPath";

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
        <header className="mb-8">
          <p className="mb-4 flex items-baseline gap-4 font-mono text-xs tracking-[0.22em] uppercase">
            <span className="shrink-0 text-accent">
              Fig. {sectionFigure("pipeline")}
            </span>
            <span className="shrink-0 text-muted">Pipeline</span>
            <span
              aria-hidden
              className="h-px flex-1 translate-y-[-0.2em] bg-[var(--border)]"
            />
          </p>
          <h2
            id="pipeline-heading"
            className="max-w-3xl font-display text-3xl font-bold tracking-tight text-ink md:text-4xl"
          >
            Explore the pipeline
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Six chapters, from naming a case to watching the outline lock on.
            Use the rail to jump ahead, or let the scroll carry you through.
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
                className="chapter-card plate scroll-mt-40 mb-6 grid gap-6 overflow-hidden rounded-sm border border-[var(--border)] bg-panel/50 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-[2px] md:mb-8 md:grid-cols-12 md:items-stretch md:gap-8 md:p-8"
                aria-labelledby={`${chapter.id}-title`}
              >
                <div
                  data-chapter-copy
                  className="flex flex-col justify-center md:col-span-4 lg:col-span-3"
                >
                  <p className="sr-only">
                    Chapter {chapter.index} of{" "}
                    {String(chapters.length).padStart(2, "0")}
                  </p>
                  <div aria-hidden className="flex items-start gap-3">
                    <span className="ghost-num -ml-1 font-display text-[4.5rem] leading-[0.85] font-black [font-stretch:125%] md:text-[6.5rem]">
                      {chapter.index}
                    </span>
                    <span className="mt-2 font-mono text-[11px] tracking-[0.2em] text-accent">
                      / {String(chapters.length).padStart(2, "0")}
                    </span>
                  </div>
                  <h3
                    id={`${chapter.id}-title`}
                    className="mt-3 font-display text-2xl font-bold text-ink md:text-3xl"
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
                    {/*
                      Use plain <img> + assetPath: next/image on static export
                      does not always prefix basePath, so GH Pages served
                      /media/... (404) instead of /anaglyph-studio-g-web/media/...
                    */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={assetPath(chapter.media.src)}
                      alt={chapter.media.alt}
                      className="absolute inset-0 h-full w-full object-cover object-top"
                      width={1920}
                      height={1080}
                      loading={
                        chapter.id === "setup" || chapter.id === "solve-cmm"
                          ? "eager"
                          : "lazy"
                      }
                      decoding="async"
                    />
                  </div>
                  <figcaption
                    data-chapter-caption
                    className="mt-3 font-mono text-[11px] text-muted"
                  >
                    {chapter.media.caption ?? chapter.media.alt}
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
