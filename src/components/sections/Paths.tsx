import { workflows } from "../../../content/site";
import { SectionShell } from "./SectionShell";

/**
 * Paths — static SVG outline of Load · track / Build · PnP / Build · CMM.
 * Interactive SWAP + focus polish lands in PR4; this is fully readable now.
 */
export function Paths() {
  return (
    <SectionShell
      id="paths"
      eyebrow="Three paths"
      title="Pick a workflow. Follow the strip."
    >
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted">
        Product labels match Studio G exactly. On{" "}
        <span className="font-mono text-ink">Load · track</span>, Calibrate is
        optional (dashed). Interactive path highlighting ships next.
      </p>

      <div className="mb-10 overflow-x-auto rounded-sm border border-[var(--border)] bg-panel/50 p-4 md:p-6">
        <svg
          viewBox="0 0 720 280"
          className="mx-auto h-auto w-full min-w-[36rem] max-w-4xl text-ink"
          role="img"
          aria-labelledby="paths-diagram-title paths-diagram-desc"
        >
          <title id="paths-diagram-title">
            Studio G workflow paths diagram
          </title>
          <desc id="paths-diagram-desc">
            Three workflows from Home: Load track with optional Calibrate; Build
            PnP through Capture and Scene; Build CMM through Scene without
            Capture.
          </desc>

          {/* Home hub */}
          <rect
            x="16"
            y="118"
            width="72"
            height="36"
            rx="3"
            fill="var(--frame)"
            stroke="var(--accent)"
            strokeWidth="1.25"
          />
          <text
            x="52"
            y="140"
            textAnchor="middle"
            fill="var(--accent)"
            fontFamily="ui-monospace, monospace"
            fontSize="11"
          >
            Home
          </text>

          {/* Trunk lines */}
          <path
            d="M88 136 H120 M120 70 V210 M120 70 H160 M120 136 H160 M120 210 H160"
            stroke="color-mix(in srgb, var(--muted) 50%, transparent)"
            strokeWidth="1.25"
            fill="none"
          />

          {/* Row helpers */}
          {workflows.map((wf, row) => {
            const y = row === 0 ? 52 : row === 1 ? 118 : 192;
            const steps =
              wf.id === "load-track"
                ? ["Camera", "Calibrate?", "Track"]
                : wf.steps;
            const startX = 168;
            const gap = 88;

            return (
              <g key={wf.id}>
                <text
                  x={startX}
                  y={y - 14}
                  fill="var(--accent)"
                  fontFamily="ui-monospace, monospace"
                  fontSize="10"
                  letterSpacing="0.06em"
                >
                  {wf.label}
                </text>
                {steps.map((step, i) => {
                  const x = startX + i * gap;
                  const optional =
                    step.endsWith("?") ||
                    (wf.optionalSteps?.includes(step.replace("?", "")) ??
                      false);
                  const label = step.replace("?", "");
                  return (
                    <g key={`${wf.id}-${step}-${i}`}>
                      {i > 0 ? (
                        <line
                          x1={x - gap + 64}
                          y1={y + 14}
                          x2={x}
                          y2={y + 14}
                          stroke="color-mix(in srgb, var(--muted) 45%, transparent)"
                          strokeWidth="1"
                          strokeDasharray={optional ? "3 3" : undefined}
                        />
                      ) : null}
                      <rect
                        x={x}
                        y={y}
                        width="64"
                        height="28"
                        rx="2"
                        fill="var(--bg)"
                        stroke={
                          optional
                            ? "color-mix(in srgb, var(--accent) 45%, transparent)"
                            : "color-mix(in srgb, var(--border) 100%, transparent)"
                        }
                        strokeWidth="1"
                        strokeDasharray={optional ? "4 3" : undefined}
                      />
                      <text
                        x={x + 32}
                        y={y + 18}
                        textAnchor="middle"
                        fill={optional ? "var(--muted)" : "var(--text)"}
                        fontFamily="ui-monospace, monospace"
                        fontSize="9"
                      >
                        {label}
                        {optional ? "*" : ""}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          <text
            x="168"
            y="268"
            fill="var(--muted)"
            fontFamily="ui-monospace, monospace"
            fontSize="9"
          >
            * Calibrate optional on Load · track
          </text>
        </svg>
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {workflows.map((wf) => (
          <li
            key={wf.id}
            id={`path-${wf.id}`}
            className="rounded-sm border border-[var(--border)] bg-panel/40 p-5"
          >
            <h3 className="font-mono text-sm tracking-wide text-accent">
              {wf.label}
            </h3>
            <p className="mt-2 text-sm text-muted">{wf.sceneSource}</p>
            <ol className="mt-4 space-y-1.5 font-mono text-xs text-ink/90">
              {wf.id === "load-track" ? (
                <>
                  <li>
                    <span className="text-accent/70">→</span> Camera
                  </li>
                  <li className="text-muted">
                    <span className="text-accent/50">→</span> Calibrate{" "}
                    <span className="text-muted">(optional)</span>
                  </li>
                  <li>
                    <span className="text-accent/70">→</span> Track
                  </li>
                </>
              ) : (
                wf.steps.map((step) => (
                  <li key={step}>
                    <span className="text-accent/70">→</span> {step}
                  </li>
                ))
              )}
            </ol>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
