# Contributing — Anaglyph Studio (G) marketing site

## Owners

| Role | Name | Responsibility |
|------|------|----------------|
| **Eng owner** (scaffold + content model lead) | Interim solo eng (repo maintainer) | Next.js scaffold, content model, CI, a11y baseline |
| **Motion / media eng** | Same as eng owner (interim solo) | GSAP chapters, path diagram, media encode pipeline |
| **Product claim approver** | TBD — product owner | Approves every accuracy / capability claim in copy |
| **Media capturer** | TBD — operator with Studio G + bicycle example (may be eng or PM) | UI screenshots, tracking loops, print crops from real product |

**Interim solo:** eng + motion are the same person until a second engineer is assigned. Replace “Interim solo eng” with a real name when ownership is formalized.

**Hard gates:** claim approver and media capturer must be named and claim registry signed **before PR11 public launch**. Those roles may stay TBD through early scaffold/content PRs.

## Product naming

- Use **Anaglyph Studio (G)** or **Studio G** only.
- Never brand the product as “Grok” on this site.

## Development

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
npm run preview   # static server for out/ after build (not next start)
```

CI runs `npm ci`, `lint`, `typecheck`, and `build` on every push/PR.

## Pull requests

1. Branch from `main` (or the current stack base for sequenced plan PRs).
2. Keep PRs focused — one vertical slice (scaffold, content model, section, motion, etc.).
3. Marketing copy must stay claim-safe: every numeric or accuracy phrase maps to product UI/docs or is explicitly qualitative.
4. Do not commit runtime or source zip packages into this repo; host downloads externally.

## Claims & media

- Claim registry lands in a later PR (`content/claims.ts`). No invented tolerances.
- Media encode recipes and capture checklist land with the media/hold PR. Capturer role owns source footage quality.
