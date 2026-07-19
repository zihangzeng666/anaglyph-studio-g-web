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
            Point the camera at the mould and the overlay settles where the CAD
            says it should. What you see here is what the operator sees on{" "}
            <span className="font-mono text-ink">Track</span> — tags in, outline
            on.
          </p>
          <ul className="mt-6 space-y-3 font-mono text-xs text-ink/90">
            <li className="flex gap-2 border-l-2 border-accent/50 pl-3">
              Live tag detection · outline overlay
            </li>
            <li className="flex gap-2 border-l-2 border-accent/50 pl-3">
              {errPx?.statement ?? "Error as reprojection in pixels."}
            </li>
            <li className="flex gap-2 border-l-2 border-[var(--border)] pl-3 text-muted">
              Approx mm is a depth conversion, clearly marked — not CMM
              uncertainty.
            </li>
          </ul>
          <p className="mt-6 text-sm text-muted">
            A recorded demo, not an accuracy certificate. The clip loops on its
            own — pause it whenever you like.
          </p>
        </div>
      </div>
    </SectionShell>
  );
}
