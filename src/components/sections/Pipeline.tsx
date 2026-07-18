import { chapters } from "../../../content/chapters";
import { SectionShell } from "./SectionShell";

/**
 * Pipeline — Setup → Tags → Camera K → Solve/CMM → Scene → Track.
 * Static chapter cards with anchor ids; GSAP pins land in a later PR.
 */
export function Pipeline() {
  return (
    <SectionShell
      id="pipeline"
      eyebrow="Pipeline"
      title="Explore the pipeline"
    >
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted">
        Six chapters from case setup to live outline lock. Jump any step — full
        scroll motion ships later; the story is readable as static HTML.
      </p>

      {/* Chapter jump rail — always in DOM for no-JS / reduced-motion */}
      <nav
        aria-label="Pipeline chapters"
        className="mb-12 flex flex-wrap gap-2 border-b border-[var(--border)] pb-6"
      >
        {chapters.map((chapter) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            className="rounded-sm border border-[var(--border)] bg-panel/40 px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span className="text-accent/80">{chapter.index}</span>{" "}
            {chapter.title}
          </a>
        ))}
      </nav>

      <div className="space-y-8">
        {chapters.map((chapter) => (
          <article
            key={chapter.id}
            id={chapter.id}
            className="scroll-mt-24 grid gap-6 rounded-sm border border-[var(--border)] bg-panel/40 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:p-8"
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
