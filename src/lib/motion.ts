/**
 * Pipeline scroll: sticky long-dwell + smooth scrubbed fades.
 *
 * Continuity: next card peeks under the active sticky card.
 * Smoothness: visual state is continuous in scroll progress (scrub lag),
 * not hard onEnter snaps. No photo scale/zoom.
 *
 * Scroll never drives Hold video.
 */

import type { Chapter } from "../../content/types";

export type ChapterActiveListener = (
  chapterId: string | null,
  progress: number,
) => void;

export interface RegisterChaptersOptions {
  root: HTMLElement;
  chapters: readonly Chapter[];
  pinMinWidth?: number;
  onActiveChange?: ChapterActiveListener;
  onPipelineProgress?: (progress: number) => void;
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

/** Below site header + sticky pipeline rail */
const STICKY_TOP = "9.5rem";
/** Scroll lag — higher = silkier follow */
const SCRUB = 1.15;

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function canEnhance(minWidth: number): boolean {
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
  // Smoother scrub sampling
  ScrollTriggerRef.config({ ignoreMobileResize: true });
  return true;
}

function clearTriggers(): void {
  while (triggers.length) {
    try {
      triggers.pop()?.kill();
    } catch {
      // ignore
    }
  }
  if (ScrollTriggerRef) {
    ScrollTriggerRef.getAll().forEach((t) => {
      if (t.vars?.id?.toString().startsWith("asg-")) t.kill();
    });
  }
}

function resetInlineStyles(root: HTMLElement): void {
  root
    .querySelectorAll<HTMLElement>(
      "[data-chapter-id], [data-chapter-copy], [data-chapter-media], [data-chapter-caption], [data-chapter-dwell]",
    )
    .forEach((el) => {
      el.style.opacity = "";
      el.style.transform = "";
      el.style.filter = "";
      el.style.zIndex = "";
      el.style.position = "";
      el.style.top = "";
      el.style.minHeight = "";
      el.classList.remove("is-active-chapter", "is-peek-next", "is-resting");
    });
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
 * Map dwell progress → card strength 0..1
 * Long plateau in the middle (dwell), soft ramp in/out (smooth hand-off).
 */
function dwellStrength(p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 0;
  // Ease into full by 18%, hold until 72%, ease out
  if (p < 0.18) {
    const t = p / 0.18;
    // smoothstep
    return t * t * (3 - 2 * t);
  }
  if (p > 0.72) {
    const t = (p - 0.72) / 0.28;
    const s = t * t * (3 - 2 * t);
    return 1 - s;
  }
  return 1;
}

export async function registerChapters(
  options: RegisterChaptersOptions,
): Promise<void> {
  lastOptions = options;
  await destroyMotion({ keepOptions: true });

  const {
    root,
    chapters,
    pinMinWidth = 768,
    onActiveChange,
    onPipelineProgress,
  } = options;

  onActiveChange?.(chapters[0]?.id ?? null, 0);
  onPipelineProgress?.(0);

  const stack = root.querySelector<HTMLElement>("[data-pipeline-chapters]");
  const list = chapters.filter((c) => c.motion.mediaMode !== "hold-scrub");
  const n = Math.max(1, list.length);

  if (prefersReducedMotion()) {
    if (stack) {
      const onScroll = () => {
        const rect = stack.getBoundingClientRect();
        const view = window.innerHeight || 1;
        const total = Math.max(1, rect.height);
        const traveled = Math.min(total, Math.max(0, -rect.top + view * 0.35));
        onPipelineProgress?.(traveled / total);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      triggers.push({
        kill: () => window.removeEventListener("scroll", onScroll),
      });
    }
    registered = true;
    bindReducedMotionListener();
    return;
  }

  const ok = await ensureGsap();
  if (!ok || !ScrollTriggerRef || !gsapRef) {
    registered = true;
    return;
  }

  const gsap = gsapRef;
  const ScrollTrigger = ScrollTriggerRef;
  const enhance = canEnhance(pinMinWidth);
  let activeId: string | null = null;

  const setActive = (id: string | null) => {
    if (!id || id === activeId) return;
    activeId = id;
    root.querySelectorAll<HTMLElement>("[data-chapter-id]").forEach((node) => {
      const on = node.dataset.chapterId === id;
      node.classList.toggle("is-active-chapter", on);
      node.classList.toggle("is-resting", !on);
      node.classList.remove("is-peek-next");
    });
    onActiveChange?.(id, 0);
  };

  list.forEach((chapter, i) => {
    const el = root.querySelector<HTMLElement>(
      `[data-chapter-id="${chapter.id}"]`,
    );
    if (!el) return;
    const dwell =
      el.closest<HTMLElement>("[data-chapter-dwell]") ?? el.parentElement;
    if (!dwell) return;

    const copy = el.querySelector<HTMLElement>("[data-chapter-copy]");
    const media = el.querySelector<HTMLElement>("[data-chapter-media]");
    const caption = el.querySelector<HTMLElement>("[data-chapter-caption]");

    const dwellVh =
      typeof chapter.motion.scrollVh === "number" && chapter.motion.scrollVh > 80
        ? chapter.motion.scrollVh
        : 200;

    if (enhance) {
      dwell.style.minHeight = `${dwellVh}vh`;
      el.style.position = "sticky";
      el.style.top = STICKY_TOP;
      el.style.zIndex = String(10 + i);
    } else {
      dwell.style.minHeight = "";
      el.style.position = "";
      el.style.top = "";
      el.style.zIndex = "";
    }

    // Baseline floor — next card stays faintly visible (continuity)
    const baseOpacity = 0.4;
    const fromX = i % 2 === 0 ? -18 : 18;
    gsap.set(el, { opacity: i === 0 ? 1 : baseOpacity, force3D: true });
    if (copy) gsap.set(copy, { y: 0, opacity: 1, force3D: true });
    if (media) gsap.set(media, { x: 0, y: 0, opacity: 1, force3D: true });
    if (caption) gsap.set(caption, { y: 0, opacity: 1 });

    if (i === 0) el.classList.add("is-active-chapter");
    else el.classList.add("is-resting");

    // Single ScrollTrigger drives all visuals — no competing fromTo + set
    triggers.push(
      ScrollTrigger.create({
        id: `asg-dwell-${chapter.id}`,
        trigger: dwell,
        start: "top 72%",
        end: "bottom 32%",
        scrub: SCRUB,
        onUpdate: (self) => {
          const p = self.progress;
          const s = dwellStrength(p);

          // Card: soft floor → full → soft floor (plateau = dwell)
          gsap.set(el, {
            opacity: baseOpacity + (1 - baseOpacity) * s,
          });

          // Enter lift (first fifth) — smoothstep, not a snap
          const enter = Math.min(1, Math.max(0, p / 0.2));
          const enterE = enter * enter * (3 - 2 * enter);
          // Exit settle (last fifth)
          const exitT = Math.min(1, Math.max(0, (p - 0.78) / 0.22));
          const exitE = exitT * exitT * (3 - 2 * exitT);

          if (copy) {
            gsap.set(copy, {
              opacity: 0.65 + 0.35 * s,
              y: (1 - enterE) * 24 + exitE * -10,
            });
          }
          if (media) {
            gsap.set(media, {
              opacity: 0.6 + 0.4 * s,
              y: (1 - enterE) * 18 + exitE * -8,
              x: fromX * (1 - enterE),
            });
          }
          if (caption) {
            gsap.set(caption, {
              opacity: 0.5 + 0.5 * s,
              y: (1 - enterE) * 8,
            });
          }

          // Progress: long hold mid-step
          const shaped =
            p < 0.14
              ? (p / 0.14) * 0.1
              : p > 0.86
                ? 0.9 + ((p - 0.86) / 0.14) * 0.1
                : 0.1 + ((p - 0.14) / 0.72) * 0.8;
          onPipelineProgress?.(Math.min(1, Math.max(0, (i + shaped) / n)));

          // Classes for border/rail — hysteresis-ish thresholds
          if (s > 0.5) {
            if (activeId !== chapter.id) setActive(chapter.id);
            el.classList.add("is-active-chapter");
            el.classList.remove("is-resting", "is-peek-next");
          } else if (s > 0.18) {
            el.classList.add("is-peek-next");
            el.classList.remove("is-active-chapter", "is-resting");
          } else {
            el.classList.add("is-resting");
            el.classList.remove("is-active-chapter", "is-peek-next");
          }
        },
      }),
    );
  });

  // Master progress edges (fills bar cleanly at stack bounds)
  if (stack) {
    triggers.push(
      ScrollTrigger.create({
        id: "asg-pipeline-bounds",
        trigger: stack,
        start: "top 80%",
        end: "bottom 20%",
        scrub: SCRUB,
        onUpdate: (self) => {
          if (self.progress <= 0.01) onPipelineProgress?.(0);
          if (self.progress >= 0.99) onPipelineProgress?.(1);
        },
      }),
    );
  }

  // Refresh after layout settles (images / sticky)
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
  window.addEventListener(
    "load",
    () => {
      ScrollTrigger.refresh();
    },
    { once: true },
  );

  registered = true;
  bindReducedMotionListener();
}

export async function destroyMotion(opts?: {
  keepOptions?: boolean;
}): Promise<void> {
  clearTriggers();
  if (lastOptions?.root) resetInlineStyles(lastOptions.root);

  if (mediaQuery && mediaHandler && !opts?.keepOptions) {
    mediaQuery.removeEventListener("change", mediaHandler);
    mediaQuery = null;
    mediaHandler = null;
  }
  if (!opts?.keepOptions) lastOptions = null;
  if (ScrollTriggerRef) ScrollTriggerRef.refresh();
  registered = false;
}

export function isMotionRegistered(): boolean {
  return registered;
}

export function getPrefersReducedMotion(): boolean {
  return prefersReducedMotion();
}
