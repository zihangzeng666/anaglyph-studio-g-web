import type { DownloadRef } from "./types";

/**
 * External release pointers only.
 * NEVER default multi-ten-MB zips into public/ or git.
 * PR8 wires real CDN/Release URLs and production env checks.
 *
 * sizeHint values measured 2026-07-18 from the share package tree.
 * sha256 placeholders until the hosted artifacts are hashed.
 */
export const downloads: DownloadRef[] = [
  {
    id: "runtime",
    label: "Download Studio_G",
    filename: "Anaglyph_Studio_G_2026-07-18.zip",
    /** Placeholder — set NEXT_PUBLIC_DL_RUNTIME_URL / hard URL in PR8 */
    href: "",
    sizeHint: "49.5 MB",
    sha256: "PLACEHOLDER_SHA256_RUNTIME_PENDING_RELEASE",
    updated: "2026-07-18",
  },
  {
    id: "source",
    label: "Get source",
    filename: "Anaglyph_Studio_G_Source_2026-07-18.zip",
    /** Placeholder — set NEXT_PUBLIC_DL_SOURCE_URL / hard URL in PR8 */
    href: "",
    sizeHint: "36.6 MB",
    sha256: "PLACEHOLDER_SHA256_SOURCE_PENDING_RELEASE",
    updated: "2026-07-18",
  },
];

export const downloadsById: ReadonlyMap<DownloadRef["id"], DownloadRef> =
  new Map(downloads.map((d) => [d.id, d]));
