import type { Metadata } from "next";
import {
  downloadsById,
  isDownloadLive,
  isPlaceholderHost,
} from "../../../content/downloads";
import { site } from "../../../content/site";
import { UtilityPage } from "@/components/UtilityPage";

export const metadata: Metadata = {
  title: "Download",
  description: `Download ${site.productName} runtime package for Windows 10/11 x64.`,
};

export default function DownloadPage() {
  const runtime = downloadsById.get("runtime");
  const href = runtime?.href ?? "";
  const live = isDownloadLive(href);
  const placeholder = isPlaceholderHost(href);

  return (
    <UtilityPage title="Download Studio_G" eyebrow="Download">
      <p>
        Ready-to-run Windows console for mould setup and live AR outline
        tracking. Package sizes are measured per release — not estimates.
      </p>

      <dl className="rounded-sm border border-[var(--border)] bg-panel/50 p-5 font-mono text-sm text-ink">
        <div className="flex flex-col gap-1 border-b border-[var(--border)] py-3 first:pt-0 sm:flex-row sm:justify-between">
          <dt className="text-muted">Filename</dt>
          <dd>{runtime?.filename ?? "—"}</dd>
        </div>
        <div className="flex flex-col gap-1 border-b border-[var(--border)] py-3 sm:flex-row sm:justify-between">
          <dt className="text-muted">Size</dt>
          <dd>{runtime?.sizeHint ?? "—"}</dd>
        </div>
        <div className="flex flex-col gap-1 border-b border-[var(--border)] py-3 sm:flex-row sm:justify-between">
          <dt className="text-muted">Updated</dt>
          <dd>{runtime?.updated ?? "—"}</dd>
        </div>
        <div className="flex flex-col gap-1 py-3 last:pb-0 sm:flex-row sm:justify-between">
          <dt className="text-muted">SHA-256</dt>
          <dd className="break-all text-xs text-muted">
            {runtime?.sha256 ?? "—"}
          </dd>
        </div>
      </dl>

      {live ? (
        <p>
          <a
            href={href}
            className="inline-flex rounded-sm bg-accent px-5 py-3 text-sm font-semibold text-[var(--ink-on-accent)] hover:bg-accent-hi focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-hi"
            rel={placeholder ? "nofollow" : undefined}
          >
            Download {runtime!.filename}
          </a>
        </p>
      ) : (
        <p className="rounded-sm border border-[var(--border)] bg-frame/40 px-4 py-3 text-sm">
          External download URL is not wired yet. Use{" "}
          <a href="/demo" className="text-accent underline-offset-2 hover:underline">
            Request demo
          </a>{" "}
          for interim access.
        </p>
      )}

      {placeholder && live ? (
        <p className="rounded-sm border border-[var(--border)] bg-frame/30 px-4 py-3 text-sm text-muted">
          Host URL is still an{" "}
          <span className="font-mono text-ink">example.com</span> placeholder.
          Replace with{" "}
          <span className="font-mono text-ink">NEXT_PUBLIC_DL_RUNTIME_URL</span>{" "}
          (immutable HTTPS release) before public launch. No zip is stored in
          this git repo.
        </p>
      ) : null}

      <section aria-labelledby="sysreq-heading">
        <h2
          id="sysreq-heading"
          className="font-display text-xl font-semibold text-ink"
        >
          System requirements
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>Windows 10/11 x64</li>
          <li>Direct3D 11 capable GPU</li>
          <li>Camera: webcam, video file, or IC4 (share runtime)</li>
          <li>Optional: Spinnaker SDK builds require CMake WITH_SPINNAKER</li>
        </ul>
      </section>

      <section aria-labelledby="smartscreen-heading">
        <h2
          id="smartscreen-heading"
          className="font-display text-xl font-semibold text-ink"
        >
          SmartScreen note
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Windows 10/11 x64 · ready-to-run zip ·{" "}
          <strong className="font-medium text-ink">
            SmartScreen may warn on unsigned builds
          </strong>
          . Prefer the published SHA-256 over “looks fine” heuristics. Source
          builds and code-signing policy are covered on the{" "}
          <a href="/source" className="text-accent underline-offset-2 hover:underline">
            source
          </a>{" "}
          page.
        </p>
      </section>
    </UtilityPage>
  );
}
