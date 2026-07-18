import { workflows } from "../../../content/site";
import { PathDiagram } from "./PathDiagram";
import { SectionShell } from "./SectionShell";

/**
 * Paths — interactive SVG for Load · track / Build · PnP / Build · CMM.
 * SWAP PATH + keyboard tabs live in PathDiagram (client island).
 * Calibrate is optional/dashed on Load · track.
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
        optional (dashed). Use{" "}
        <span className="font-mono text-ink">SWAP PATH</span> or the workflow
        tabs — arrow keys cycle when a tab is focused.
      </p>

      <div className="mb-10">
        <PathDiagram />
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
