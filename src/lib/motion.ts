/**
 * Sole ScrollTrigger owner for Anaglyph Studio (G) marketing site.
 *
 * Rules (design contract):
 * - Only this module creates/kills ScrollTriggers.
 * - Reduced motion: no pins, no scrub; static sections + rail jump links.
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
let resizeQuery: MediaQueryList | null = null;
let resizeHandler: (() => void) | null = null;
let lastOptions: RegisterChaptersOptions | null = null;
let registerGeneration = 0;
const triggers: { kill: () => void }[] = [];
let ioFallback: IntersectionObserver | null = null;

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

  try {
    const gsapMod = await import("gsap");
    const stMod = await import("gsap/ScrollTrigger");
    gsapRef = gsapMod.gsap;
    ScrollTriggerRef = stMod.ScrollTrigger;
    gsapRef.registerPlugin(ScrollTriggerRef);
    ScrollTriggerRef.config({ ignoreMobileResize: true });
    return true;
  } catch {
    gsapRef = null;
    ScrollTriggerRef = null;
    return false;
  }
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
      if (t.vars?.id?.toString().startsWith("asg-")) {
        t.kill();
      }
    });
  }
  if (ioFallback) {
    ioFallback.disconnect();
    ioFallback = null;
  }
}

function resetChapterStyles(root: HTMLElement): void {
  root.querySelectorAll<HTMLElement>("[data-chapter-id]").forEach((el) => {
    el.style.opacity = "";
    el.style.transform = "";
    el.style.filter = "";
    el.removeAttribute("data-chapter-active");
    const fig = el.querySelector<HTMLElement>("figure");
    if (fig) {
      fig.style.opacity = "";
      fig.style.transform = "";
    }
  });
}

function setChapterVisual(
  el: HTMLElement,
  active: boolean,
  animate: boolean,
): void {
  const opacity = active ? "1" : "0.62";
  const scale = active ? "1" : "0.985";
  const fig = el.querySelector<HTMLElement>("figure");

  el.setAttribute("data-chapter-active", active ? "true" : "false");

  if (gsapRef && animate && !prefersReducedMotion()) {
    gsapRef.to(el, {
      opacity: active ? 1 : 0.62,
      scale: active ? 1 : 0.985,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
    if (fig) {
      gsapRef.to(fig, {
        opacity: active ? 1 : 0.75,
        y: active ? 0 : 10,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
    return;
  }

  el.style.opacity = opacity;
  el.style.transform = `scale(${scale})`;
  el.style.transition = animate
    ? "opacity 0.3s ease, transform 0.3s ease"
    : "none";
  if (fig) {
    fig.style.opacity = active ? "1" : "0.75";
    fig.style.transform = active ? "translateY(0)" : "translateY(8px)";
    fig.style.transition = animate
      ? "opacity 0.3s ease, transform 0.3s ease"
      : "none";
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
    void destroyMotion({ keepOptions: true });
    void registerChapters(lastOptions);
  };
  mediaQuery.addEventListener("change", mediaHandler);
}

function bindPinBreakpointListener(minWidth: number): void {
  if (typeof window === "undefined") return;
  if (resizeQuery && resizeHandler) {
    resizeQuery.removeEventListener("change", resizeHandler);
  }
  resizeQuery = window.matchMedia(`(min-width: ${minWidth}px)`);
  resizeHandler = () => {
    if (!lastOptions) return;
    void destroyMotion({ keepOptions: true });
    void registerChapters(lastOptions);
  };
  resizeQuery.addEventListener("change", resizeHandler);
}

/** IO fallback when GSAP cannot load — still updates rail + light emphasis. */
function registerIoFallback(
  root: HTMLElement,
  chapters: readonly Chapter[],
  onActiveChange?: ChapterActiveListener,
): void {
  const panels = chapters
    .map((c) => root.querySelector<HTMLElement>(`[data-chapter-id="${c.id}"]`))
    .filter((el): el is HTMLElement => Boolean(el));

  panels.forEach((el, i) => setChapterVisual(el, i === 0, false));
  onActiveChange?.(chapters[0]?.id ?? null, 0);

  ioFallback = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible?.target) return;
      const id = (visible.target as HTMLElement).dataset.chapterId ?? null;
      panels.forEach((el) => {
        setChapterVisual(el, el.dataset.chapterId === id, true);
      });
      onActiveChange?.(id, 0);
    },
    { root: null, rootMargin: "-20% 0px -35% 0px", threshold: [0.2, 0.45, 0.7] },
  );

  panels.forEach((el) => ioFallback?.observe(el));
}

/**
 * Register pipeline chapter ScrollTriggers. Safe to call multiple times
 * (destroys previous registration first).
 */
export async function registerChapters(
  options: RegisterChaptersOptions,
): Promise<void> {
  const generation = ++registerGeneration;
  lastOptions = options;
  await destroyMotion({ keepOptions: true });

  if (generation !== registerGeneration) return;

  const { root, chapters, pinMinWidth = 768, onActiveChange } = options;

  if (prefersReducedMotion()) {
    registered = true;
    bindReducedMotionListener();
    bindPinBreakpointListener(pinMinWidth);
    onActiveChange?.(chapters[0]?.id ?? null, 0);
    return;
  }

  const ok = await ensureGsap();
  if (generation !== registerGeneration) return;

  if (!ok || !ScrollTriggerRef || !gsapRef) {
    registerIoFallback(root, chapters, onActiveChange);
    registered = true;
    bindReducedMotionListener();
    bindPinBreakpointListener(pinMinWidth);
    return;
  }

  const canPin = isDesktopPin(pinMinWidth);
  const gsap = gsapRef;
  const ST = ScrollTriggerRef;

  // Section-level gentle reveals inside pipeline (header + rail already visible)
  const revealables = root.querySelectorAll<HTMLElement>("[data-reveal]");
  revealables.forEach((el, i) => {
    gsap.set(el, { opacity: 0, y: 18 });
    const t = ST.create({
      id: `asg-reveal-${i}`,
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          delay: Math.min(i * 0.04, 0.2),
          overwrite: "auto",
        });
      },
    });
    triggers.push(t);
  });

  for (const chapter of chapters) {
    if (chapter.motion.mediaMode === "hold-scrub") continue;

    const el = root.querySelector<HTMLElement>(
      `[data-chapter-id="${chapter.id}"]`,
    );
    if (!el) continue;

    const pin = Boolean(chapter.motion.pin) && canPin;
    const scrollVh = chapter.motion.scrollVh || 140;
    const end = pin ? `+=${scrollVh}%` : "bottom center";
    const fig = el.querySelector<HTMLElement>("figure");

    gsap.set(el, { opacity: 0.62, scale: 0.985, transformOrigin: "center top" });
    if (fig) gsap.set(fig, { opacity: 0.75, y: 12 });

    const trigger = ST.create({
      id: `asg-chapter-${chapter.id}`,
      trigger: el,
      start: "top 28%",
      end,
      pin: pin ? el : false,
      pinSpacing: pin,
      anticipatePin: pin ? 1 : 0,
      scrub: false,
      invalidateOnRefresh: true,
      onEnter: () => {
        setChapterVisual(el, true, true);
        onActiveChange?.(chapter.id, 0);
      },
      onEnterBack: () => {
        setChapterVisual(el, true, true);
        onActiveChange?.(chapter.id, 0);
      },
      onLeave: () => {
        setChapterVisual(el, false, true);
      },
      onLeaveBack: () => {
        setChapterVisual(el, false, true);
      },
      onUpdate: (self) => {
        if (self.isActive) {
          onActiveChange?.(chapter.id, self.progress);
        }
      },
    });

    triggers.push(trigger);
  }

  // First chapter starts fully active
  const first = root.querySelector<HTMLElement>("[data-chapter-id]");
  if (first) setChapterVisual(first, true, false);

  const refresh = () => {
    if (generation !== registerGeneration) return;
    ST.refresh();
  };

  // Media + fonts can shift layout after first paint (SVG stills)
  requestAnimationFrame(refresh);
  window.addEventListener("load", refresh, { once: true });
  root.querySelectorAll("img").forEach((img) => {
    if (!img.complete) {
      img.addEventListener("load", refresh, { once: true });
    }
  });

  ST.refresh();
  registered = true;
  bindReducedMotionListener();
  bindPinBreakpointListener(pinMinWidth);
}

export async function destroyMotion(opts?: {
  keepOptions?: boolean;
}): Promise<void> {
  if (lastOptions?.root) {
    resetChapterStyles(lastOptions.root);
  }

  clearTriggers();

  if (mediaQuery && mediaHandler && !opts?.keepOptions) {
    mediaQuery.removeEventListener("change", mediaHandler);
    mediaQuery = null;
    mediaHandler = null;
  }

  if (resizeQuery && resizeHandler && !opts?.keepOptions) {
    resizeQuery.removeEventListener("change", resizeHandler);
    resizeQuery = null;
    resizeHandler = null;
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

/** Smooth-scroll helper used by rail / path diagram. */
export function scrollToId(
  id: string,
  opts?: { behavior?: ScrollBehavior; block?: ScrollLogicalPosition },
): boolean {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(id);
  if (!el) return false;
  const reduced = prefersReducedMotion();
  el.scrollIntoView({
    behavior: opts?.behavior ?? (reduced ? "auto" : "smooth"),
    block: opts?.block ?? "start",
  });
  return true;
}
