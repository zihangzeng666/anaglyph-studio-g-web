# Anaglyph Studio (G) — Marketing Website

Premium product marketing site for **Anaglyph Studio (G)** — a Windows desktop console for industrial mould setup and live AR outline tracking.

> Product name is **Anaglyph Studio (G)** only. Never brand this site as “Grok.”

## Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js (App Router) + TypeScript |
| Export | Static (`output: 'export'`) |
| Styling | Tailwind CSS + Studio G design tokens |
| Motion (later) | GSAP ScrollTrigger (base plugin only until license confirmed) |

## Design tokens

Graphite + brass amber, aligned with the product UI:

| Token | Value | Role |
|-------|--------|------|
| `--bg` | `#0c0e11` | Near-black graphite |
| `--panel` | `#14181e` | Cool panels |
| `--frame` | `#1c222a` | Inputs / chrome |
| `--accent` | `#d4923c` | Brass amber CTAs |
| `--accent-hi` | `#e6a852` | Interactive lift |
| `--text` | `#ebeef0` | Primary ink on dark |
| `--muted` | `#9aa3b0` | Secondary text |

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run typecheck
npm test           # claim/chip registry unit tests (vitest)
npm run build      # static export → out/
npm run preview    # serve out/ (static only; no next start)
```

## Scripts

| Script | Purpose |
|--------|---------|
| `dev` | Local Next.js dev server |
| `build` | Production static export → `out/` |
| `preview` | Static file server for `out/` after build |
| `lint` | ESLint (next/core-web-vitals) |
| `typecheck` | `tsc --noEmit` |
| `test` | Vitest — chip `claimId` map + claim-safety checks |

> This app uses **`output: 'export'`**. There is no `next start` server path; always preview via `build` + `preview`.

## Typography (scaffold)

CSS stacks name Inter / Space Grotesk / IBM Plex Mono for intent, with system-ui / Cascadia / monospace fallbacks. **No self-hosted files or `next/font` yet** — `public/fonts/` is a stub. System fonts are intentional for PR1; load subsets (or `next/font`) in a polish PR to avoid FOUT/layout shift when brand faces ship.

## Project layout

```text
content/         # Typed marketing model (claims, chapters, sections, downloads)
  __tests__/     # claims-map: every chip.claimId ∈ claims.ts
src/
  app/           # App Router (layout, home shell, icon)
  components/    # BrandMark + future sections
public/
  fonts/         # Self-hosted font subsets (stubs — system fallbacks until polish)
  media/         # Marketing media (later PRs)
```

## Deploy

Static export only — see [docs/DEPLOY.md](./docs/DEPLOY.md) for security headers, rollback, soft-launch checklist, and craft-reference legal note. Performance/a11y gates: [docs/PERF.md](./docs/PERF.md). Media encode: [public/media/README.md](./public/media/README.md).

```bash
npm run build && npm run preview
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for owners (eng, claim approver, media capturer) and PR workflow.

## License

Proprietary — Anaglyph Studio (G) product marketing. All rights reserved.
