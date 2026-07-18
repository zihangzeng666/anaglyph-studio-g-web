type BrandMarkProps = {
  className?: string;
};

/**
 * Wordmark for Anaglyph Studio (G).
 * Product name is always "Anaglyph Studio (G)" — never "Grok".
 */
export function BrandMark({ className }: BrandMarkProps) {
  const classes = ["flex flex-col gap-0.5", className].filter(Boolean).join(" ");

  return (
    <div className={classes} aria-label="Anaglyph Studio (G)">
      <span className="font-display text-sm font-semibold tracking-[0.28em] text-ink uppercase">
        ANAGLYPH
      </span>
      <span className="font-mono text-xs tracking-wide text-accent">
        Studio (G)
      </span>
    </div>
  );
}
