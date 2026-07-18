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
npm run build      # static export → out/
```

## Scripts

| Script | Purpose |
|--------|---------|
| `dev` | Local Next.js dev server |
| `build` | Production static export |
| `lint` | ESLint (next/core-web-vitals) |
| `typecheck` | `tsc --noEmit` |

## Project layout

```text
src/
  app/           # App Router (layout, home shell)
  components/    # BrandMark + future sections
public/
  fonts/         # Self-hosted font subsets (stubs)
  media/         # Marketing media (later PRs)
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for owners (eng, claim approver, media capturer) and PR workflow.

## License

Proprietary — Anaglyph Studio (G) product marketing. All rights reserved.
