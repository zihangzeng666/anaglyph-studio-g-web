import type { Metadata } from "next";
import { site } from "../../../../content/site";
import { UtilityPage } from "@/components/UtilityPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy notice for the ${site.productName} marketing site.`,
};

export default function PrivacyPage() {
  return (
    <UtilityPage title="Privacy" eyebrow="Legal">
      <p>
        This marketing site for {site.productName} is a static product surface.
        It does not require an account to browse.
      </p>

      <h2 className="font-display text-xl font-semibold text-ink">
        Analytics
      </h2>
      <p>
        Privacy-friendly measurement may be enabled (e.g. Plausible) without a
        cookie wall where possible. Event names such as{" "}
        <span className="font-mono text-ink">cta_click</span>,{" "}
        <span className="font-mono text-ink">chapter_view</span>,{" "}
        <span className="font-mono text-ink">scroll_depth</span>, and{" "}
        <span className="font-mono text-ink">demo_submit</span> are aggregated
        product metrics — not advertising profiles. When no analytics domain is
        configured, the site emits no third-party trackers (development may log
        events to the browser console only).
      </p>

      <h2 className="font-display text-xl font-semibold text-ink">
        Demo requests
      </h2>
      <p>
        The demo form collects only the information you submit (name, email,
        optional company, message) to respond to your inquiry. Mailto mode opens
        your local mail client; Formspree mode posts to Formspree under their
        terms when that integration is configured. Placeholder contact addresses
        must be replaced before public launch.
      </p>

      <h2 className="font-display text-xl font-semibold text-ink">
        Downloads
      </h2>
      <p>
        Runtime and source packages are hosted externally; their privacy
        practices are governed by the host. Checksums shown on this site help
        you verify package integrity after download.
      </p>

      <p className="font-mono text-xs text-muted">
        Draft notice — legal review required before production.
      </p>
    </UtilityPage>
  );
}
