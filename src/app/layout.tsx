import type { Metadata } from "next";
import Link from "next/link";
import localFont from "next/font/local";
import { BrandMark } from "@/components/BrandMark";
import { isRuntimeDownloadPublic } from "../../content/downloads";
import { site } from "../../content/site";
import "./globals.css";

/* Brand faces, self-hosted (latin subsets, ~132 KB total).
   Archivo carries both roles: width 100% for text, expanded for display. */
const archivo = localFont({
  src: "../fonts/archivo-var.woff2",
  weight: "100 900",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "../fonts/plex-mono-400.woff2", weight: "400" },
    { path: "../fonts/plex-mono-500.woff2", weight: "500" },
    { path: "../fonts/plex-mono-600.woff2", weight: "600" },
  ],
  variable: "--font-plex",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: site.productName,
    template: `%s · ${site.productName}`,
  },
  description: site.lead,
  applicationName: site.productName,
  keywords: [
    "Anaglyph Studio",
    "Studio G",
    "mould tracking",
    "AprilTag",
    "PnP",
    "CMM",
    "industrial AR",
    "Windows",
  ],
  authors: [{ name: site.productName }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: site.productName,
    title: `${site.productName} — ${site.tagline}`,
    description: site.lead,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.productName} — ${site.tagline}`,
    description: site.lead,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const NAV = [
  { href: "/#paths", label: "Paths" },
  { href: "/#pipeline", label: "Pipeline" },
  ...(isRuntimeDownloadPublic()
    ? ([{ href: "/download", label: "Download" }] as const)
    : []),
  { href: "/source", label: "Source" },
  { href: "/demo", label: "Demo" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="min-h-screen bg-bg text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-panel/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
            <Link
              href="/"
              className="rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <BrandMark />
            </Link>
            <nav aria-label="Primary">
              <ul className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 md:gap-x-5">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-mono text-xs tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
