import type { Metadata } from "next";
import { site } from "../../../content/site";
import { DemoForm } from "@/components/DemoForm";
import { UtilityPage } from "@/components/UtilityPage";

export const metadata: Metadata = {
  title: "Request demo",
  description: `Request a demo of ${site.productName} for mould setup and live outline tracking.`,
};

const demoInboxConfigured = Boolean(
  process.env.NEXT_PUBLIC_DEMO_MAILTO || process.env.NEXT_PUBLIC_FORMSPREE_ID,
);

export default function DemoPage() {
  return (
    <UtilityPage title="Request a demo" eyebrow="Demo">
      <p>
        Tell us a little about your setup — the moulds, the cameras, what you
        need to see — and we’ll walk{" "}
        <span className="font-mono text-ink">Load · track</span>,{" "}
        <span className="font-mono text-ink">Build · PnP</span>, and{" "}
        <span className="font-mono text-ink">Build · CMM</span> with{" "}
        {site.shortName} on screen.
      </p>

      <DemoForm />

      <p className="text-sm text-muted">
        We use what you send only to reply — see{" "}
        <a
          href="/legal/privacy"
          className="text-accent underline-offset-2 hover:underline"
        >
          Privacy
        </a>
        .
      </p>

      {!demoInboxConfigured ? (
        <p className="rounded-sm border border-dashed border-[var(--border)] px-4 py-3 font-mono text-[11px] leading-relaxed text-muted">
          site note · demo inbox not configured — set NEXT_PUBLIC_DEMO_MAILTO
          or NEXT_PUBLIC_FORMSPREE_ID before public launch
        </p>
      ) : null}

      <section aria-labelledby="demo-topics">
        <h2
          id="demo-topics"
          className="font-display text-xl font-semibold text-ink"
        >
          What a walkthrough covers
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>Case setup — tags, outline import, landmarks or CMM CSV</li>
          <li>Camera K — Load, Measure, or scene-embedded</li>
          <li>The two build paths, photo PnP and CMM corners, side by side</li>
          <li>Live track — outline lock and the error readout (px, approx mm)</li>
        </ul>
      </section>
    </UtilityPage>
  );
}
