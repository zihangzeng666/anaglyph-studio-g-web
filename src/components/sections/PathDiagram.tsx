"use client";

import { useCallback, useId, useState } from "react";
import { workflows } from "../../../content/site";
import type { WorkflowId } from "../../../content/types";

/**
 * Interactive path diagram: Load · track / Build · PnP / Build · CMM.
 * SWAP PATH cycles highlight; keyboard accessible. Static SVG remains readable
 * without JS. Scroll-to-chapter hooks are stubs until the motion PR.
 */

const WORKFLOW_ORDER: WorkflowId[] = ["load-track", "build-pnp", "build-cmm"];

/** Stub for PR5 — chapter controller can wire scroll-to-workflow later. */
export function scrollToWorkflow(id: WorkflowId): void {
  void id;
  // no-op until GSAP chapter controller lands
}

function stepsForWorkflow(wf: (typeof workflows)[number]): string[] {
  if (wf.id === "load-track") {
    return ["Camera", "Calibrate?", "Track"];
  }
  return wf.steps;
}

export function PathDiagram() {
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeId = WORKFLOW_ORDER[activeIndex] ?? "load-track";

  const cycle = useCallback((delta: number) => {
    setActiveIndex((i) => {
      const next = (i + delta + WORKFLOW_ORDER.length) % WORKFLOW_ORDER.length;
      scrollToWorkflow(WORKFLOW_ORDER[next]!);
      return next;
    });
  }, []);

  const select = useCallback((id: WorkflowId) => {
    const idx = WORKFLOW_ORDER.indexOf(id);
    if (idx >= 0) {
      setActiveIndex(idx);
      scrollToWorkflow(id);
    }
  }, []);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        cycle(1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        cycle(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        select("load-track");
      } else if (e.key === "End") {
        e.preventDefault();
        select("build-cmm");
      }
    },
    [cycle, select],
  );

  const titleId = `${baseId}-title`;
  const descId = `${baseId}-desc`;
  const liveId = `${baseId}-live`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={liveId} className="font-mono text-xs text-muted" aria-live="polite">
          Active path:{" "}
          <span className="text-accent">
            {workflows.find((w) => w.id === activeId)?.label ?? activeId}
          </span>
        </p>
        <button
          type="button"
          onClick={() => cycle(1)}
          onKeyDown={onKeyDown}
          className="inline-flex items-center gap-2 rounded-sm border border-accent/40 bg-frame px-4 py-2 font-mono text-xs tracking-[0.14em] text-accent uppercase transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          aria-controls={liveId}
          aria-label="Swap path — cycle through Load track, Build PnP, and Build CMM"
        >
          Swap path
          <span aria-hidden className="text-muted">
            ↻
          </span>
        </button>
      </div>

      {/* Workflow tablist for keyboard / screen-reader selection */}
      <div
        role="tablist"
        aria-label="Studio G workflows"
        className="flex flex-wrap gap-2"
        onKeyDown={onKeyDown}
      >
        {workflows.map((wf, i) => {
          const selected = wf.id === activeId;
          return (
            <button
              key={wf.id}
              type="button"
              role="tab"
              id={`${baseId}-tab-${wf.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${wf.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(wf.id)}
              className={[
                "rounded-sm border px-3 py-1.5 font-mono text-xs tracking-wide transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                selected
                  ? "border-accent bg-accent/15 text-accent"
                  : "border-[var(--border)] bg-panel/40 text-muted hover:border-accent/40 hover:text-accent",
              ].join(" ")}
            >
              <span className="text-accent/70">{String(i + 1).padStart(2, "0")}</span>{" "}
              {wf.label}
            </button>
          );
        })}
      </div>

      <div
        className="overflow-x-auto rounded-sm border border-[var(--border)] bg-panel/50 p-4 md:p-6"
        role="tabpanel"
        id={`${baseId}-panel-${activeId}`}
        aria-labelledby={`${baseId}-tab-${activeId}`}
      >
        <svg
          viewBox="0 0 720 280"
          className="mx-auto h-auto w-full min-w-[36rem] max-w-4xl text-ink"
          role="img"
          aria-labelledby={`${titleId} ${descId}`}
        >
          <title id={titleId}>Studio G workflow paths diagram</title>
          <desc id={descId}>
            Three workflows from Home: Load track with optional Calibrate; Build
            PnP through Capture and Scene; Build CMM through Scene without
            Capture. Active path is highlighted.
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

          {workflows.map((wf, row) => {
            const y = row === 0 ? 52 : row === 1 ? 118 : 192;
            const steps = stepsForWorkflow(wf);
            const startX = 168;
            const gap = 88;
            const active = wf.id === activeId;
            const strokeAccent = active
              ? "var(--accent)"
              : "color-mix(in srgb, var(--border) 100%, transparent)";
            const lineStroke = active
              ? "color-mix(in srgb, var(--accent) 70%, transparent)"
              : "color-mix(in srgb, var(--muted) 35%, transparent)";
            const labelFill = active ? "var(--accent)" : "var(--muted)";

            return (
              <g
                key={wf.id}
                opacity={active ? 1 : 0.42}
                style={{ transition: "opacity 0.2s ease" }}
              >
                <text
                  x={startX}
                  y={y - 14}
                  fill={labelFill}
                  fontFamily="ui-monospace, monospace"
                  fontSize="10"
                  letterSpacing="0.06em"
                >
                  {wf.label}
                  {active ? " · active" : ""}
                </text>
                {steps.map((step, i) => {
                  const x = startX + i * gap;
                  const optional =
                    step.endsWith("?") ||
                    (wf.optionalSteps?.includes(step.replace("?", "")) ?? false);
                  const label = step.replace("?", "");
                  return (
                    <g key={`${wf.id}-${step}-${i}`}>
                      {i > 0 ? (
                        <line
                          x1={x - gap + 64}
                          y1={y + 14}
                          x2={x}
                          y2={y + 14}
                          stroke={lineStroke}
                          strokeWidth={active ? 1.5 : 1}
                          strokeDasharray={optional ? "3 3" : undefined}
                        />
                      ) : null}
                      <rect
                        x={x}
                        y={y}
                        width="64"
                        height="28"
                        rx="2"
                        fill={
                          active
                            ? "color-mix(in srgb, var(--accent) 12%, var(--bg))"
                            : "var(--bg)"
                        }
                        stroke={
                          optional
                            ? "color-mix(in srgb, var(--accent) 55%, transparent)"
                            : strokeAccent
                        }
                        strokeWidth={active ? 1.5 : 1}
                        strokeDasharray={optional ? "4 3" : undefined}
                      />
                      <text
                        x={x + 32}
                        y={y + 18}
                        textAnchor="middle"
                        fill={
                          optional
                            ? "var(--muted)"
                            : active
                              ? "var(--text)"
                              : "color-mix(in srgb, var(--text) 70%, transparent)"
                        }
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
            * Calibrate optional on Load · track (dashed)
          </text>
        </svg>
      </div>
    </div>
  );
}
