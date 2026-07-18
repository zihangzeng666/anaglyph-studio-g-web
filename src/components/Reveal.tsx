"use client";

import { useEffect, useRef } from "react";
import { getPrefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms when multiple reveals enter together */
  delayMs?: number;
  as?: "div" | "li" | "article";
};

/**
 * Lightweight enter animation via IntersectionObserver (no GSAP required).
 * Skips motion when prefers-reduced-motion is set.
 */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (getPrefersReducedMotion()) {
      el.classList.add("is-revealed");
      return;
    }

    el.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const node = entry.target as HTMLElement;
          if (delayMs > 0) {
            node.style.transitionDelay = `${delayMs}ms`;
          }
          node.classList.add("is-revealed");
          io.unobserve(node);
        }
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delayMs]);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={["reveal", className].filter(Boolean).join(" ")}
    >
      {children}
    </Tag>
  );
}
