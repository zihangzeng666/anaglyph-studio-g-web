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
    body: "Name the case, define tags (id + size_mm), load the CAD outline, and attach landmarks for PnP or a CMM CSV for measured corners.",
    chips: [
      { label: "Case + tags", claimId: "setup-case" },
      { label: "Outline", claimId: "setup-case" },
      { label: "Landmarks or CMM", claimId: "two-build-methods" },
    ],
    media: {
      type: "image",
      src: "/media/pipeline/setup.png",
      alt: "Studio G Setup — case my_mould, AprilTag table, bicycle outline with landmarks",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
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
      alt: "Studio G Setup Tags — DICT_APRILTAG_36h11 with size_mm and landmark list",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
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
      alt: "Studio G Capture — live webcam feed for Build · PnP photo capture",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
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
      alt: "Studio G Capture & Solve — live camera view during Build · PnP",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
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
      alt: "Studio G Scene — 3D outline preview with landmarks L1–L7",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
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
      alt: "Studio G Track — live camera ready with outline, axes, and tags toggles",
    },
    motion: { scrollVh: 200, pin: true, mediaMode: "crossfade" },
  },
];
