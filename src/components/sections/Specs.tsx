import { site } from "../../../content/site";
import { SectionShell } from "./SectionShell";

/**
 * Specs — qualitative / product-true grid from content/site.ts.
 * PR7 polishes copy; structure and data are live now.
 */
export function Specs() {
  return (
    <SectionShell id="specs" eyebrow="Specs" title="Stack & capabilities">
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted">
        Product-true rows only — no invented tolerances. Sizes re-measured per
        release package.
      </p>

      <dl className="grid gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
        {site.specs.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-1 bg-panel px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
          >
            <dt className="shrink-0 font-mono text-xs tracking-[0.14em] text-accent uppercase">
              {row.label}
            </dt>
            <dd className="text-sm leading-snug text-ink sm:text-right">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
