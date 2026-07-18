/**
 * Generates claim-safe industrial SVG placeholders for soft launch.
 * Replace with real captures under public/media/ when available.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pipelineDir = path.join(root, "public/media/pipeline");
const holdDir = path.join(root, "public/media/hold");
fs.mkdirSync(pipelineDir, { recursive: true });
fs.mkdirSync(holdDir, { recursive: true });

const bg = "#0c0e11";
const panel = "#14181e";
const frame = "#1c222a";
const accent = "#d4923c";
const muted = "#9aa3b0";
const ink = "#ebeef0";
const ok = "#59b87a";

function chrome(title, bodySvg, w = 1280, h = 720) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${frame}"/>
      <stop offset="55%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="${panel}"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#grid)"/>
  <rect x="24" y="24" width="${w - 48}" height="${h - 48}" rx="6" fill="${panel}" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
  <rect x="24" y="24" width="${w - 48}" height="48" rx="6" fill="${frame}"/>
  <rect x="24" y="66" width="${w - 48}" height="1" fill="rgba(255,255,255,0.06)"/>
  <circle cx="52" cy="48" r="5" fill="#e05c57" opacity="0.85"/>
  <circle cx="72" cy="48" r="5" fill="#e0ad5a" opacity="0.85"/>
  <circle cx="92" cy="48" r="5" fill="${ok}" opacity="0.85"/>
  <text x="120" y="53" fill="${accent}" font-family="ui-monospace, Cascadia Code, monospace" font-size="14" letter-spacing="0.18em">STUDIO G · ${title.toUpperCase()}</text>
  ${bodySvg}
  <text x="48" y="${h - 40}" fill="${muted}" font-family="ui-monospace, monospace" font-size="12" letter-spacing="0.12em">PLACEHOLDER MEDIA · REPLACE WITH CAPTURE</text>
</svg>
`;
}

const assets = {
  "setup.svg": chrome(
    "Setup",
    `
    <rect x="56" y="110" width="360" height="520" rx="4" fill="${bg}" stroke="rgba(255,255,255,0.08)"/>
    <text x="76" y="150" fill="${accent}" font-family="ui-monospace, monospace" font-size="13" letter-spacing="0.16em">CASE</text>
    <rect x="76" y="168" width="280" height="28" rx="3" fill="${frame}" stroke="rgba(212,146,60,0.35)"/>
    <text x="88" y="187" fill="${ink}" font-family="ui-monospace, monospace" font-size="13">mould-case-01</text>
    <text x="76" y="240" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">TAGS · id + size_mm</text>
    <rect x="76" y="256" width="280" height="18" rx="2" fill="${frame}"/>
    <rect x="76" y="284" width="220" height="18" rx="2" fill="${frame}"/>
    <rect x="76" y="312" width="250" height="18" rx="2" fill="${frame}"/>
    <text x="76" y="370" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">OUTLINE · CAD</text>
    <path d="M90 420 L150 390 L210 430 L270 380 L320 450" fill="none" stroke="${accent}" stroke-width="2"/>
    <circle cx="150" cy="390" r="4" fill="${accent}"/>
    <circle cx="210" cy="430" r="4" fill="${accent}"/>
    <circle cx="270" cy="380" r="4" fill="${accent}"/>
    <rect x="460" y="110" width="740" height="520" rx="4" fill="${bg}" stroke="rgba(255,255,255,0.08)"/>
    <text x="490" y="160" fill="${muted}" font-family="ui-monospace, monospace" font-size="12" letter-spacing="0.14em">LANDMARKS / CMM</text>
    <rect x="490" y="190" width="680" height="40" rx="3" fill="${frame}"/>
    <rect x="490" y="250" width="680" height="40" rx="3" fill="${frame}"/>
    <rect x="490" y="310" width="680" height="40" rx="3" fill="${frame}"/>
    <rect x="490" y="400" width="200" height="36" rx="3" fill="${accent}"/>
    <text x="530" y="423" fill="#1f1a12" font-family="ui-sans-serif, system-ui" font-size="14" font-weight="600">Save case</text>
  `,
  ),
  "tags.svg": chrome(
    "Tags",
    `
    <g transform="translate(80,120)">
      ${[0, 1, 2, 3]
        .map((r) =>
          [0, 1, 2, 3]
            .map((c) => {
              const x = c * 160;
              const y = r * 130;
              const cells = Array.from({ length: 25 }, (_, i) => {
                const cx = i % 5;
                const cy = (i / 5) | 0;
                const on =
                  (cx + cy + r + c) % 2 === 0 ||
                  cx === 0 ||
                  cy === 0 ||
                  cx === 4 ||
                  cy === 4;
                return on
                  ? `<rect x="${20 + cx * 16}" y="${20 + cy * 16}" width="14" height="14" fill="${ink}"/>`
                  : "";
              }).join("");
              return `<g transform="translate(${x},${y})"><rect width="120" height="110" rx="3" fill="#f4f4f0"/><g>${cells}</g><text x="8" y="105" fill="${bg}" font-family="monospace" font-size="10">T${r * 4 + c}</text></g>`;
            })
            .join(""),
        )
        .join("")}
    </g>
    <rect x="900" y="140" width="300" height="300" fill="#f4f4f0" stroke="${accent}" stroke-width="2"/>
    ${Array.from({ length: 8 }, (_, r) =>
      Array.from({ length: 8 }, (_, c) => {
        const black = (r + c) % 2 === 0;
        return `<rect x="${920 + c * 32}" y="${160 + r * 32}" width="28" height="28" fill="${black ? "#111" : "#f4f4f0"}"/>`;
      }).join(""),
    ).join("")}
    <text x="900" y="470" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">ChArUco · actual size</text>
  `,
  ),
  "camera-k.svg": chrome(
    "Camera K",
    `
    <rect x="80" y="120" width="520" height="480" rx="4" fill="${bg}" stroke="rgba(255,255,255,0.08)"/>
    <text x="110" y="170" fill="${accent}" font-family="ui-monospace, monospace" font-size="13" letter-spacing="0.16em">MEASURE K</text>
    <ellipse cx="340" cy="360" rx="160" ry="120" fill="none" stroke="${accent}" stroke-width="2" opacity="0.7"/>
    <circle cx="340" cy="360" r="8" fill="${accent}"/>
    <path d="M200 280 L480 280 M200 440 L480 440 M220 220 L220 500 M460 220 L460 500" stroke="rgba(212,146,60,0.25)" stroke-width="1"/>
    ${[
      [250, 300],
      [420, 310],
      [280, 420],
      [400, 400],
    ]
      .map(
        ([x, y], i) => `
      <rect x="${x}" y="${y}" width="28" height="28" fill="#eee" stroke="${accent}"/>
      <text x="${x + 6}" y="${y + 19}" fill="#111" font-family="monospace" font-size="10">${i}</text>
    `,
      )
      .join("")}
    <rect x="640" y="120" width="560" height="480" rx="4" fill="${bg}" stroke="rgba(255,255,255,0.08)"/>
    <text x="670" y="170" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">K MATRIX · real intrinsics</text>
    <text x="670" y="230" fill="${ink}" font-family="ui-monospace, monospace" font-size="16">fx  1240.2</text>
    <text x="670" y="270" fill="${ink}" font-family="ui-monospace, monospace" font-size="16">fy  1241.8</text>
    <text x="670" y="310" fill="${ink}" font-family="ui-monospace, monospace" font-size="16">cx   640.1</text>
    <text x="670" y="350" fill="${ink}" font-family="ui-monospace, monospace" font-size="16">cy   360.4</text>
    <rect x="670" y="400" width="280" height="32" rx="3" fill="${frame}" stroke="rgba(255,255,255,0.1)"/>
    <text x="690" y="421" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">FOV guess = placeholder only</text>
  `,
  ),
  "solve-cmm.svg": chrome(
    "Solve / CMM",
    `
    <rect x="70" y="120" width="540" height="480" rx="4" fill="${bg}" stroke="rgba(212,146,60,0.35)"/>
    <text x="100" y="170" fill="${accent}" font-family="ui-monospace, monospace" font-size="13" letter-spacing="0.14em">BUILD · PnP</text>
    <rect x="100" y="200" width="480" height="220" rx="3" fill="${frame}"/>
    <path d="M140 360 L220 260 L300 320 L380 240 L480 350" fill="none" stroke="${accent}" stroke-width="2"/>
    ${[
      [220, 260],
      [300, 320],
      [380, 240],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${ok}"/>`)
      .join("")}
    <text x="100" y="460" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">Capture · annotate · solve</text>
    <rect x="100" y="490" width="160" height="32" rx="3" fill="${accent}"/>
    <text x="130" y="511" fill="#1f1a12" font-family="system-ui" font-size="13" font-weight="600">Solve PnP</text>
    <rect x="670" y="120" width="540" height="480" rx="4" fill="${bg}" stroke="rgba(255,255,255,0.08)"/>
    <text x="700" y="170" fill="${accent}" font-family="ui-monospace, monospace" font-size="13" letter-spacing="0.14em">BUILD · CMM</text>
    <text x="700" y="230" fill="${ink}" font-family="ui-monospace, monospace" font-size="13">tag_id,x_mm,y_mm,z_mm</text>
    <text x="700" y="270" fill="${muted}" font-family="ui-monospace, monospace" font-size="13">01, 120.4,  40.2, 0.0</text>
    <text x="700" y="300" fill="${muted}" font-family="ui-monospace, monospace" font-size="13">02, 280.1,  42.0, 0.1</text>
    <text x="700" y="330" fill="${muted}" font-family="ui-monospace, monospace" font-size="13">03, 121.0, 200.5, 0.0</text>
    <text x="700" y="360" fill="${muted}" font-family="ui-monospace, monospace" font-size="13">04, 279.8, 199.2, 0.2</text>
    <rect x="700" y="420" width="200" height="32" rx="3" fill="${frame}" stroke="rgba(255,255,255,0.12)"/>
    <text x="730" y="441" fill="${ink}" font-family="system-ui" font-size="13">Import CSV</text>
  `,
  ),
  "scene.svg": chrome(
    "Scene",
    `
    <rect x="80" y="120" width="720" height="480" rx="4" fill="${bg}" stroke="rgba(255,255,255,0.08)"/>
    <path d="M200 500 L640 500 L560 220 L280 220 Z" fill="none" stroke="${accent}" stroke-width="2" opacity="0.9"/>
    <path d="M280 220 L360 160 L640 160 L560 220" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
    <path d="M200 500 L280 440 L360 160" fill="none" stroke="rgba(212,146,60,0.35)" stroke-width="1"/>
    ${[
      [320, 300],
      [480, 280],
      [400, 400],
      [520, 360],
    ]
      .map(
        ([x, y], i) => `
      <rect x="${x}" y="${y}" width="22" height="22" fill="#f0f0ea" stroke="${accent}"/>
      <text x="${x + 5}" y="${y + 15}" fill="#111" font-size="10" font-family="monospace">${i + 1}</text>
    `,
      )
      .join("")}
    <circle cx="400" cy="340" r="3" fill="${ok}"/>
    <text x="860" y="180" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">SCENE JSON</text>
    <rect x="860" y="200" width="340" height="360" rx="4" fill="${frame}" stroke="rgba(255,255,255,0.08)"/>
    <text x="880" y="240" fill="${ink}" font-family="ui-monospace, monospace" font-size="12">{</text>
    <text x="900" y="270" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">"outline": […],</text>
    <text x="900" y="300" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">"tags": […],</text>
    <text x="900" y="330" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">"K": {…}</text>
    <text x="880" y="370" fill="${ink}" font-family="ui-monospace, monospace" font-size="12">}</text>
  `,
  ),
  "track.svg": chrome(
    "Track",
    `
    <rect x="80" y="120" width="900" height="480" rx="4" fill="${bg}" stroke="rgba(255,255,255,0.08)"/>
    <ellipse cx="420" cy="360" rx="280" ry="160" fill="${frame}" opacity="0.8"/>
    <path d="M220 400 C300 280, 500 260, 620 380 S780 450, 700 300" fill="none" stroke="${accent}" stroke-width="2.5"/>
    <path d="M240 410 C310 300, 490 280, 600 390" fill="none" stroke="${ok}" stroke-width="1.5" opacity="0.8"/>
    ${[
      [300, 340],
      [450, 300],
      [560, 360],
      [380, 400],
    ]
      .map(
        ([x, y]) => `
      <rect x="${x}" y="${y}" width="20" height="20" fill="#f2f2ec" stroke="${accent}"/>
    `,
      )
      .join("")}
    <rect x="1000" y="140" width="200" height="120" rx="4" fill="${frame}" stroke="rgba(212,146,60,0.4)"/>
    <text x="1020" y="180" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">err px</text>
    <text x="1020" y="220" fill="${accent}" font-family="ui-monospace, monospace" font-size="28">1.4</text>
    <rect x="1000" y="290" width="200" height="100" rx="4" fill="${frame}" stroke="rgba(255,255,255,0.08)"/>
    <text x="1020" y="330" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">approx mm</text>
    <text x="1020" y="365" fill="${ink}" font-family="ui-monospace, monospace" font-size="22">~0.3</text>
    <text x="100" y="640" fill="${muted}" font-family="ui-monospace, monospace" font-size="12">LIVE OUTLINE LOCK · not a CMM certificate</text>
  `,
  ),
};

for (const [name, svg] of Object.entries(assets)) {
  fs.writeFileSync(path.join(pipelineDir, name), svg);
  console.log("wrote pipeline/" + name);
}

const poster = chrome(
  "Track · Hold",
  `
  <rect x="80" y="120" width="1120" height="480" rx="4" fill="${bg}" stroke="rgba(255,255,255,0.08)"/>
  <ellipse cx="560" cy="360" rx="320" ry="170" fill="${frame}" opacity="0.85"/>
  <path d="M280 420 C380 260, 620 250, 780 400 S960 480, 860 300" fill="none" stroke="${accent}" stroke-width="3"/>
  <path d="M300 430 C390 290, 600 270, 760 410" fill="none" stroke="${ok}" stroke-width="1.75" opacity="0.85"/>
  ${[
    [360, 340],
    [520, 290],
    [680, 370],
    [480, 400],
    [600, 330],
  ]
    .map(
      ([x, y]) => `
    <rect x="${x}" y="${y}" width="22" height="22" fill="#f2f2ec" stroke="${accent}"/>
  `,
    )
    .join("")}
  <circle cx="560" cy="360" r="6" fill="${accent}"/>
  <text x="100" y="170" fill="${accent}" font-family="ui-monospace, monospace" font-size="14" letter-spacing="0.2em">HOLD TO EXPLORE · DEMO STILL</text>
  <rect x="1000" y="150" width="160" height="70" rx="4" fill="${frame}" stroke="rgba(212,146,60,0.45)"/>
  <text x="1020" y="180" fill="${muted}" font-family="ui-monospace, monospace" font-size="11">err px</text>
  <text x="1020" y="205" fill="${accent}" font-family="ui-monospace, monospace" font-size="22">1.4</text>
`,
);

fs.writeFileSync(path.join(holdDir, "track-poster.svg"), poster);
console.log("wrote hold/track-poster.svg");
console.log("done");
