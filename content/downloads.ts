import type { DownloadRef } from "./types";

/**
 * External release pointers only.
 * NEVER default multi-ten-MB zips into public/ or git.
 *
 * sizeHint values measured 2026-07-18 from the share package tree.
 * sha256 placeholders until the hosted artifacts are hashed.
 *
 * Production: set NEXT_PUBLIC_DL_RUNTIME_URL / NEXT_PUBLIC_DL_SOURCE_URL
 * (and optional SHA env vars) to immutable HTTPS release URLs.
 * Until then, example.com placeholders keep CTAs wired for soft launch.
 */

function envUrl(name: string, fallback: string): string {
  const v = process.env[name];
  if (v && v.trim().length > 0) return v.trim();
  return fallback;
}

function envSha(name: string, fallback: string): string {
  const v = process.env[name];
  if (v && v.trim().length > 0) return v.trim();
  return fallback;
}

const RUNTIME_HREF = envUrl(
  "NEXT_PUBLIC_DL_RUNTIME_URL",
  "https://example.com/releases/Anaglyph_Studio_G_2026-07-18.zip",
);

const SOURCE_HREF = envUrl(
  "NEXT_PUBLIC_DL_SOURCE_URL",
  "https://example.com/releases/Anaglyph_Studio_G_Source_2026-07-18.zip",
);

export const downloads: DownloadRef[] = [
  {
    id: "runtime",
    label: "Download Studio_G",
    filename: "Anaglyph_Studio_G_2026-07-18.zip",
    href: RUNTIME_HREF,
    sizeHint: "49.5 MB",
    sha256: envSha(
      "NEXT_PUBLIC_DL_RUNTIME_SHA256",
      "PLACEHOLDER_SHA256_RUNTIME_PENDING_RELEASE",
    ),
    updated: "2026-07-18",
  },
  {
    id: "source",
    label: "Get source",
    filename: "Anaglyph_Studio_G_Source_2026-07-18.zip",
    href: SOURCE_HREF,
    sizeHint: "36.6 MB",
    sha256: envSha(
      "NEXT_PUBLIC_DL_SOURCE_SHA256",
      "PLACEHOLDER_SHA256_SOURCE_PENDING_RELEASE",
    ),
    updated: "2026-07-18",
  },
];

export const downloadsById: ReadonlyMap<DownloadRef["id"], DownloadRef> =
  new Map(downloads.map((d) => [d.id, d]));

/** True when href is a non-placeholder external URL (not empty, not #). */
export function isDownloadLive(href: string): boolean {
  if (!href || href === "#") return false;
  return /^https?:\/\//i.test(href);
}

/** True when host is still the example.com placeholder. */
export function isPlaceholderHost(href: string): boolean {
  try {
    return new URL(href).hostname === "example.com";
  } catch {
    return true;
  }
}
