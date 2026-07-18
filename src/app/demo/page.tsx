import type { Metadata } from "next";
import { site } from "../../../content/site";
import { DemoForm } from "@/components/DemoForm";
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
        outline tracking? Tell us about your setup — we will schedule a
        walkthrough of{" "}
        <span className="font-mono text-ink">Load · track</span>,{" "}
        <span className="font-mono text-ink">Build · PnP</span>, and{" "}
        <span className="font-mono text-ink">Build · CMM</span>.
      </p>

      <DemoForm />

      <p className="text-sm text-muted">
        Replace{" "}
        <span className="font-mono text-ink">NEXT_PUBLIC_DEMO_MAILTO</span> or
        set{" "}
        <span className="font-mono text-ink">NEXT_PUBLIC_FORMSPREE_ID</span>{" "}
        before public launch. We only use the details you submit to respond to
        your inquiry — see{" "}
        <a
          href="/legal/privacy"
          className="text-accent underline-offset-2 hover:underline"
        >
          Privacy
        </a>
        .
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
