import type { Metadata } from "next";
import { downloadsById } from "../../../content/downloads";
import { site } from "../../../content/site";
import { UtilityPage } from "@/components/UtilityPage";

export const metadata: Metadata = {
  title: "Source",
  description: `Build ${site.productName} from source — MSVC, OpenCV, optional industrial SDKs.`,
};

export default function SourcePage() {
  const source = downloadsById.get("source");
  const hasHref = Boolean(source?.href);

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

      {hasHref ? (
        <p>
          <a
            href={source!.href}
            className="inline-flex rounded-sm border border-[var(--border)] bg-panel px-5 py-3 text-sm font-semibold text-ink hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
    </UtilityPage>
  );
}
