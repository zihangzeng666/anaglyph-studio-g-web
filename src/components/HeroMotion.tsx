"use client";

import { useEffect, useRef } from "react";
import { getPrefersReducedMotion } from "@/lib/motion";

/**
 * Hero entrance — simple fade-up of copy blocks.
 * Reduced motion: final state, no animation.
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

      const items = root.querySelectorAll<HTMLElement>("[data-hero-item]");
      gsap.fromTo(
        items,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "transform",
        },
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
