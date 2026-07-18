import type { Metadata } from "next";
import { site } from "../../../content/site";
import { UtilityPage } from "@/components/UtilityPage";

export const metadata: Metadata = {
  title: "Request demo",
  description: `Request a demo of ${site.productName} for mould setup and live outline tracking.`,
};

export default function DemoPage() {
  return (
    <UtilityPage title="Request a demo" eyebrow="Demo">
      <p>
        Interested in {site.productName} for industrial mould setup and live AR
        outline tracking? Reach out and we will schedule a walkthrough of{" "}
        <span className="font-mono text-ink">Load · track</span>,{" "}
        <span className="font-mono text-ink">Build · PnP</span>, and{" "}
        <span className="font-mono text-ink">Build · CMM</span>.
      </p>

      <p className="rounded-sm border border-[var(--border)] bg-panel/50 px-5 py-4 text-sm">
        A hosted form lands in a follow-on PR. For now, contact the product team
        via your existing Anaglyph channel, or use{" "}
        <a
          href="mailto:demo@example.com?subject=Anaglyph%20Studio%20(G)%20demo"
          className="text-accent underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          demo@example.com
        </a>{" "}
        as a placeholder address (replace before public launch).
      </p>

      <section aria-labelledby="demo-topics">
        <h2
          id="demo-topics"
          className="font-display text-xl font-semibold text-ink"
        >
          What we typically cover
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>Case setup, tags, and outline import</li>
          <li>Camera K: Load / Measure / scene-embedded</li>
          <li>Photo PnP vs CMM CSV build paths</li>
          <li>Live track with outline lock and error readout (px / approx mm)</li>
        </ul>
      </section>
    </UtilityPage>
  );
}
