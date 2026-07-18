import { getClaim } from "../../../content/claims";
import { SectionShell } from "./SectionShell";

const SOURCES = [
  {
    name: "Webcam",
    detail: "Everyday USB cameras for bench setup and demos.",
  },
  {
    name: "Video file",
    detail: "Loop a recording when the mould is offline.",
  },
  {
    name: "IC4",
    detail: "Industrial cameras via IC4 — included in the share runtime.",
  },
  {
    name: "Spinnaker",
    detail: "Optional SDK build (CMake WITH_SPINNAKER) — not in default bin/.",
  },
];

/**
 * Cameras — webcam / video / IC4 / Spinnaker (optional).
 * PR7 polishes; claim-backed baseline.
 */
export function Cameras() {
  const claim = getClaim("cameras-webcam-video-ic4");

  return (
    <SectionShell
      id="cameras"
      eyebrow="Cameras"
      title="From webcam to industrial"
    >
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted">
        {claim?.statement ??
          "Camera options: webcam, video file, and IC4; Spinnaker is an optional SDK build."}
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {SOURCES.map((src) => (
          <li
            key={src.name}
            className="rounded-sm border border-[var(--border)] bg-panel/40 px-5 py-4"
          >
            <h3 className="font-mono text-sm tracking-wide text-accent">
              {src.name}
            </h3>
            <p className="mt-2 text-sm text-muted">{src.detail}</p>
          </li>
        ))}
      </ul>

      <p className="mt-6 font-mono text-[11px] text-muted">
        Intrinsics: Load K · Measure K · scene-embedded K. FOV guess is a
        non-calibrated placeholder only — not a real calibration.
      </p>
    </SectionShell>
  );
}
