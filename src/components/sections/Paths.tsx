"use client";

import { workflows } from "../../../content/site";
import { PathDiagram, scrollToWorkflow, scrollToWorkflowStep } from "./PathDiagram";
import { SectionShell } from "./SectionShell";
import type { WorkflowId } from "../../../content/types";
import { stepToChapter, workflowEntryChapter } from "@/lib/workflowLinks";

/**
 * Paths — three product workflows. Each step links to the matching pipeline
 * chapter; the card CTA opens the path’s entry chapter (not a random jump).
 */
export function Paths() {
  return (
    <SectionShell
      id="paths"
      eyebrow="Three paths"
      title="Same labels as Studio G. Different ways into Track."
    >
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted">
        Live outline lock is the product end-state. How you get a scene is
        your choice:{" "}
        <span className="font-mono text-ink">Load · track</span> opens a scene
        you already trust;{" "}
        <span className="font-mono text-ink">Build · PnP</span> builds it from
        multi-view photos;{" "}
        <span className="font-mono text-ink">Build · CMM</span> builds it from
        measured tag corners (no photo capture). Click a{" "}
        <strong className="font-medium text-ink">step</strong> to open that
        chapter in the pipeline; use{" "}
        <span className="font-mono text-ink">Open path</span> for the path’s
        entry point.
      </p>

      <div className="mb-10">
        <PathDiagram />
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {workflows.map((wf) => {
          const entry = workflowEntryChapter(wf.id as WorkflowId);
          const stepList =
            wf.id === "load-track"
              ? (["Camera", "Calibrate?", "Track"] as const)
              : wf.steps;

          return (
            <li key={wf.id}>
              <article
                id={`path-${wf.id}`}
                className="flex h-full flex-col rounded-sm border border-[var(--border)] bg-panel/40 p-5 transition-colors hover:border-accent/30"
              >
                <h3 className="font-mono text-sm tracking-wide text-accent">
                  {wf.label}
                </h3>
                <p className="mt-2 text-sm text-muted">{wf.sceneSource}</p>
                <ol className="mt-4 space-y-1.5 font-mono text-xs text-ink/90">
                  {stepList.map((step) => {
                    const label = step.replace("?", "");
                    const optional = step.endsWith("?");
                    const chapter = stepToChapter(label);
                    return (
                      <li key={step}>
                        <button
                          type="button"
                          onClick={() => scrollToWorkflowStep(label)}
                          className={[
                            "group flex w-full items-baseline gap-2 rounded-sm px-1 py-0.5 text-left transition-colors",
                            "hover:bg-frame/60 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                            optional ? "text-muted" : "",
                          ].join(" ")}
                          title={`Open pipeline · ${chapter}`}
                        >
                          <span className="text-accent/70 group-hover:text-accent">
                            →
                          </span>
                          <span>
                            {label}
                            {optional ? (
                              <span className="text-muted"> (optional)</span>
                            ) : null}
                          </span>
                          <span className="ml-auto font-mono text-[10px] tracking-wide text-muted opacity-0 transition-opacity group-hover:opacity-100">
                            #{chapter}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
                <button
                  type="button"
                  onClick={() => scrollToWorkflow(wf.id as WorkflowId)}
                  className="mt-5 inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-bg/50 px-3 py-2 font-mono text-[11px] tracking-wide text-ink transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  Open path → #{entry}
                </button>
              </article>
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}
