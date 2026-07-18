import { getClaim } from "../../../content/claims";
import { ProblemMotion } from "@/components/ProblemMotion";
import { SectionShell } from "./SectionShell";

/** Early pipeline form — same product lineage, modular entry points. */
const CLI_STEPS = [
  "0_Load_Bicycle_Example",
  "1_Calibrate_Camera",
  "2_Preview_Landmarks_3D",
  "3_Run_PnP_Solver",
  "4_View_PnP_Result_3D",
  "5_Live_AR",
  "6_Archive_Report_CSV",
];

const STUDIO_STEPS = [
  "Setup",
  "Camera",
  "Calibrate",
  "Capture",
  "Scene",
  "Track",
];

/**
 * Evolution — same algorithms & pipeline, from modular CLI form to Studio G UI.
 * Scroll animation via ProblemMotion (slide + fade, no zoom).
 */
export function Problem() {
  const claim = getClaim("integrated-studio");

  return (
    <SectionShell
      id="problem"
      eyebrow="Same pipeline · new shell"
      title="One Studio for the steps you already know"
    >
      <ProblemMotion>
        <p
          data-problem-lead
          className="mb-4 max-w-2xl text-base leading-relaxed text-muted"
        >
          {claim?.statement ??
            "Studio G guides the same calibration, solve, and live-tracking pipeline in one window — the steps that used to ship as modular CLIs and numbered scripts."}
        </p>
        <p
          data-problem-lead
          className="mb-10 max-w-2xl text-sm leading-relaxed text-muted"
        >
          PnP, CMM corners, and live outline lock are the same product stack —
          not a hand-off from someone else’s tools. The change is{" "}
          <span className="text-ink">how you drive them</span>: one console,
          path cards, and readiness gates instead of ordering batch scripts
          yourself.
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <article
            data-problem-earlier
            className="rounded-sm border border-[var(--border)] bg-panel/50 p-6 will-change-transform"
          >
            <h3 className="mb-1 font-mono text-xs tracking-[0.18em] text-muted uppercase">
              Earlier form
            </h3>
            <p className="mb-4 text-sm text-muted">
              Modular CLIs + numbered scripts — same pipeline, operator-ordered.
            </p>
            <ol className="space-y-2 font-mono text-sm text-muted">
              {CLI_STEPS.map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="shrink-0 text-accent/70">
                    {String(i).padStart(2, "0")}
                  </span>
                  <span className="break-all">{step}</span>
                </li>
              ))}
            </ol>
          </article>

          <article
            data-problem-today
            className="rounded-sm border border-accent/25 bg-frame/60 p-6 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_8%,transparent)] will-change-transform"
          >
            <h3 className="mb-1 font-mono text-xs tracking-[0.18em] text-accent uppercase">
              Studio G today
            </h3>
            <p className="mb-4 text-sm text-muted">
              One window — Home path cards and a guided step strip.
            </p>
            <div
              className="flex flex-wrap gap-2"
              role="list"
              aria-label="Studio workflow steps"
            >
              {STUDIO_STEPS.map((step, i) => (
                <div
                  key={step}
                  data-problem-chip
                  role="listitem"
                  className="flex items-center gap-2 rounded-sm border border-[var(--border)] bg-bg/60 px-3 py-2 font-mono text-xs text-ink"
                >
                  <span className="text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {step}
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-muted">
              On Home, pick{" "}
              <span className="font-mono text-ink">Load · track</span>,{" "}
              <span className="font-mono text-ink">Build · PnP</span>, or{" "}
              <span className="font-mono text-ink">Build · CMM</span>. Readiness
              gates sequence those same steps so you stay on the path without
              hand-ordering the old script list.
            </p>
          </article>
        </div>
      </ProblemMotion>
    </SectionShell>
  );
}
