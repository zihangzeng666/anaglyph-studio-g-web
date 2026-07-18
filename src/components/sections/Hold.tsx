import { getClaim } from "../../../content/claims";
import { HoldExplore } from "@/components/HoldExplore";
import { SectionShell } from "./SectionShell";

/**
 * Hold — looping tracking demo video (play/pause only, no scrub).
 */
export function Hold() {
  const lock = getClaim("live-outline-lock");
  const errPx = getClaim("err-px");

  return (
    <SectionShell
      id="hold"
      eyebrow="Live track"
      title="Tracking, frame by frame"
    >
      <div className="view-reveal grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
        <HoldExplore
          caption={
            lock?.statement ??
            "Live tracking locks a CAD outline onto the mould with tag detection."
          }
        />

        <div className="view-reveal view-reveal-delay-1">
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
            Clip loops automatically; use Play/Pause anytime.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
