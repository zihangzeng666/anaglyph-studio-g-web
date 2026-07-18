/**
 * Hold section media pointers.
 * Playback is loop-only (no hold-to-explore scrub).
 */

export const HOLD_MEDIA = {
  poster: "/media/hold/track-poster.png",
  webm: "/media/hold/track-scrub.webm",
  mp4: "/media/hold/track-scrub.mp4",
} as const;
