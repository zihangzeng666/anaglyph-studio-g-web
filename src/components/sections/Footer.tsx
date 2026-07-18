import Link from "next/link";
import { site } from "../../../content/site";
import { BrandMark } from "@/components/BrandMark";
import { SectionShell } from "./SectionShell";

const FOOTER_LINKS = [
  { href: "/download", label: "Download" },
  { href: "/source", label: "Source" },
  { href: "/demo", label: "Demo" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
];

/**
 * Footer — brand, utility links, product naming rule.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <SectionShell
      id="footer"
      as="footer"
      className="border-t border-[var(--border)] bg-panel/40"
      aria-labelledby="footer-heading"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 id="footer-heading" className="sr-only">
            Site footer
          </h2>
          <BrandMark />
          <p className="mt-4 max-w-sm text-sm text-muted">
            {site.productName} — Windows desktop console for industrial mould
            setup and live AR outline tracking.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-xs tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mt-12 border-t border-[var(--border)] pt-6 font-mono text-[11px] text-muted">
        © {year} {site.productName}. All rights reserved. Product name is{" "}
        {site.productName} / {site.shortName} only. Windows 10/11 x64 · ready-to-run
        zip · SmartScreen may warn on unsigned builds.
      </p>
    </SectionShell>
  );
}
