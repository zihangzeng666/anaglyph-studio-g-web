/**
 * Typed marketing content model for Anaglyph Studio (G).
 * Presentational components consume these shapes; copy lives outside JSX.
 */

/** Stable page section ids — parallel PRs map id → component in page.tsx */
export type SectionId =
  | "hero"
  | "problem"
  | "pipeline"
  | "paths"
  | "hold"
  | "specs"
  | "printables"
  | "cameras"
  | "cta"
  | "footer";

/** Product workflow ids (exact labels live on WorkflowEntry.label) */
export type WorkflowId = "load-track" | "build-pnp" | "build-cmm";

/** Pipeline chapter ids (scroll story) */
export type ChapterId =
  | "setup"
  | "tags"
  | "camera-k"
  | "solve-cmm"
  | "scene"
  | "track";

export type ClaimRisk = "safe" | "needs-review" | "forbidden-if-numeric";

export type MediaMode = "none" | "crossfade" | "scroll-scrub" | "hold-scrub";

export interface Claim {
  id: string;
  /** Claim-safe marketing statement */
  statement: string;
  /** Product anchor: UI label, file path, or doc section — required for review */
  evidence: string;
  /** Extra reviewer notes (not shown on site) */
  notes?: string;
  risk: ClaimRisk;
}

export interface ChapterChip {
  label: string;
  /** Must reference Claim.id — enforced by claims-map test */
  claimId: string;
}

export interface ChapterMedia {
  type: "video" | "image";
  /** Placeholder path until media PR ships assets */
  src: string;
  poster?: string;
  alt: string;
}

export interface ChapterMotion {
  /** Prefer vh for design; motion controller converts at runtime */
  scrollVh: number;
  pin?: boolean;
  mediaMode: MediaMode;
  scrubMediaId?: string;
}

export interface Chapter {
  id: ChapterId;
  /** Zero-padded step index, e.g. "01" */
  index: string;
  title: string;
  body: string;
  chips: ChapterChip[];
  media: ChapterMedia;
  motion: ChapterMotion;
}

export interface SectionSlot {
  id: SectionId;
  /** Key into the page.tsx component map */
  component: string;
}

export type DownloadId = "runtime" | "source";

export interface DownloadRef {
  id: DownloadId;
  label: string;
  filename: string;
  /**
   * External immutable HTTPS URL only.
   * Never a path into public/ for multi-ten-MB zips.
   * Empty string = placeholder until PR8 wires real host.
   */
  href: string;
  /** Only after measurement, e.g. "49.5 MB" */
  sizeHint?: string;
  /** SHA-256 hex; placeholder until release package is hashed */
  sha256?: string;
  /** ISO date matching package stamp */
  updated: string;
}

export interface WorkflowEntry {
  id: WorkflowId;
  /** Exact product strings: Load · track / Build · PnP / Build · CMM */
  label: string;
  steps: string[];
  optionalSteps?: string[];
  sceneSource: string;
}

export interface SpecRow {
  label: string;
  value: string;
}

export interface SiteConfig {
  productName: "Anaglyph Studio (G)";
  shortName: "Studio G";
  tagline: string;
  /** Claim-safe hero lead (Appendix A) */
  lead: string;
  sections: SectionSlot[];
  chapters: Chapter[];
  workflows: WorkflowEntry[];
  claims: Claim[];
  downloads: DownloadRef[];
  specs: SpecRow[];
  /** Phrases that must never appear in marketing copy */
  forbiddenPhrases: readonly string[];
}
