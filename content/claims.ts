import type { Claim } from "./types";

/**
 * Claim evidence registry for Anaglyph Studio (G) marketing.
 *
 * Rules:
 * - Every numeric or accuracy phrase maps to product UI/docs (or is qualitative).
 * - FOV guess is a non-calibrated placeholder — never market as real K.
 * - err mm is approximate (reprojection @ estimated depth), not CMM uncertainty.
 * - Workflow labels: Load · track / Build · PnP / Build · CMM.
 * - No fake sub-mm accuracy; never brand as Grok.
 *
 * Product claim approver must sign registry before public launch (see CONTRIBUTING.md).
 */

/** Phrases banned from site copy (substring match, case-insensitive in tests/reviews). */
export const FORBIDDEN_PHRASES = [
  "Grok",
  "0.1 mm accuracy",
  "sub-mm accuracy",
  "sub-millimeter accuracy",
  "production-certified AR",
  "replaces your CMM",
  "replaces CMM",
  "works on any camera without calibration",
  "always calibrated",
  "no calibration needed",
  "FOV is enough for metrology",
  "certified metrology",
  "medical",
  "patient safety",
] as const;

export const claims: Claim[] = [
  {
    id: "integrated-studio",
    statement:
      "One integrated Studio instead of a chain of CLI tools.",
    evidence:
      "Studio G horizontal workflow strip vs scripts/0_Load… through 6_Archive…; product README pipeline",
    risk: "safe",
  },
  {
    id: "workflow-load-track",
    statement:
      "Load · track — open a saved scene and track with live outline overlay.",
    evidence: "Workflow::LoadTrack / product UI workflow cards",
    risk: "safe",
  },
  {
    id: "workflow-build-pnp",
    statement:
      "Build · PnP — photograph the mould, annotate landmarks, and solve tag poses.",
    evidence: "Workflow::BuildPnp / Capture annotate → solve path",
    risk: "safe",
  },
  {
    id: "workflow-build-cmm",
    statement:
      "Build · CMM — ingest CMM-measured tag corners and build a scene without photo capture.",
    evidence: "Workflow::BuildCmm / CMM CSV corner import",
    risk: "safe",
  },
  {
    id: "two-build-methods",
    statement:
      "Two build methods: photo-based multi-view PnP and CMM-measured tag corners.",
    evidence: "Workflow::BuildPnp / BuildCmm",
    risk: "safe",
  },
  {
    id: "setup-case",
    statement:
      "Setup holds the case name, tags (id + size_mm), outline, and either landmarks (PnP) or CMM CSV (CMM).",
    evidence: "Studio G Setup page / case fields",
    risk: "safe",
  },
  {
    id: "print-tags-actual-size",
    statement:
      "Print-ready AprilTag sticker sheets and a ChArUco board at actual size.",
    evidence: "Tag sheet / board print outputs (tags/board, calibrator --board)",
    risk: "safe",
  },
  {
    id: "apriltag-dict",
    statement:
      "AprilTag dictionary support (e.g. 36h11 in demos) with printable sheets.",
    evidence: "Tag print / demo bicycle example configuration",
    risk: "safe",
  },
  {
    id: "load-k",
    statement: "Load K — import measured camera intrinsics for tracking.",
    evidence: "Camera / Calibrate: Load K path",
    risk: "safe",
  },
  {
    id: "measure-k",
    statement:
      "Measure K — ChArUco board calibration for real camera intrinsics.",
    evidence: "Calibrate page Measure K + board geometry in calibration docs",
    risk: "safe",
  },
  {
    id: "scene-k",
    statement:
      "Scene-embedded K can supply intrinsics from a saved scene.",
    evidence: "Scene JSON intrinsics / liveLensKind scene path",
    risk: "safe",
  },
  {
    id: "fov-placeholder",
    statement:
      "FOV guess is an explicit non-calibrated placeholder only — not a real calibration.",
    evidence:
      "Track help / liveLensKind: “FOV guess = placeholder only, not a real calibration”",
    notes:
      "Marketing may promote Load/Measure/scene K as the proper path; must not imply FOV guess is real K or that every session is always calibrated.",
    risk: "safe",
  },
  {
    id: "solve-pnp",
    statement:
      "Capture, annotate landmarks, and solve multi-view PnP for tag poses.",
    evidence: "Capture SHOOT / ANNOTATE / REVIEW + PnP solver",
    risk: "safe",
  },
  {
    id: "build-from-cmm",
    statement:
      "Build a tracking scene from CMM CSV tag corners without the Capture stage.",
    evidence: "Build · CMM workflow; Scene “Build from CMM”",
    risk: "safe",
  },
  {
    id: "scene-json",
    statement:
      "Scene JSON packages outline, tags, and intrinsics for 3D preview and tracking.",
    evidence: "anaglyph_scene / Scene page 3D preview",
    risk: "safe",
  },
  {
    id: "cmm-compare",
    statement:
      "Optional CMM compare tools against measured ground-truth corners.",
    evidence: "Scene / solve CMM compare UI; reports archive scripts",
    notes:
      "Compare tooling is not a claim of certified live AR metrology accuracy.",
    risk: "safe",
  },
  {
    id: "live-outline-lock",
    statement:
      "Live tracking locks a CAD outline onto the mould with tag detection.",
    evidence: "Track page live AR overlay",
    risk: "safe",
  },
  {
    id: "err-px",
    statement: "Track error can be shown as reprojection error in pixels.",
    evidence: "Track page error readout (px)",
    risk: "safe",
  },
  {
    id: "err-mm-approx",
    statement:
      "Optional approx mm error converts reprojection at estimated depth — approximate, not CMM uncertainty.",
    evidence: "trackErrInMm / formatTrackErr; Track approx mm toggle",
    notes:
      "Never present approx mm as certified sub-mm accuracy or CMM-grade live AR.",
    risk: "forbidden-if-numeric",
  },
  {
    id: "platform-windows",
    statement: "Windows 10/11 x64 desktop console.",
    evidence: "Share package / BUILD.md platform notes",
    risk: "safe",
  },
  {
    id: "cameras-webcam-video-ic4",
    statement:
      "Camera options: webcam, video file, and IC4 (share runtime); Spinnaker is an optional SDK build.",
    evidence: "Source enum + CMake WITH_IC4 / WITH_SPINNAKER",
    notes:
      "Do not claim certified support on all GigE cameras.",
    risk: "safe",
  },
  {
    id: "packaging-runtime",
    statement:
      "Ready-to-run runtime zip (measured package size; see downloads sizeHint).",
    evidence: "Measured 2026-07-18 share package ~49.5 MB",
    risk: "safe",
  },
  {
    id: "packaging-source",
    statement:
      "Source zip with build pointers (OpenCV, optional industrial SDKs).",
    evidence: "Measured 2026-07-18 source package ~36.6 MB; BUILD.md",
    risk: "safe",
  },
  {
    id: "product-name",
    statement:
      "Product name is Anaglyph Studio (G) / Studio G only — never brand as Grok.",
    evidence: "CONTRIBUTING.md product naming; design doc brand rule",
    risk: "safe",
  },
];

/** Lookup map for chips and tests */
export const claimsById: ReadonlyMap<string, Claim> = new Map(
  claims.map((c) => [c.id, c]),
);

export function getClaim(id: string): Claim | undefined {
  return claimsById.get(id);
}
