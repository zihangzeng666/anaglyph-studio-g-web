type BrandMarkProps = {
  className?: string;
};

/**
 * Wordmark for Anaglyph Studio (G).
 * Product name is always "Anaglyph Studio (G)" — never "Grok".
 */
export function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <div
      className={`flex flex-col gap-0.5 ${className}`}
      aria-label="Anaglyph Studio (G)"
    >
      <span className="font-display text-sm font-semibold tracking-[0.28em] text-ink uppercase">
        ANAGLYPH
      </span>
      <span className="font-mono text-xs tracking-wide text-accent">
        Studio (G)
      </span>
    </div>
  );
}
