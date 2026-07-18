import Link from "next/link";
import { site } from "../../../content/site";
import { downloadsById } from "../../../content/downloads";

/**
 * Hero — "Lock the outline." Claim-safe lead + primary CTAs.
 * Readable without GSAP; poster-first industrial frame.
 */
export function Hero() {
  const runtime = downloadsById.get("runtime");

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-[var(--border)]"
    >
      {/* Ambient industrial frame — pure CSS, no motion lib */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_55%),radial-gradient(ellipse_at_80%_80%,color-mix(in_srgb,var(--frame)_80%,transparent),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-6 py-20 md:py-28">
        <p className="mb-6 font-mono text-xs tracking-[0.28em] text-accent uppercase">
          {site.productName} · Windows
        </p>

        <h1
          id="hero-heading"
          className="max-w-3xl font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl md:text-7xl"
        >
          {site.tagline}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          {site.lead}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href={runtime?.href || "/download"}
            className="inline-flex items-center justify-center rounded-sm bg-accent px-5 py-3 font-sans text-sm font-semibold text-[var(--ink-on-accent)] transition-colors hover:bg-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi"
          >
            {runtime?.label ?? "Download Studio_G"}
          </Link>
          <a
            href="#pipeline"
            className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-panel/60 px-5 py-3 font-sans text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Explore the pipeline
          </a>
          <Link
            href="/source"
            className="inline-flex items-center justify-center px-2 py-3 font-mono text-xs tracking-wide text-muted underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Get source
          </Link>
        </div>

        {/* Abstract outline lock motif (static SVG) */}
        <div
          className="mt-16 max-w-md opacity-90"
          aria-hidden
        >
          <svg
            viewBox="0 0 360 120"
            className="h-auto w-full text-accent"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="8"
              y="18"
              width="140"
              height="84"
              rx="4"
              stroke="currentColor"
              strokeOpacity="0.25"
              strokeWidth="1.5"
            />
            <path
              d="M28 72 L48 42 L72 58 L98 30 L128 66"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <circle cx="48" cy="42" r="3" fill="currentColor" />
            <circle cx="72" cy="58" r="3" fill="currentColor" />
            <circle cx="98" cy="30" r="3" fill="currentColor" />
            <path
              d="M180 40 H340 M180 60 H300 M180 80 H320"
              stroke="currentColor"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
            <text
              x="180"
              y="28"
              fill="currentColor"
              fillOpacity="0.55"
              fontFamily="ui-monospace, monospace"
              fontSize="10"
              letterSpacing="0.12em"
            >
              OUTLINE · LOCK
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
