import type { Metadata } from "next";
import { site } from "../../../../content/site";
import { UtilityPage } from "@/components/UtilityPage";

export const metadata: Metadata = {
  title: "Terms",
  description: `Terms of use for the ${site.productName} marketing site and software packages.`,
};

export default function TermsPage() {
  return (
    <UtilityPage title="Terms of use" eyebrow="Legal">
      <p>
        Content on this site describes {site.productName} ({site.shortName}) for
        informational purposes. Product capabilities are those implemented in
        the software; marketing claims are backed by a claim registry and must
        not be read as certified metrology guarantees.
      </p>
      <p>
        Runtime and source packages are proprietary. Redistribution, reverse
        engineering restrictions, and license terms ship with each package or a
        separate commercial agreement. This page is not a substitute for those
        terms.
      </p>
      <p>
        The product name is {site.productName} / {site.shortName} only. Do not
        brand or describe the product as “Grok.”
      </p>
      <p>
        Interaction patterns on this marketing site may be inspired by public
        craft references; no third-party models, copy, or trademarks are used.
      </p>
      <p className="font-mono text-xs text-muted">
        Draft notice — legal review required before production. See{" "}
        <span className="text-ink">docs/DEPLOY.md</span> for the soft-launch
        checklist.
      </p>
    </UtilityPage>
  );
}
