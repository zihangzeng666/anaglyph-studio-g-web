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
      <p>
        If analytics are enabled in a later release, they will be configured for
        privacy-friendly measurement (e.g. Plausible or a reviewed GA4 setup)
        without a cookie wall where possible. Download packages are hosted
        externally; their privacy practices are governed by the host.
      </p>
      <p>
        Demo requests (when the form ships) collect only the information you
        submit, used to respond to your inquiry. Placeholder contact addresses
        on this site must be replaced before public launch.
      </p>
      <p className="font-mono text-xs text-muted">
        Draft notice — legal review required before production.
      </p>
    </UtilityPage>
  );
}
