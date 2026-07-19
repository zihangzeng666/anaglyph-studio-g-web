import type { Chapter } from "./types";

/**
 * Pipeline scroll chapters: Setup → Tags → Camera K → Solve/CMM → Scene → Track.
 * Media: real Studio G UI captures under public/media/pipeline (2026-07-18).
 * Hold scrub is section "hold", not scroll-driven.
 */
export const chapters: Chapter[] = [
  {
    id: "setup",
    index: "01",
    title: "Setup",
    body: "Every job starts as a case. Name it, list the tags (id + size_mm), load the CAD outline, then attach landmarks for PnP — or a CMM CSV of measured corners.",
    chips: [
      { label: "Case + tags", claimId: "setup-case" },
      { label: "Outline", claimId: "setup-case" },
      { label: "Landmarks or CMM", claimId: "two-build-methods" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/setup.png",
      alt: "Studio G Setup — case my_mould, tags, landmarks, bicycle outline (Build · PnP)",
      caption:
        "Case my_mould in Setup — tags, landmarks, and the bicycle outline, ready for Build · PnP.",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "tags",
    index: "02",
    title: "Tags",
    body: "Print AprilTag sticker sheets and a ChArUco board at actual size — 100% scale, never fit-to-page — so the markers on the mould measure exactly what the case says they do.",
    chips: [
      { label: "Actual-size print", claimId: "print-tags-actual-size" },
      { label: "AprilTag sheets", claimId: "apriltag-dict" },
      { label: "ChArUco board", claimId: "measure-k" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/tags.png",
      alt: "Printable AprilTag sheet — IDs 1–5 at actual size (25–30 mm)",
      caption:
        "One sheet, IDs 1–5 at 25–30 mm — printed at 100%, applied straight to the mould.",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "camera-k",
    index: "03",
    title: "Camera K",
    body: "Real intrinsics come from Load K or Measure K; a saved scene can carry its own. The FOV guess stays what it says it is — a placeholder, not a real calibration.",
    chips: [
      { label: "Load K", claimId: "load-k" },
      { label: "Measure K", claimId: "measure-k" },
      { label: "Scene K", claimId: "scene-k" },
      { label: "FOV = placeholder", claimId: "fov-placeholder" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/camera-k.png",
      alt: "Studio G Start — open scene or Build · PnP with Camera path",
      caption:
        "The Start screen — open a saved scene, or take the camera path into Build · PnP.",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "solve-cmm",
    index: "04",
    title: "Solve / CMM",
    body: "Here the paths part. Build · PnP shoots the mould, annotates landmarks, and solves multi-view PnP; Build · CMM skips photo capture entirely and builds from measured tag corners.",
    chips: [
      { label: "Build · PnP", claimId: "workflow-build-pnp" },
      { label: "Capture → solve", claimId: "solve-pnp" },
      { label: "Build · CMM", claimId: "workflow-build-cmm" },
      { label: "CMM CSV corners", claimId: "build-from-cmm" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/solve-cmm.png",
      alt: "PnP solve result — outline with landmarks and tag reproject metrics",
      caption:
        "A solve, landed — the outline over its landmarks, per-tag reprojection in the margin.",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "scene",
    index: "05",
    title: "Scene",
    body: "One scene JSON carries the outline, tags, and intrinsics — turn it over in 3D before you commit. CMM compare checks against measured ground truth; a check, not a live accuracy certificate.",
    chips: [
      { label: "Scene JSON", claimId: "scene-json" },
      { label: "3D preview", claimId: "scene-json" },
      { label: "CMM compare", claimId: "cmm-compare" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/scene.png",
      alt: "3D scene preview — outline with axes and landmarks L1–L7",
      caption:
        "The scene in 3D — outline, axes, landmarks L1–L7 — one last look before tracking.",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "track",
    index: "06",
    title: "Track",
    body: "Tags found, outline locked — live on the mould. Error reads as reprojection in pixels; approx mm at estimated depth is there when you want it, and it says approx.",
    chips: [
      { label: "Live outline lock", claimId: "live-outline-lock" },
      { label: "err px", claimId: "err-px" },
      { label: "approx mm", claimId: "err-mm-approx" },
      { label: "Load · track", claimId: "workflow-load-track" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/track.png",
      alt: "Live AR track — carbon mould with locked CAD outline and AprilTag",
      caption: "Live on the carbon mould — outline locked, tag in view.",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
  },
];
