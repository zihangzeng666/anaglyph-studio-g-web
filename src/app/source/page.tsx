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
        Source zip with build pointers for OpenCV and optional industrial camera
        SDKs. Not a monorepo with the private product tree — a shareable build
        package measured per release.
      </p>

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

      {live ? (
        <p>
          <a
            href={href}
            className="inline-flex rounded-sm border border-[var(--border)] bg-panel px-5 py-3 text-sm font-semibold text-ink hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            rel={placeholder ? "nofollow" : undefined}
          >
            Download {source!.filename}
          </a>
        </p>
      ) : (
        <p className="rounded-sm border border-[var(--border)] bg-frame/40 px-4 py-3 text-sm">
          Source package URL is a placeholder until the external host is wired.
          See product <span className="font-mono text-ink">BUILD.md</span> in the
          source tree for MSVC / OpenCV steps once you have the zip.
        </p>
      )}

      {placeholder && live ? (
        <p className="rounded-sm border border-[var(--border)] bg-frame/30 px-4 py-3 text-sm text-muted">
          Host URL is still an{" "}
          <span className="font-mono text-ink">example.com</span> placeholder.
          Set{" "}
          <span className="font-mono text-ink">NEXT_PUBLIC_DL_SOURCE_URL</span>{" "}
          to the real release host before public launch. No zip is stored in
          this git repo.
        </p>
      ) : null}

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
          Built binaries from source may trigger Windows SmartScreen when
          unsigned. Prefer verifying the published SHA-256 for official
          packages. Code-signing is a product release decision, not a marketing
          site concern.
        </p>
      </section>
    </UtilityPage>
  );
}
