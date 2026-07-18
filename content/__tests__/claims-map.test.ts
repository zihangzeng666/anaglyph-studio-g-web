import { describe, expect, it } from "vitest";
import { claims, claimsById, FORBIDDEN_PHRASES } from "../claims";
import { chapters } from "../chapters";
import { downloads } from "../downloads";
import { sections, site, workflows } from "../site";
import type { SectionId } from "../types";

describe("claims registry", () => {
  it("has unique claim ids", () => {
    const ids = claims.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("requires evidence on every claim", () => {
    for (const claim of claims) {
      expect(claim.evidence.trim().length, claim.id).toBeGreaterThan(0);
      expect(claim.statement.trim().length, claim.id).toBeGreaterThan(0);
    }
  });
});

describe("chapter chip → claim map", () => {
  it("every chip.claimId exists in claims.ts", () => {
    const missing: string[] = [];

    for (const chapter of chapters) {
      for (const chip of chapter.chips) {
        if (!claimsById.has(chip.claimId)) {
          missing.push(`${chapter.id}/${chip.label} → ${chip.claimId}`);
        }
      }
    }

    expect(missing, `orphan chip claimIds:\n${missing.join("\n")}`).toEqual(
      [],
    );
  });

  it("every chapter has at least one chip", () => {
    for (const chapter of chapters) {
      expect(chapter.chips.length, chapter.id).toBeGreaterThan(0);
    }
  });
});

describe("pipeline chapters", () => {
  it("covers Setup → Tags → K → Solve/CMM → Scene → Track", () => {
    expect(chapters.map((c) => c.id)).toEqual([
      "setup",
      "tags",
      "camera-k",
      "solve-cmm",
      "scene",
      "track",
    ]);
  });
});

describe("site sections registry", () => {
  const expected: SectionId[] = [
    "hero",
    "problem",
    "pipeline",
    "paths",
    "hold",
    "specs",
    "printables",
    "cameras",
    "cta",
    "footer",
  ];

  it("lists all section slots in order", () => {
    expect(sections.map((s) => s.id)).toEqual(expected);
  });

  it("has unique section ids", () => {
    const ids = sections.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("workflows", () => {
  it("uses exact product labels", () => {
    expect(workflows.map((w) => w.label)).toEqual([
      "Load · track",
      "Build · PnP",
      "Build · CMM",
    ]);
  });
});

describe("pipeline media paths", () => {
  it("points at public/media pipeline assets with extension", async () => {
    const { chapters } = await import("../chapters");
    for (const ch of chapters) {
      expect(ch.media.src).toMatch(/^\/media\/pipeline\/.+\.(svg|png|webp|jpg|jpeg)$/);
    }
  });
});

describe("downloads placeholders", () => {
  it("exposes runtime and source with measured sizeHints", () => {
    const runtime = downloads.find((d) => d.id === "runtime");
    const source = downloads.find((d) => d.id === "source");

    expect(runtime?.sizeHint).toBe("49.5 MB");
    expect(source?.sizeHint).toBe("36.6 MB");
    expect(runtime?.sha256).toMatch(/PLACEHOLDER|pending/i);
    expect(source?.sha256).toMatch(/PLACEHOLDER|pending/i);
  });

  it("wires external HTTPS hrefs (not public/ zips)", () => {
    for (const d of downloads) {
      expect(d.href.startsWith("/downloads/")).toBe(false);
      expect(d.href.includes("public/")).toBe(false);
      expect(d.href).toMatch(/^https:\/\//i);
    }
  });

  it("treats example.com placeholders as not live (soft launch: no public download CTAs)", async () => {
    const { isDownloadLive, isRuntimeDownloadPublic, publicDownloadHref } =
      await import("../downloads");

    for (const d of downloads) {
      expect(isDownloadLive(d.href)).toBe(false);
    }
    expect(isRuntimeDownloadPublic()).toBe(false);
    expect(publicDownloadHref("runtime")).toBeNull();
    expect(publicDownloadHref("source")).toBeNull();
    expect(isDownloadLive("https://releases.example.org/app.zip")).toBe(true);
    expect(isDownloadLive("https://example.com/app.zip")).toBe(false);
    expect(isDownloadLive("#")).toBe(false);
  });
});

describe("claim safety / branding", () => {
  it("documents forbidden phrases including Grok and fake accuracy", () => {
    expect(FORBIDDEN_PHRASES).toEqual(
      expect.arrayContaining([
        "Grok",
        "always calibrated",
        "no calibration needed",
        "sub-mm accuracy",
      ]),
    );
  });

  it("site product name is Anaglyph Studio (G) only", () => {
    expect(site.productName).toBe("Anaglyph Studio (G)");
    expect(site.productName.toLowerCase()).not.toContain("grok");
    expect(site.shortName.toLowerCase()).not.toContain("grok");
  });

  it("site copy blobs avoid forbidden phrases", () => {
    const blobs = [
      site.tagline,
      site.lead,
      ...chapters.map((c) => `${c.title} ${c.body}`),
      ...chapters.flatMap((c) => c.chips.map((ch) => ch.label)),
      ...claims.map((c) => c.statement),
      ...site.specs.map((s) => `${s.label} ${s.value}`),
    ].join("\n");

    for (const phrase of FORBIDDEN_PHRASES) {
      // Allow the product-name claim and forbidden list to mention "Grok" only
      // as a negative rule, not as branding. Scan marketing statements carefully:
      if (phrase === "Grok") {
        // statements that ban Grok may mention it; brand fields must not
        expect(site.tagline.toLowerCase()).not.toContain("grok");
        expect(site.lead.toLowerCase()).not.toContain("grok");
        continue;
      }
      expect(
        blobs.toLowerCase().includes(phrase.toLowerCase()),
        `forbidden phrase appears in marketing copy: "${phrase}"`,
      ).toBe(false);
    }
  });

  it("FOV claim states placeholder, not real K", () => {
    const fov = claimsById.get("fov-placeholder");
    expect(fov).toBeDefined();
    expect(fov!.statement.toLowerCase()).toMatch(/placeholder/);
    expect(fov!.statement.toLowerCase()).toMatch(/not a real calibration/);
  });

  it("err mm claim qualifies approximate", () => {
    const err = claimsById.get("err-mm-approx");
    expect(err).toBeDefined();
    expect(err!.statement.toLowerCase()).toMatch(/approx/);
  });
});
