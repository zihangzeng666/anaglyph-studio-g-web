import Link from "next/link";
import { downloads } from "../../../content/downloads";
import { site } from "../../../content/site";
import { SectionShell } from "./SectionShell";

/**
 * Cta — Download / Source / Demo deep links.
 * External zip hrefs are placeholders until PR8; routes always work.
 */
export function Cta() {
  const runtime = downloads.find((d) => d.id === "runtime");
  const source = downloads.find((d) => d.id === "source");

  return (
    <SectionShell id="cta" eyebrow="Get Studio G" title="Download. Build. Demo.">
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted">
        Ready-to-run Windows console or full source with OpenCV build pointers.
        Hosted package URLs land in a follow-on release PR.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
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
            href={runtime?.href || "/download"}
            className="mt-6 inline-flex items-center justify-center rounded-sm bg-accent px-4 py-2.5 text-sm font-semibold text-[var(--ink-on-accent)] transition-colors hover:bg-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi"
          >
            Go to download
          </Link>
        </article>

        <article className="flex flex-col rounded-sm border border-[var(--border)] bg-panel/50 p-6">
          <h3 className="font-display text-lg font-semibold text-ink">
            {source?.label ?? "Get source"}
          </h3>
          <p className="mt-2 flex-1 text-sm text-muted">
            Source zip
            {source?.sizeHint ? ` · ${source.sizeHint}` : null}
            {source?.updated ? ` · ${source.updated}` : null}
          </p>
          <Link
            href={source?.href || "/source"}
            className="mt-6 inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-bg/50 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Source & build notes
          </Link>
        </article>

        <article className="flex flex-col rounded-sm border border-[var(--border)] bg-panel/50 p-6">
          <h3 className="font-display text-lg font-semibold text-ink">
            Request a demo
          </h3>
          <p className="mt-2 flex-1 text-sm text-muted">
            Talk through mould setup and live outline tracking with {site.shortName}.
          </p>
          <Link
            href="/demo"
            className="mt-6 inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-bg/50 px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Request demo
          </Link>
        </article>
      </div>
    </SectionShell>
  );
}
