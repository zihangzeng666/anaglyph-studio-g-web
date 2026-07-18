/**
 * Sole ScrollTrigger owner for Anaglyph Studio (G) marketing site.
 *
 * Rules (design contract):
 * - Only this module creates/kills ScrollTriggers.
 * - Reduced motion: no pins, no scrub, static sections + rail jump links.
 * - Scroll never drives Hold video (hold-scrub is HoldExplore only).
 * - GSAP base + ScrollTrigger only — no Club plugins / ScrollSmoother.
 */

import type { Chapter } from "../../content/types";

export type ChapterActiveListener = (
  chapterId: string | null,
  progress: number,
) => void;

export interface RegisterChaptersOptions {
  /** Root element containing [data-chapter-id] panels */
  root: HTMLElement;
  chapters: readonly Chapter[];
  /** Desktop min width for pin behavior (default 768) */
  pinMinWidth?: number;
  onActiveChange?: ChapterActiveListener;
}

type GsapModule = typeof import("gsap");
type ScrollTriggerModule = typeof import("gsap/ScrollTrigger");

let gsapRef: GsapModule["gsap"] | null = null;
let ScrollTriggerRef: ScrollTriggerModule["ScrollTrigger"] | null = null;
let registered = false;
let mediaQuery: MediaQueryList | null = null;
let mediaHandler: (() => void) | null = null;
let lastOptions: RegisterChaptersOptions | null = null;
const triggers: { kill: () => void }[] = [];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isDesktopPin(minWidth: number): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(`(min-width: ${minWidth}px)`).matches;
}

async function ensureGsap(): Promise<boolean> {
  if (gsapRef && ScrollTriggerRef) return true;
  if (typeof window === "undefined") return false;

  const gsapMod = await import("gsap");
  const stMod = await import("gsap/ScrollTrigger");
  gsapRef = gsapMod.gsap;
  ScrollTriggerRef = stMod.ScrollTrigger;
  gsapRef.registerPlugin(ScrollTriggerRef);
  return true;
}

function clearTriggers(): void {
  while (triggers.length) {
    const t = triggers.pop();
    try {
      t?.kill();
    } catch {
      // ignore teardown races
    }
  }
  if (ScrollTriggerRef) {
    ScrollTriggerRef.getAll().forEach((t) => {
      // Only kill triggers we own — tagged via id prefix
      if (t.vars?.id?.toString().startsWith("asg-chapter-")) {
        t.kill();
      }
    });
  }
}

function bindReducedMotionListener(): void {
  if (typeof window === "undefined") return;
  if (mediaQuery && mediaHandler) {
    mediaQuery.removeEventListener("change", mediaHandler);
  }
  mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaHandler = () => {
    if (!lastOptions) return;
    void destroyMotion();
    void registerChapters(lastOptions);
  };
  mediaQuery.addEventListener("change", mediaHandler);
}

/**
 * Register pipeline chapter ScrollTriggers. Safe to call multiple times
 * (destroys previous registration first).
 */
export async function registerChapters(
  options: RegisterChaptersOptions,
): Promise<void> {
  lastOptions = options;
  await destroyMotion({ keepOptions: true });

  const { root, chapters, pinMinWidth = 768, onActiveChange } = options;

  if (prefersReducedMotion()) {
    registered = true;
    bindReducedMotionListener();
    onActiveChange?.(null, 0);
    return;
  }

  const ok = await ensureGsap();
  if (!ok || !ScrollTriggerRef || !gsapRef) {
    registered = true;
    return;
  }

  const canPin = isDesktopPin(pinMinWidth);

  for (const chapter of chapters) {
    // hold-scrub / scroll-scrub never driven from this module for Hold section
    if (chapter.motion.mediaMode === "hold-scrub") {
      continue;
    }

    const el = root.querySelector<HTMLElement>(
      `[data-chapter-id="${chapter.id}"]`,
    );
    if (!el) continue;

    const pin = Boolean(chapter.motion.pin) && canPin;
    const scrollVh = chapter.motion.scrollVh || 140;
    // end distance ≈ scrollVh while pinned
    const end = pin ? `+=${scrollVh}%` : "bottom center";

    const trigger = ScrollTriggerRef.create({
      id: `asg-chapter-${chapter.id}`,
      trigger: el,
      start: "top 25%",
      end,
      pin: pin ? el : false,
      pinSpacing: pin,
      scrub: false,
      // Crossfade stills only — never assign video.currentTime from scroll
      onEnter: () => onActiveChange?.(chapter.id, 0),
      onEnterBack: () => onActiveChange?.(chapter.id, 0),
      onLeave: () => {
        /* rail advances via next chapter onEnter */
      },
      onUpdate: (self) => {
        if (self.progress >= 0.5) {
          onActiveChange?.(chapter.id, self.progress);
        }
      },
      // Soft opacity emphasis for active panel (crossfade-like, not scrub)
      onToggle: (self) => {
        if (!gsapRef) return;
        gsapRef.to(el, {
          opacity: self.isActive ? 1 : 0.72,
          duration: 0.25,
          overwrite: "auto",
        });
      },
    });

    triggers.push(trigger);

    // Initial state
    if (gsapRef) {
      gsapRef.set(el, { opacity: 0.72 });
    }
  }

  // First visible chapter full opacity
  const first = root.querySelector<HTMLElement>("[data-chapter-id]");
  if (first && gsapRef) {
    gsapRef.set(first, { opacity: 1 });
  }

  ScrollTriggerRef.refresh();
  registered = true;
  bindReducedMotionListener();
}

export async function destroyMotion(opts?: {
  keepOptions?: boolean;
}): Promise<void> {
  clearTriggers();

  if (mediaQuery && mediaHandler && !opts?.keepOptions) {
    mediaQuery.removeEventListener("change", mediaHandler);
    mediaQuery = null;
    mediaHandler = null;
  }

  if (!opts?.keepOptions) {
    lastOptions = null;
  }

  if (ScrollTriggerRef) {
    ScrollTriggerRef.refresh();
  }

  registered = false;
}

export function isMotionRegistered(): boolean {
  return registered;
}

export function getPrefersReducedMotion(): boolean {
  return prefersReducedMotion();
}
