# Contributing — Anaglyph Studio (G) marketing site

## Owners (name before PR1 merge)

| Role | Name | Responsibility |
|------|------|----------------|
| **Eng owner** (scaffold + content model lead) | _Name before PR1 merge_ | Next.js scaffold, content model, CI, a11y baseline |
| **Motion / media eng** | _Name before PR1 merge_ (or same solo eng) | GSAP chapters, path diagram, media encode pipeline |
| **Product claim approver** | _Product owner — must sign claim registry before PR11 public_ | Approves every accuracy / capability claim in copy |
| **Media capturer** | _Operator with Studio G + bicycle example; may be eng or PM_ | UI screenshots, tracking loops, print crops from real product |

Fill real names in this table before merging the scaffold PR (PR1). Claim registry sign-off is a hard gate before public launch (PR11).

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
