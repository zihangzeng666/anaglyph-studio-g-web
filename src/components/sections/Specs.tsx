import { site } from "../../../content/site";
import { SectionShell } from "./SectionShell";

/**
 * Specs — qualitative / product-true grid from content/site.ts.
 * No invented tolerances; sizes re-measured per release package.
 */
export function Specs() {
  return (
    <SectionShell id="specs" eyebrow="Specs" title="Stack & capabilities">
      <p className="view-reveal mb-4 max-w-2xl text-base leading-relaxed text-muted">
        Every row below is product-true — nothing rounded up, no invented
        tolerances. Package sizes are measured from the actual zips, release by
        release.
      </p>
      <p className="view-reveal view-reveal-delay-1 mb-8 max-w-2xl text-sm leading-relaxed text-muted">
        Under the panel: OpenCV 4.11, printable AprilTags, and ChArUco for real
        camera K. Build from photo PnP or CMM CSV corners — or load a scene —
        then track with reprojection error in pixels, approx mm at depth if you
        ask for it.
      </p>

      <dl className="view-reveal view-reveal-delay-2 grid gap-px overflow-hidden rounded-sm border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
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

      <aside className="mt-6 rounded-sm border border-[var(--border)] bg-frame/40 px-5 py-4 text-sm text-muted">
        <p className="font-mono text-[11px] tracking-[0.14em] text-accent uppercase">
          Calibration note
        </p>
        <p className="mt-2 leading-relaxed">
          Real intrinsics come from Load K or Measure K; a saved scene can
          carry its own. The FOV guess is exactly what it sounds like — a
          placeholder, never a calibration.
        </p>
      </aside>
    </SectionShell>
  );
}
