import type { Chapter } from "./types";

/**
 * Pipeline scroll chapters: Setup → Tags → Camera K → Solve/CMM → Scene → Track.
 * Media paths are placeholders until the media PR ships captures.
 * v1 motion: crossfade stills (hold-scrub is section "hold", not scroll).
 */
export const chapters: Chapter[] = [
  {
    id: "setup",
    index: "01",
    title: "Setup",
    body: "Name the case, define tags (id + size_mm), load the CAD outline, and attach landmarks for PnP or a CMM CSV for measured corners.",
    chips: [
      { label: "Case + tags", claimId: "setup-case" },
      { label: "Outline", claimId: "setup-case" },
      { label: "Landmarks or CMM", claimId: "two-build-methods" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/setup.png",
      alt: "Studio G Setup page with case, tags, and outline fields",
    },
    motion: { scrollVh: 140, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "tags",
    index: "02",
    title: "Tags",
    body: "Print AprilTag sticker sheets and a ChArUco calibration board at actual size so physical markers match the case definition.",
    chips: [
      { label: "Actual-size print", claimId: "print-tags-actual-size" },
      { label: "AprilTag sheets", claimId: "apriltag-dict" },
      { label: "ChArUco board", claimId: "measure-k" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/tags.png",
      alt: "Printable AprilTag sheet and ChArUco board crop",
    },
    motion: { scrollVh: 140, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "camera-k",
    index: "03",
    title: "Camera K",
    body: "Load K or Measure K for real camera intrinsics; scene-embedded K is also supported. FOV guess is a placeholder only — not a real calibration.",
    chips: [
      { label: "Load K", claimId: "load-k" },
      { label: "Measure K", claimId: "measure-k" },
      { label: "Scene K", claimId: "scene-k" },
      { label: "FOV = placeholder", claimId: "fov-placeholder" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/camera-k.png",
      alt: "Studio G Calibrate page — Measure K, not FOV as hero",
    },
    motion: { scrollVh: 140, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "solve-cmm",
    index: "04",
    title: "Solve / CMM",
    body: "Branch by workflow: Capture · annotate · solve for Build · PnP, or skip photo capture and build from CMM-measured tag corners.",
    chips: [
      { label: "Build · PnP", claimId: "workflow-build-pnp" },
      { label: "Capture → solve", claimId: "solve-pnp" },
      { label: "Build · CMM", claimId: "workflow-build-cmm" },
      { label: "CMM CSV corners", claimId: "build-from-cmm" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/solve-cmm.png",
      alt: "Dual panel: PnP capture annotate versus Build from CMM",
    },
    motion: { scrollVh: 160, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "scene",
    index: "05",
    title: "Scene",
    body: "Scene JSON packages outline, tags, and intrinsics for 3D preview. Optional CMM compare tools check measured ground truth — not a live accuracy certificate.",
    chips: [
      { label: "Scene JSON", claimId: "scene-json" },
      { label: "3D preview", claimId: "scene-json" },
      { label: "CMM compare", claimId: "cmm-compare" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/scene.png",
      alt: "Studio G Scene page with 3D preview",
    },
    motion: { scrollVh: 140, pin: true, mediaMode: "crossfade" },
  },
  {
    id: "track",
    index: "06",
    title: "Track",
    body: "Live tag detection locks the CAD outline on the mould. Error readout is reprojection in pixels, with optional approximate mm at estimated depth.",
    chips: [
      { label: "Live outline lock", claimId: "live-outline-lock" },
      { label: "err px", claimId: "err-px" },
      { label: "approx mm", claimId: "err-mm-approx" },
      { label: "Load · track", claimId: "workflow-load-track" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/track.png",
      alt: "Live tracking with outline overlay and error readout",
    },
    motion: { scrollVh: 140, pin: true, mediaMode: "crossfade" },
  },
];
