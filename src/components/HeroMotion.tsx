"use client";

import { useEffect, useRef } from "react";
import { getPrefersReducedMotion } from "@/lib/motion";

/**
 * Hero entrance — one quiet fade-up. No looping pulses.
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

      const targets = root.querySelectorAll<HTMLElement>(
        "[data-hero-item], [data-hero-motif]",
      );
      gsap.fromTo(
        targets,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.07,
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
