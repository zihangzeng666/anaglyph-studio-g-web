import { getClaim } from "../../../content/claims";
import { TagMark } from "@/components/TagMark";
import { SectionShell } from "./SectionShell";

/**
 * Printables — AprilTag sheets + ChArUco board (claim-safe).
 * Actual-size print so physical markers match the case definition.
 */
export function Printables() {
  const print = getClaim("print-tags-actual-size");
  const dict = getClaim("apriltag-dict");
  const measure = getClaim("measure-k");

  const cards = [
    {
      title: "AprilTag sticker sheets",
      seed: 3,
      body:
        print?.statement ??
        "Print-ready AprilTag sticker sheets at actual size.",
      meta: dict?.statement ?? "Dictionary support (e.g. 36h11 in demos).",
      steps: [
        "Export sheet from Studio G / tags tools",
        "Print 100% scale (no fit-to-page)",
        "Apply tags to mould per case definition (id + size_mm)",
      ],
    },
    {
      title: "ChArUco calibration board",
      seed: 17,
      body:
        measure?.statement ??
        "Measure K — ChArUco board calibration for real camera intrinsics.",
      meta: "Print at actual size so physical markers match the board geometry used by Measure K.",
      steps: [
        "Print board at actual size",
        "Open Calibrate → Measure K",
        "Capture views until K converges — then Load K on Track",
      ],
    },
  ];

  return (
    <SectionShell
      id="printables"
      eyebrow="Print & calibrate"
      title="Markers you can print"
    >
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted">
        Sheets leave the Studio print-ready for the shop floor — actual size,
        never fit-to-page. The tag on the mould has to measure what the case{" "}
        <span className="font-mono text-ink">size_mm</span> says it does, or
        PnP and the live lock will quietly disagree.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <article
            key={card.title}
            className="flex flex-col rounded-sm border border-[var(--border)] bg-panel/50 p-6"
          >
            <div
              className="mb-5 flex h-28 items-center justify-center rounded-sm border border-dashed border-accent/25 bg-bg/60 text-accent/70"
              aria-hidden
            >
              <TagMark size={76} seed={card.seed} />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-ink/70">
              {card.meta}
            </p>
            <ol className="mt-5 space-y-1.5 border-t border-[var(--border)] pt-4 font-mono text-[11px] text-muted">
              {card.steps.map((step, i) => (
                <li key={step} className="flex gap-2">
                  <span className="text-accent/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
