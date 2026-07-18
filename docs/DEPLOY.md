# Deploy & soft-launch runbook — Anaglyph Studio (G)

Static export (`output: 'export'`) → host `out/` on any CDN / object storage / Pages provider.

> Product name is **Anaglyph Studio (G)** / **Studio G** only. Never brand as “Grok.”

## Build

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build      # → out/
npm run preview    # local static serve of out/
```

### Production env (set on CI / host before build)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_DL_RUNTIME_URL` | Immutable HTTPS runtime zip |
| `NEXT_PUBLIC_DL_SOURCE_URL` | Immutable HTTPS source zip |
| `NEXT_PUBLIC_DL_RUNTIME_SHA256` | Hex SHA-256 of runtime artifact |
| `NEXT_PUBLIC_DL_SOURCE_SHA256` | Hex SHA-256 of source artifact |
| `NEXT_PUBLIC_DEMO_MAILTO` | Demo inbox (or use Formspree) |
| `NEXT_PUBLIC_FORMSPREE_ID` | Optional Formspree form id |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional Plausible site domain |
| `NEXT_PUBLIC_ENABLE_HOLD_EXPLORE` | `0` soft launch (default) |
| `NEXT_PUBLIC_HOLD_MODE` | `play-only` soft launch |

Never commit multi-ten-MB zips into this repo. Host on R2/S3/GitHub Releases only.

## Security headers (host config)

Configure at the CDN / reverse proxy (static hosts do not set these in Next export alone).

| Header | Recommended value |
|--------|-------------------|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` (HTTPS only) |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `X-Frame-Options` | `DENY` (or CSP `frame-ancestors 'none'`) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Content-Security-Policy` | Start strict; allow self + download host + Formspree/Plausible if enabled |

### Example Cloudflare Pages `_headers`

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Example Netlify `public/_headers` (copy into publish dir)

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
```

Tune CSP after choosing analytics/form vendors — do not block demo mailto fallback.

## Rollback

1. **CDN previous deploy** — promote last known-good deployment (Pages/Netlify one-click).
2. **Object storage** — re-upload previous `out/` artifact from CI artifact store.
3. **DNS** — keep TTL modest during soft launch (≤ 300s) so cutover reverses quickly.
4. **Content** — git tag each soft-launch build (`soft-launch-YYYY-MM-DD`); `git checkout` + rebuild if needed.
5. **Downloads** — versioned zip URLs are immutable; point `NEXT_PUBLIC_DL_*` back to prior release object, rebuild site.

## Soft-launch checklist

**Default soft launch ships with no public download links.**  
`example.com` (and non-HTTPS) hosts are not “live”: nav/footer/hero hide Download, primary CTA is **Request demo**, and `/download` shows an interim notice (no zip button). Wire real `NEXT_PUBLIC_DL_*` env vars to re-enable download CTAs without code changes.

- [ ] Claim registry signed by product claim approver (`content/claims.ts`)
- [ ] Media capturer named; pipeline stills at least placeholders reviewed
- [ ] Hold remains **play-only** unless scrub QA passed (`docs/PERF.md`)
- [ ] **No public download CTA** until real URLs + SHA-256 (not `example.com`) — or set `NEXT_PUBLIC_DL_*` when ready
- [ ] Demo mailto / Formspree production destination
- [ ] Privacy + terms legal review
- [ ] Security headers live on host
- [ ] HTTPS redirect + HSTS
- [ ] Smoke: `/` (hero → demo, no Download nav), `/source`, `/demo`, `/legal/privacy` (optional: `/download` interim page)
- [ ] Keyboard + reduced-motion smoke (`docs/PERF.md`)
- [ ] Optional: Lighthouse CI against preview URL (`lighthouserc.cjs`)
- [ ] Unlisted preview URL or design-partner share list (public DNS optional)

## Legal — craft reference note

Interaction patterns on this marketing site may be **inspired by public craft references** (scroll storytelling, hold-to-explore affordances, industrial dark UI rhythms). The site uses:

- No third-party 3D models, trademarks, or proprietary UI chrome from other products
- No Grok branding
- Product copy and claims owned by Anaglyph Studio (G) claim registry

Include in public legal copy if counsel requests:

> Interaction patterns inspired by public craft references; no third-party models, copy, or trademarks.

## DNS notes

| Mode | Action |
|------|--------|
| Soft launch | Preview host (`*.pages.dev` / Netlify draft) or unlisted custom subdomain |
| Public | Apex/www CNAME or ALIAS to CDN; certificate via host |
| Rollback | Lower TTL before cutover; keep previous deployment warm |

## Content freeze

After soft launch, treat marketing copy as frozen except:

1. Download URL / SHA / sizeHint updates (content release PR)
2. Critical claim or legal corrections
3. Media drop when capture milestone completes

Coordinate freezes with `CONTRIBUTING.md` owners.
