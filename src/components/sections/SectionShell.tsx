import { sectionFigure } from "../../../content/site";

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
 * Shared section chrome in the drafting language: each section is a numbered
 * figure — "FIG. 03 · THREE PATHS" with a hairline rule — plus display title.
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
  const fig = sectionFigure(id);

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
          <header className="mb-10">
            {eyebrow ? (
              <p className="mb-4 flex items-baseline gap-4 font-mono text-xs tracking-[0.22em] uppercase">
                <span className="shrink-0 text-accent">
                  {fig ? `Fig. ${fig}` : null}
                </span>
                <span className="shrink-0 text-muted">{eyebrow}</span>
                <span
                  aria-hidden
                  className="h-px flex-1 translate-y-[-0.2em] bg-[var(--border)]"
                />
              </p>
            ) : null}
            {title ? (
              <h2
                id={headingId}
                className="max-w-3xl font-display text-3xl font-bold tracking-tight text-ink md:text-4xl"
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
