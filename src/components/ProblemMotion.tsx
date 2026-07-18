"use client";

import { useEffect, useRef } from "react";
import { getPrefersReducedMotion } from "@/lib/motion";

/**
 * Scroll-in for the evolution compare cards (earlier form ↔ Studio G).
 * Slide + strong fade; no scale/zoom. Staggers CLI / step chips.
 */
export function ProblemMotion({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || getPrefersReducedMotion()) return;

    let cancelled = false;
    let killScroll: (() => void) | null = null;

    void (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled || !root) return;
      gsap.registerPlugin(ScrollTrigger);

      const lead = root.querySelectorAll<HTMLElement>("[data-problem-lead]");
      const earlier = root.querySelector<HTMLElement>("[data-problem-earlier]");
      const today = root.querySelector<HTMLElement>("[data-problem-today]");
      const earlierItems = root.querySelectorAll<HTMLElement>(
        "[data-problem-earlier] li",
      );
      const todayItems = root.querySelectorAll<HTMLElement>(
        "[data-problem-today] [data-problem-chip]",
      );

      gsap.set(lead, { opacity: 0, y: 28 });
      if (earlier) gsap.set(earlier, { opacity: 0, x: -48, y: 24 });
      if (today) gsap.set(today, { opacity: 0, x: 48, y: 24 });
      if (earlierItems.length) gsap.set(earlierItems, { opacity: 0, x: -16 });
      if (todayItems.length) gsap.set(todayItems, { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "asg-problem",
          trigger: root,
          start: "top 78%",
          end: "top 32%",
          // Scrub a little so it ties to scroll, but short range → feels snappy
          scrub: 0.45,
        },
      });

      tl.to(
        lead,
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "none" },
        0,
      )
        .to(
          earlier,
          { opacity: 1, x: 0, y: 0, duration: 0.4, ease: "none" },
          0.12,
        )
        .to(
          today,
          { opacity: 1, x: 0, y: 0, duration: 0.4, ease: "none" },
          0.18,
        )
        .to(
          earlierItems,
          { opacity: 1, x: 0, duration: 0.35, stagger: 0.04, ease: "none" },
          0.28,
        )
        .to(
          todayItems,
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "none" },
          0.32,
        );

      // Soft exit when leaving upward/downward — clearer fade
      const exit = ScrollTrigger.create({
        id: "asg-problem-exit",
        trigger: root,
        start: "top 15%",
        end: "bottom 10%",
        onLeave: () => {
          gsap.to(root, {
            opacity: 0.55,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
        onEnterBack: () => {
          gsap.to(root, {
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
        onLeaveBack: () => {
          gsap.to(root, {
            opacity: 0.7,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
        onEnter: () => {
          gsap.to(root, {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        },
      });

      killScroll = () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        exit.kill();
        gsap.set(
          [root, ...lead, earlier, today, ...earlierItems, ...todayItems].filter(
            Boolean,
          ),
          { clearProps: "all" },
        );
      };
    })();

    return () => {
      cancelled = true;
      killScroll?.();
    };
  }, []);

  return (
    <div ref={rootRef} className="problem-motion">
      {children}
    </div>
  );
}
