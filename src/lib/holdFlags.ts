/**
 * Hold-to-explore feature flags.
 *
 * Media not produced yet → default HOLD_MODE = play-only.
 * Scrub requires dense-keyframe encode (see public/media/README.md).
 */

export type HoldMode = "play-only" | "scrub";

function envFlag(name: string, defaultTrue = false): boolean {
  const v = process.env[name];
  if (v === undefined || v === "") return defaultTrue;
  return v === "1" || v.toLowerCase() === "true" || v === "yes";
}

/** Master switch: when false, Hold section still shows but scrub UI is off. */
export const ENABLE_HOLD_EXPLORE: boolean = envFlag(
  "NEXT_PUBLIC_ENABLE_HOLD_EXPLORE",
  false,
);

/**
 * Runtime mode. Default play-only until scrub assets pass FPS QA.
 * Scrub only when ENABLE_HOLD_EXPLORE and HOLD_MODE=scrub.
 */
export function getHoldMode(): HoldMode {
  const raw = (process.env.NEXT_PUBLIC_HOLD_MODE || "play-only").toLowerCase();
  if (
    ENABLE_HOLD_EXPLORE &&
    (raw === "scrub" || raw === "hold-scrub")
  ) {
    return "scrub";
  }
  return "play-only";
}

/**
 * Soft launch: SVG poster ships in-repo. Scrub mp4/webm are optional —
 * omit or 404 → HoldExplore shows the poster still (no broken video UI).
 */
export const HOLD_MEDIA = {
  poster: "/media/hold/track-poster.svg",
  webm: "/media/hold/track-scrub.webm",
  mp4: "/media/hold/track-scrub.mp4",
} as const;

/** True when scrub loop files are expected (not soft-launch still-only). */
export const HOLD_HAS_SCRUB_LOOP = false;
