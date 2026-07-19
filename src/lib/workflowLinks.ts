/**
 * Logical map: Studio G workflows / step labels → pipeline chapter anchors.
 *
 * Product truth (from AR research reports):
 * - Core sell = lock CAD mould outline onto the live camera via AprilTags + real K.
 * - Three ways into a scene: Load JSON · Build · PnP (photos) · Build · CMM (measured corners).
 * - Pipeline chapters are product pages: Setup → Tags → Camera K → Solve/CMM → Scene → Track.
 */

import type { WorkflowId } from "../../content/types";

/** Pipeline chapter element ids (match content/chapters.ts + article id=). */
export type PipelineChapterId =
  | "setup"
  | "tags"
  | "camera-k"
  | "solve-cmm"
  | "scene"
  | "track";

/**
 * Map a workflow *step label* (as shown in Studio G / Paths UI) to the
 * pipeline chapter that explains that step.
 */
export function stepToChapter(stepLabel: string): PipelineChapterId {
  const key = stepLabel.replace("?", "").trim().toLowerCase();
  switch (key) {
    case "setup":
      return "setup";
    case "tags":
      return "tags";
    case "camera":
    case "calibrate":
    case "measure k":
    case "load k":
      return "camera-k";
    case "capture":
    case "solve":
    case "annotate":
    case "pnp":
      return "solve-cmm";
    case "scene":
      return "scene";
    case "track":
    case "live":
      return "track";
    default:
      return "setup";
  }
}

/**
 * Primary deep-link when the user picks a whole workflow (card / “open path”).
 * Goes to the chapter that best defines *that* path’s differentiator.
 *
 * - Load · track → Track (scene already exists; product end-state is live lock)
 * - Build · PnP  → Solve/CMM chapter’s Capture·annotate·solve story (photo path)
 * - Build · CMM  → Setup (CMM corners / method enter before Scene · Track)
 */
export function workflowEntryChapter(id: WorkflowId): PipelineChapterId {
  switch (id) {
    case "load-track":
      return "track";
    case "build-pnp":
      return "solve-cmm";
    case "build-cmm":
      return "setup";
    default:
      return "setup";
  }
}

export function scrollToChapter(
  chapterId: PipelineChapterId | string,
  opts?: { behavior?: ScrollBehavior },
): boolean {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(chapterId);
  if (!el) return false;
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({
    behavior: opts?.behavior ?? (reduced ? "auto" : "smooth"),
    block: "start",
  });
  // Keep hash shareable
  if (typeof history !== "undefined") {
    history.replaceState(null, "", `#${chapterId}`);
  }
  return true;
}

/** Scroll to a workflow’s entry chapter (card click / “open path”). */
export function scrollToWorkflow(id: WorkflowId): boolean {
  return scrollToChapter(workflowEntryChapter(id));
}

/** Scroll to the pipeline chapter for a step chip/label. */
export function scrollToWorkflowStep(stepLabel: string): boolean {
  return scrollToChapter(stepToChapter(stepLabel));
}
