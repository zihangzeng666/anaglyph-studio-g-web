"use client";

import { workflows } from "../../../content/site";
import { PathDiagram, scrollToWorkflow } from "./PathDiagram";
import { SectionShell } from "./SectionShell";
import type { WorkflowId } from "../../../content/types";

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
        These are the same labels you’ll meet in Studio G — nothing renamed for
        marketing. Cycle with{" "}
        <span className="font-mono text-ink">Swap path</span> or the tabs
        (arrow keys work once a tab has focus); the dashed Calibrate node on{" "}
        <span className="font-mono text-ink">Load · track</span> means
        optional. Click a card to drop into that part of the pipeline.
      </p>

      <div className="mb-10">
        <PathDiagram />
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {workflows.map((wf) => (
          <li key={wf.id}>
            <button
              type="button"
              id={`path-${wf.id}`}
              onClick={() => scrollToWorkflow(wf.id as WorkflowId)}
              className="h-full w-full rounded-sm border border-[var(--border)] bg-panel/40 p-5 text-left transition-all duration-300 hover:border-accent/40 hover:bg-panel/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
            </button>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
