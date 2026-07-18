import type { Metadata } from "next";
import { BrandMark } from "@/components/BrandMark";
import "./globals.css";

export const metadata: Metadata = {
  title: "Anaglyph Studio (G)",
  description:
    "Windows desktop console for industrial mould setup and live AR outline tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-ink antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <header className="border-b border-[var(--border)] bg-panel/80">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <BrandMark />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
