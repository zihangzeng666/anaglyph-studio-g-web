type SectionShellProps = {
  id: string;
  eyebrow?: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
  as?: "section" | "footer";
  "aria-labelledby"?: string;
};

/**
 * Shared section chrome: graphite panel rhythm, optional mono eyebrow + display title.
 * Fully static — no motion required to read content.
 */
export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  className = "",
  as: Tag = "section",
  "aria-labelledby": ariaLabelledBy,
}: SectionShellProps) {
  const headingId = title ? `${id}-heading` : undefined;

  return (
    <Tag
      id={id}
      aria-labelledby={ariaLabelledBy ?? headingId}
      className={[
        "scroll-mt-20 border-t border-[var(--border)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {(eyebrow || title) && (
          <header className="mb-10 max-w-3xl">
            {eyebrow ? (
              <p className="mb-3 font-mono text-xs tracking-[0.22em] text-accent uppercase">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2
                id={headingId}
                className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl"
              >
                {title}
              </h2>
            ) : null}
          </header>
        )}
        {children}
      </div>
    </Tag>
  );
}
