import { claims, FORBIDDEN_PHRASES } from "./claims";
import { chapters } from "./chapters";
import { downloads } from "./downloads";
import type { SectionSlot, SiteConfig, WorkflowEntry } from "./types";

/**
 * Page section registry. page.tsx maps `id` → component only;
 * parallel section PRs add modules without editing shared JSX blocks.
 */
export const sections: SectionSlot[] = [
  { id: "hero", component: "Hero" },
  { id: "problem", component: "Problem" },
  { id: "paths", component: "Paths" },
  { id: "pipeline", component: "Pipeline" },
  { id: "hold", component: "Hold" },
  { id: "specs", component: "Specs" },
  { id: "printables", component: "Printables" },
  { id: "cameras", component: "Cameras" },
  { id: "cta", component: "Cta" },
  { id: "footer", component: "Footer" },
];

/**
 * Three product workflows — labels match Studio G UI exactly.
 * Load · track: Calibrate (K) is optional (dashed node on path diagram).
 */
export const workflows: WorkflowEntry[] = [
  {
    id: "load-track",
    label: "Load · track",
    steps: ["Camera", "Track"],
    optionalSteps: ["Calibrate"],
    sceneSource: "Load existing scene JSON",
  },
  {
    id: "build-pnp",
    label: "Build · PnP",
    steps: ["Setup", "Camera", "Calibrate", "Capture", "Scene", "Track"],
    sceneSource: "Photo multi-view PnP solve",
  },
  {
    id: "build-cmm",
    label: "Build · CMM",
    steps: ["Setup", "Camera", "Calibrate", "Scene", "Track"],
    sceneSource: "CMM CSV tag corners",
  },
];

/** Spec grid — qualitative / product-true rows only (no fake tolerances). */
export const specs: SiteConfig["specs"] = [
  { label: "Platform", value: "Windows 10/11 x64" },
  { label: "UI", value: "Dear ImGui · Direct3D 11" },
  { label: "Vision", value: "OpenCV 4.11" },
  {
    label: "Tags",
    value: "AprilTag (e.g. 36h11 in demos) · printable sheets",
  },
  {
    label: "Calibration",
    value:
      "ChArUco board print + Measure K / Load K (FOV guess is placeholder only)",
  },
  {
    label: "Build paths",
    value: "Photo PnP · CMM CSV corners · Load scene JSON",
  },
  {
    label: "Cameras",
    value:
      "Webcam · video file · IC4 (share runtime) · Spinnaker (optional SDK build)",
  },
  {
    label: "Error display",
    value: "Reprojection px · optional approx mm at depth",
  },
  {
    label: "Packaging",
    value: "Ready-to-run zip (~49.5 MB) · source zip (~36.6 MB) — re-measure per release",
  },
];

export const site: SiteConfig = {
  productName: "Anaglyph Studio (G)",
  shortName: "Studio G",
  tagline: "Lock the outline.",
  lead: "An industrial desktop console for mould setup and live AR outline tracking — Build with photos or CMM, or load a scene and track.",
  sections,
  chapters,
  workflows,
  claims,
  downloads,
  specs,
  forbiddenPhrases: FORBIDDEN_PHRASES,
};

export default site;
