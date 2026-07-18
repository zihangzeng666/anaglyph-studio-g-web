import { getClaim } from "../../../content/claims";
import { SectionShell } from "./SectionShell";

/**
 * Hold — static placeholder for hold-to-explore scrub (PR6).
 * Claim-safe caption; play-only affordance text for reduced-motion path.
 */
export function Hold() {
  const lock = getClaim("live-outline-lock");
  const errPx = getClaim("err-px");

  return (
    <SectionShell
      id="hold"
      eyebrow="Hold to explore"
      title="Tracking, frame by frame"
    >
      <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
        <figure className="relative aspect-video overflow-hidden rounded-sm border border-[var(--border)] bg-panel">
          <div
            className="absolute inset-0 bg-[linear-gradient(135deg,var(--frame)_0%,var(--bg)_50%,var(--panel)_100%)]"
            aria-hidden
          />
          <div
            className="absolute inset-6 rounded-sm border border-dashed border-accent/30"
            aria-hidden
          />
          <figcaption className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <span className="font-mono text-xs tracking-[0.24em] text-accent uppercase">
              Media pending
            </span>
            <span className="mt-3 max-w-sm text-sm text-muted">
              Hold-scrub tracking loop ships with the media PR. Until then, this
              slot stays a static frame with product-true caption.
            </span>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-bg/80 px-4 py-2 font-mono text-xs text-ink">
              <span
                className="inline-block h-2 w-2 rounded-full bg-accent"
                aria-hidden
              />
              HOLD · play-only fallback later
            </span>
          </figcaption>
        </figure>

        <div>
          <p className="text-base leading-relaxed text-muted">
            {lock?.statement ??
              "Live tracking locks a CAD outline onto the mould with tag detection."}
          </p>
          <ul className="mt-6 space-y-3 font-mono text-xs text-ink/90">
            <li className="flex gap-2 border-l-2 border-accent/50 pl-3">
              Live tag detection · outline overlay
            </li>
            <li className="flex gap-2 border-l-2 border-accent/50 pl-3">
              {errPx?.statement ?? "Error as reprojection in pixels."}
            </li>
            <li className="flex gap-2 border-l-2 border-[var(--border)] pl-3 text-muted">
              Approx mm is optional depth conversion — not CMM uncertainty.
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted">
            Caption describes a recorded demo, not a live accuracy certificate.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
