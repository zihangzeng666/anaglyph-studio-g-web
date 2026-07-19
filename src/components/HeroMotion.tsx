"use client";

import { useEffect, useRef } from "react";
import { getPrefersReducedMotion } from "@/lib/motion";

/**
 * Hero entrance — one orchestrated pass, then still:
 * copy rises → registration brackets snap onto OUTLINE → LOCKED reads out.
 * Reduced motion (or no JS): everything renders in its final state.
 */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || getPrefersReducedMotion()) return;

    let killed = false;

    void (async () => {
      const { gsap } = await import("gsap");
      if (killed || !root) return;

      const items = root.querySelectorAll<HTMLElement>(
        "[data-hero-item], [data-hero-motif]",
      );
      const brackets = root.querySelectorAll<HTMLElement>(
        "[data-hero-bracket]",
      );
      const locked = root.querySelectorAll<HTMLElement>("[data-hero-locked]");

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.fromTo(
        items,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
          clearProps: "transform",
        },
      )
        .fromTo(
          brackets,
          { opacity: 0, scale: 1.6 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.45,
            stagger: 0.05,
            ease: "power3.out",
            clearProps: "transform",
          },
          "-=0.25",
        )
        .fromTo(
          locked,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.35, clearProps: "transform" },
          "-=0.1",
        );
    })();

    return () => {
      killed = true;
    };
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}
