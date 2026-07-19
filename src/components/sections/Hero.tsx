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
 * Hero — the drafting-room thesis. The tagline is set as a two-line plate:
 * "LOCK THE / OUTLINE." where OUTLINE is a hollow stroked word inside
 * registration brackets that snap in and read LOCKED — the product's core
 * gesture, played in type. site.tagline stays the canonical copy for metadata.
 */

const TICKER_CHUNK =
  "Setup → Camera → Calibrate → Capture → Scene → Track · Load · track / Build · PnP / Build · CMM · ";

const BRACKETS = [
  "-left-[0.14em] -top-[0.1em] border-l-2 border-t-2",
  "-right-[0.14em] -top-[0.1em] border-r-2 border-t-2",
  "-left-[0.14em] -bottom-[0.02em] border-l-2 border-b-2",
  "-right-[0.14em] -bottom-[0.02em] border-r-2 border-b-2",
] as const;

export function Hero() {
  const runtime = downloadsById.get("runtime");
  const downloadHref = publicDownloadHref("runtime");
  const downloadPublic = isRuntimeDownloadPublic();

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-[var(--border)]"
    >
      {/* Live-track photo as a quiet premium ground — outline barely
          suggested behind type, not a full-bleed product shot. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetPath("/media/hero/track-hero.jpg")}
          alt=""
          width={781}
          height={799}
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-[72%_48%] opacity-[0.28] saturate-[0.55] contrast-[0.92] brightness-[0.72]"
        />
        {/* Heavy scrim — photo is atmosphere, never competes with type */}
        <div className="absolute inset-0 bg-bg/72" />
        {/* Left plate for headline; mould ghost only on the far right */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--bg)_0%,color-mix(in_srgb,var(--bg)_94%,transparent)_38%,color-mix(in_srgb,var(--bg)_70%,transparent)_68%,color-mix(in_srgb,var(--bg)_88%,transparent)_100%)]" />
        {/* Soft vignette top/bottom */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--bg)_0%,transparent_18%,transparent_70%,var(--bg)_100%)]" />
        {/* Barely-there brass wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_78%_58%,color-mix(in_srgb,var(--accent)_6%,transparent),transparent_72%)]" />
      </div>

      <HeroMotion>
        <div className="relative mx-auto flex min-h-[82vh] max-w-6xl flex-col justify-center px-6 py-20 md:py-28">
          <p
            data-hero-item
            className="mb-8 font-mono text-xs tracking-[0.28em] text-accent uppercase"
          >
            {site.productName} · Windows
          </p>

          <h1
            data-hero-item
            id="hero-heading"
            aria-label={site.tagline}
            className="font-display uppercase leading-[0.94] tracking-tight text-ink [font-stretch:125%]"
          >
            <span aria-hidden className="block text-[clamp(2.9rem,8.6vw,7.25rem)] font-extrabold">
              Lock the
            </span>
            <span
              aria-hidden
              className="relative mt-[0.06em] inline-block text-[clamp(2.9rem,8.6vw,7.25rem)] font-extrabold"
            >
              <span className="text-outline">Outline.</span>
              {BRACKETS.map((pos) => (
                <span
                  key={pos}
                  aria-hidden
                  data-hero-bracket
                  className={`absolute h-[0.26em] w-[0.26em] border-accent ${pos}`}
                />
              ))}
              <span
                data-hero-locked
                className="absolute left-full top-[0.3em] ml-8 hidden items-center gap-2 font-mono text-xs font-medium tracking-[0.24em] text-accent uppercase sm:inline-flex"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 rounded-full bg-[var(--ok)]"
                />
                Locked
              </span>
            </span>
          </h1>

          <p
            data-hero-item
            className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl"
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
              Three paths in
            </a>
            <a
              href="#hold"
              className="inline-flex items-center justify-center px-2 py-3 font-mono text-xs tracking-wide text-muted underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              See live track
            </a>
          </div>
        </div>

        {/* Instrument strip: ruler + slow step ticker */}
        <div data-hero-item className="relative">
          <div aria-hidden className="ruler-x" />
          <div
            aria-hidden
            className="marquee border-t border-[var(--border)] bg-panel/40"
          >
            <div className="marquee-track py-2.5 font-mono text-[11px] tracking-[0.18em] text-muted uppercase">
              <span>{TICKER_CHUNK.repeat(3)}</span>
              <span>{TICKER_CHUNK.repeat(3)}</span>
            </div>
          </div>
        </div>
      </HeroMotion>
    </section>
  );
}
