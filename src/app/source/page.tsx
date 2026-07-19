import type { Metadata } from "next";
import {
  downloadsById,
  isDownloadLive,
  isPlaceholderHost,
} from "../../../content/downloads";
import { site } from "../../../content/site";
import { UtilityPage } from "@/components/UtilityPage";

export const metadata: Metadata = {
  title: "Source",
  description: `Build ${site.productName} from source — MSVC, OpenCV, optional industrial SDKs.`,
};

export default function SourcePage() {
  const source = downloadsById.get("source");
  const href = source?.href ?? "";
  const live = isDownloadLive(href);
  const placeholder = isPlaceholderHost(href);

  return (
    <UtilityPage title="Get source" eyebrow="Source">
      <p>
        A source zip with build pointers for OpenCV and the optional industrial
        camera SDKs. This is the shareable build package, measured per release
        — not the private product tree.
      </p>

      {live ? (
        <>
          <dl className="rounded-sm border border-[var(--border)] bg-panel/50 p-5 font-mono text-sm text-ink">
            <div className="flex flex-col gap-1 border-b border-[var(--border)] py-3 first:pt-0 sm:flex-row sm:justify-between">
              <dt className="text-muted">Filename</dt>
              <dd>{source?.filename ?? "—"}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-[var(--border)] py-3 sm:flex-row sm:justify-between">
              <dt className="text-muted">Size</dt>
              <dd>{source?.sizeHint ?? "—"}</dd>
            </div>
            <div className="flex flex-col gap-1 border-b border-[var(--border)] py-3 sm:flex-row sm:justify-between">
              <dt className="text-muted">Updated</dt>
              <dd>{source?.updated ?? "—"}</dd>
            </div>
            <div className="flex flex-col gap-1 py-3 last:pb-0 sm:flex-row sm:justify-between">
              <dt className="text-muted">SHA-256</dt>
              <dd className="break-all text-xs text-muted">
                {source?.sha256 ?? "—"}
              </dd>
            </div>
          </dl>

          <p>
            <a
              href={href}
              className="inline-flex rounded-sm border border-[var(--border)] bg-panel px-5 py-3 text-sm font-semibold text-ink hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Download {source!.filename}
            </a>
          </p>
        </>
      ) : (
        <>
          <p className="rounded-sm border border-[var(--border)] bg-frame/40 px-4 py-3 text-sm">
            The source zip isn’t listed during this soft launch —{" "}
            <a
              href="/demo"
              className="text-accent underline-offset-2 hover:underline"
            >
              request a demo
            </a>{" "}
            for design-partner access. Once you have the package, the
            prerequisites below apply; the full walkthrough is{" "}
            <span className="font-mono text-ink">BUILD.md</span> in the source
            tree.
          </p>
          {placeholder ? (
            <p className="rounded-sm border border-dashed border-[var(--border)] px-4 py-3 font-mono text-[11px] leading-relaxed text-muted">
              site note · release host not configured — NEXT_PUBLIC_DL_SOURCE_URL
              still points at a placeholder
            </p>
          ) : null}
        </>
      )}

      <section aria-labelledby="prereq-heading">
        <h2
          id="prereq-heading"
          className="font-display text-xl font-semibold text-ink"
        >
          Build prerequisites
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>Windows 10/11 x64 · MSVC toolchain</li>
          <li>OpenCV 4.11 (path per BUILD.md)</li>
          <li>Optional: IC4 runtime / Spinnaker SDK (CMake flags)</li>
          <li>CMake 3.x+</li>
        </ul>
      </section>

      <section aria-labelledby="sysreq-source-heading">
        <h2
          id="sysreq-source-heading"
          className="font-display text-xl font-semibold text-ink"
        >
          Runtime system requirements
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>Windows 10/11 x64</li>
          <li>Direct3D 11 capable GPU</li>
          <li>Camera: webcam, video file, or IC4</li>
        </ul>
      </section>

      <section aria-labelledby="smartscreen-source-heading">
        <h2
          id="smartscreen-source-heading"
          className="font-display text-xl font-semibold text-ink"
        >
          SmartScreen note
        </h2>
        <p className="mt-3 text-sm leading-relaxed">
          Binaries you build yourself are unsigned, so Windows SmartScreen may
          warn on first run. For official packages, verify the published
          SHA-256 — that’s the check that matters.
        </p>
      </section>
    </UtilityPage>
  );
}
