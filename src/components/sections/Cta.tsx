import Link from "next/link";
import {
  downloads,
  isRuntimeDownloadPublic,
  publicDownloadHref,
} from "../../../content/downloads";
import { site } from "../../../content/site";
import { SectionShell } from "./SectionShell";

/**
 * Cta — Download (when live) / Source / Demo deep links.
 * Soft launch: no public download card; Source + Demo only.
 */
export function Cta() {
  const runtime = downloads.find((d) => d.id === "runtime");
  const source = downloads.find((d) => d.id === "source");
  const downloadPublic = isRuntimeDownloadPublic();
  const runtimeHref = publicDownloadHref("runtime");
  const sourceHref = publicDownloadHref("source");

  return (
    <SectionShell
      id="cta"
      eyebrow="Get Studio G"
      title={downloadPublic ? "Download. Build. Demo." : "Build. Demo."}
    >
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted">
        {downloadPublic
          ? "Ready-to-run Windows console or full source with OpenCV build pointers. Packages are hosted externally (checksum + size on each download page). SmartScreen may warn on unsigned builds."
          : "Public runtime packages are not listed yet. Request a demo for design-partner access, or review source build notes. Packages will ship with checksum + size when the release host is wired."}
      </p>

      <div
        className={`grid gap-4 ${downloadPublic ? "md:grid-cols-3" : "md:grid-cols-2"}`}
      >
        {downloadPublic && runtimeHref ? (
          <article className="flex flex-col rounded-sm border border-accent/30 bg-frame/70 p-6">
            <h3 className="font-display text-lg font-semibold text-ink">
              {runtime?.label ?? "Download Studio_G"}
            </h3>
            <p className="mt-2 flex-1 text-sm text-muted">
              Runtime zip
              {runtime?.sizeHint ? ` · ${runtime.sizeHint}` : null}
              {runtime?.updated ? ` · ${runtime.updated}` : null}
            </p>
            <Link
              href={runtimeHref}
              className="mt-6 inline-flex items-center justify-center rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-[var(--ink-on-accent)] transition-colors hover:bg-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi"
            >
              Go to download
            </Link>
          </article>
        ) : null}

        <article className="flex flex-col rounded-sm border border-[var(--border)] bg-panel/50 p-6">
          <h3 className="font-display text-lg font-semibold text-ink">
            {source?.label ?? "Get source"}
          </h3>
          <p className="mt-2 flex-1 text-sm text-muted">
            {sourceHref
              ? `Source zip${source?.sizeHint ? ` · ${source.sizeHint}` : ""}${source?.updated ? ` · ${source.updated}` : ""}`
              : "Build prerequisites and MSVC / OpenCV notes — no public zip yet."}
          </p>
          <Link
            href="/source"
            className="mt-6 inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-bg/50 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Source & build notes
          </Link>
        </article>

        <article
          className={`flex flex-col rounded-sm border p-6 ${downloadPublic ? "border-[var(--border)] bg-panel/50" : "border-accent/30 bg-frame/70"}`}
        >
          <h3 className="font-display text-lg font-semibold text-ink">
            Request a demo
          </h3>
          <p className="mt-2 flex-1 text-sm text-muted">
            Talk through mould setup and live outline tracking with{" "}
            {site.shortName}.
          </p>
          <Link
            href="/demo"
            className={`mt-6 inline-flex items-center justify-center rounded-sm px-4 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              downloadPublic
                ? "border border-[var(--border)] bg-bg/50 font-medium text-ink hover:border-accent/40 hover:text-accent focus-visible:outline-accent"
                : "bg-accent font-semibold text-[var(--ink-on-accent)] hover:bg-accent-hi focus-visible:outline-accent-hi"
            }`}
          >
            Request demo
          </Link>
        </article>
      </div>
    </SectionShell>
  );
}
