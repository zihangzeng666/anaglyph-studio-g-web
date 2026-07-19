import Link from "next/link";
import { site } from "../../../content/site";
import {
  isRuntimeDownloadPublic,
  publicDownloadHref,
  downloadsById,
} from "../../../content/downloads";
import { HeroMotion } from "@/components/HeroMotion";
import { assetPath } from "@/lib/assetPath";

/**
 * Hero — clean product open: black field, small ambient still, plain headline.
 */

export function Hero() {
  const runtime = downloadsById.get("runtime");
  const downloadHref = publicDownloadHref("runtime");
  const downloadPublic = isRuntimeDownloadPublic();

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-[var(--border)] bg-bg"
    >
      {/* Mostly black — small, quiet still on the right as atmosphere only */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-bg" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetPath("/media/hero/track-hero.jpg")}
          alt=""
          width={781}
          height={799}
          decoding="async"
          className="absolute right-[-4%] top-[12%] hidden h-[72%] w-auto max-w-[min(42vw,28rem)] object-cover object-center opacity-[0.14] saturate-50 blur-[0.3px] sm:block md:right-[4%] md:opacity-[0.16]"
        />
        {/* Keep type side pure black */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--bg)_0%,var(--bg)_48%,color-mix(in_srgb,var(--bg)_88%,transparent)_72%,color-mix(in_srgb,var(--bg)_70%,transparent)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--bg)_0%,transparent_20%,transparent_75%,var(--bg)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_50%_at_82%_55%,color-mix(in_srgb,var(--accent)_4%,transparent),transparent_70%)]" />
      </div>

      <HeroMotion>
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-center px-6 py-20 md:py-28">
          <p
            data-hero-item
            className="mb-6 font-mono text-xs tracking-[0.22em] text-accent uppercase"
          >
            {site.productName} · Windows
          </p>

          <h1
            data-hero-item
            id="hero-heading"
            className="max-w-3xl font-display text-[clamp(2.25rem,5.2vw,3.75rem)] font-semibold leading-[1.12] tracking-tight text-ink"
          >
            {site.tagline}
          </h1>

          <p
            data-hero-item
            className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            {site.lead}
          </p>

          <div data-hero-item className="mt-10 flex flex-wrap items-center gap-4">
            {downloadPublic && downloadHref ? (
              <Link
                href={downloadHref}
                className="inline-flex items-center justify-center rounded-sm bg-accent px-5 py-3 font-sans text-sm font-semibold text-[var(--ink-on-accent)] transition-colors hover:bg-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi"
              >
                {runtime?.label ?? "Download Studio_G"}
              </Link>
            ) : (
              <Link
                href="/demo"
                className="inline-flex items-center justify-center rounded-sm bg-accent px-5 py-3 font-sans text-sm font-semibold text-[var(--ink-on-accent)] transition-colors hover:bg-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi"
              >
                Request a demo
              </Link>
            )}
            <a
              href="#paths"
              className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-panel/60 px-5 py-3 font-sans text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              How it works
            </a>
            <a
              href="#hold"
              className="inline-flex items-center justify-center px-2 py-3 font-mono text-xs tracking-wide text-muted underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Live track demo
            </a>
          </div>
        </div>
      </HeroMotion>
    </section>
  );
}
