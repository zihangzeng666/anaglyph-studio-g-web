/**
 * Privacy-friendly analytics façade.
 *
 * Default: no-op in production; console.debug in development.
 * When NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set, events can be forwarded
 * to window.plausible if the vendor script is loaded by the host.
 *
 * No cookies, no PII. Soft KPIs: cta_click, chapter_view, scroll_depth, demo_submit.
 */

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

const isDev =
  typeof process !== "undefined" && process.env.NODE_ENV === "development";

function hasPlausible(): boolean {
  return Boolean(
    typeof window !== "undefined" &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (window as any).plausible === "function",
  );
}

/**
 * Track a named event. Safe to call from client components only for
 * meaningful props; SSR calls are ignored.
 */
export function track(event: string, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;

  if (isDev) {
    console.debug("[analytics]", event, props ?? {});
  }

  if (hasPlausible()) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).plausible(event, props ? { props } : undefined);
    } catch {
      // vendor script optional
    }
  }
}

export function trackCta(label: string, href?: string): void {
  track("cta_click", { label, href });
}

export function trackChapterView(chapterId: string): void {
  track("chapter_view", { chapter_id: chapterId });
}

export function trackScrollDepth(percent: 25 | 50 | 75 | 100): void {
  track("scroll_depth", { percent });
}

export function trackDemoSubmit(method: "mailto" | "formspree"): void {
  track("demo_submit", { method });
}
