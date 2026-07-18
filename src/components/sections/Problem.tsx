import { getClaim } from "../../../content/claims";
import { SectionShell } from "./SectionShell";

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
 * Problem — CLI chain vs one integrated Studio strip.
 */
export function Problem() {
  const claim = getClaim("integrated-studio");

  return (
    <SectionShell
      id="problem"
      eyebrow="Before / after"
      title="One console instead of a script chain"
    >
      <p className="view-reveal mb-10 max-w-2xl text-base leading-relaxed text-muted">
        {claim?.statement ??
          "One integrated Studio instead of a chain of CLI tools."}
      </p>

      <div className="view-reveal view-reveal-delay-1 grid gap-6 lg:grid-cols-2">
        <article className="rounded-sm border border-[var(--border)] bg-panel/50 p-6">
          <h3 className="mb-4 font-mono text-xs tracking-[0.18em] text-muted uppercase">
            Before — numbered CLI scripts
          </h3>
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

        <article className="rounded-sm border border-accent/25 bg-frame/60 p-6 shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_8%,transparent)]">
          <h3 className="mb-4 font-mono text-xs tracking-[0.18em] text-accent uppercase">
            After — Studio G step strip
          </h3>
          <div
            className="flex flex-wrap gap-2"
            role="list"
            aria-label="Studio workflow steps"
          >
            {STUDIO_STEPS.map((step, i) => (
              <div
                key={step}
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
            Home cards pick{" "}
            <span className="font-mono text-ink">Load · track</span>,{" "}
            <span className="font-mono text-ink">Build · PnP</span>, or{" "}
            <span className="font-mono text-ink">Build · CMM</span> — readiness
            gates replace hand-ordered batch scripts.
          </p>
        </article>
      </div>
    </SectionShell>
  );
}
