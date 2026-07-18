import { getClaim } from "../../../content/claims";
import { SectionShell } from "./SectionShell";

/** Lead sources first; Spinnaker is optional SDK build only. */
const SOURCES = [
  {
    name: "IC4",
    tier: "lead",
    detail:
      "Industrial cameras via IC4 — included in the share runtime for shop-floor capture.",
  },
  {
    name: "Webcam",
    tier: "lead",
    detail:
      "Everyday USB cameras for bench setup, demos, and quick Load · track sessions.",
  },
  {
    name: "Video file",
    tier: "lead",
    detail:
      "Loop a recording when the mould is offline or you are reviewing a prior run.",
  },
  {
    name: "Spinnaker",
    tier: "optional",
    detail:
      "Optional SDK build (CMake WITH_SPINNAKER) — not shipped in the default bin/ package.",
  },
] as const;

/**
 * Cameras — IC4 / webcam / video lead; Spinnaker optional.
 * Claim-backed; no “works on every GigE camera” language.
 */
export function Cameras() {
  const claim = getClaim("cameras-webcam-video-ic4");
  const leads = SOURCES.filter((s) => s.tier === "lead");
  const optional = SOURCES.filter((s) => s.tier === "optional");

  return (
    <SectionShell
      id="cameras"
      eyebrow="Cameras"
      title="From webcam to industrial"
    >
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted">
        {claim?.statement ??
          "Camera options: webcam, video file, and IC4; Spinnaker is an optional SDK build."}{" "}
        Intrinsics come from Load K, Measure K, or scene-embedded K — not from
        FOV alone.
      </p>

      <h3 className="mb-3 font-mono text-xs tracking-[0.18em] text-accent uppercase">
        Supported in share runtime
      </h3>
      <ul className="mb-8 grid gap-3 sm:grid-cols-3">
        {leads.map((src) => (
          <li
            key={src.name}
            className="rounded-sm border border-accent/25 bg-panel/40 px-5 py-4"
          >
            <h4 className="font-mono text-sm tracking-wide text-accent">
              {src.name}
            </h4>
            <p className="mt-2 text-sm text-muted">{src.detail}</p>
          </li>
        ))}
      </ul>

      <h3 className="mb-3 font-mono text-xs tracking-[0.18em] text-muted uppercase">
        Optional SDK build
      </h3>
      <ul className="grid gap-3 sm:grid-cols-2">
        {optional.map((src) => (
          <li
            key={src.name}
            className="rounded-sm border border-[var(--border)] bg-frame/30 px-5 py-4"
          >
            <h4 className="font-mono text-sm tracking-wide text-muted">
              {src.name}
            </h4>
            <p className="mt-2 text-sm text-muted">{src.detail}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 font-mono text-[11px] leading-relaxed text-muted">
        Intrinsics: Load K · Measure K · scene-embedded K. FOV guess is a
        non-calibrated placeholder only — not a real calibration. Do not assume
        certified support on all GigE cameras.
      </p>
    </SectionShell>
  );
}
