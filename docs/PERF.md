# Performance & accessibility checklist — Anaglyph Studio (G)

Soft gates for soft launch. Full Lighthouse CI can be enabled later via `lighthouserc.cjs`.

## Split JS budgets (gzip, broadband mid laptop)

| Budget item | Target | Status |
|-------------|--------|--------|
| Framework baseline (React + Next client) | Measure & accept (~150–250 KB gzip) | Record on each release |
| App + motion incremental (page + GSAP after load) | **≤ 120 KB gzip** first interactive motion chunk | GSAP dynamic-imported in `lib/motion.ts` |
| Critical path before motion | Above-fold HTML + CSS + fonts + hero; **no GSAP** | PR3 readable-without-GSAP |
| Steady scroll FPS | ≥55–60 fps | Manual QA on iGPU |
| INP | ≤ 200 ms (rail, SWAP PATH, Hold Play) | Manual + Lighthouse |
| TBT (lab) | ≤ 300 ms mid throttle | Lighthouse CI (optional) |
| Above-fold media + fonts + CSS | ≤ ~500 KB compressed (mobile) | Poster-first; no autoplay Hold |

## Reduced motion

- `lib/motion.ts` listens to `prefers-reduced-motion` **and** `change` events.
- Reduced path: **no pins**, no scrub, rail = jump links, full static chapter stack.
- Hold: **Play/Pause only** — no press-and-hold keyboard trap (`HoldExplore`).
- Skip link + in-page `#chapter` anchors always in DOM.

## Focus & keyboard

- [x] Skip link (`.skip-link`) visible on focus
- [x] Primary nav / footer / section links use `focus-visible` outline (accent)
- [x] Path diagram: tablist + SWAP PATH; arrows cycle workflows
- [x] Pipeline rail: `aria-current` on active chapter; anchors always available
- [x] Demo form: labelled fields, submit status `role="status"` / `role="alert"`
- [x] Global focus-visible utility in `globals.css` for interactive elements without explicit classes

## Hold residual risk (play-only)

| Risk | Mitigation |
|------|------------|
| Scrub media not produced | `NEXT_PUBLIC_ENABLE_HOLD_EXPLORE` default off; `HOLD_MODE=play-only` |
| Decoder thrash if scrub enabled without dense KF | Encode contract in `public/media/README.md`; FPS QA gate before enabling scrub |
| Scroll accidentally driving video | Contract: only `HoldExplore` seeks; `motion.ts` never assigns `currentTime` |
| Mobile hold-vs-scroll conflict | Mobile stays play-only; no touch capture for scrub until QA |

**Soft launch:** ship with Hold **play-only**. Revisit scrub after media milestone + mid-laptop QA (≥55 fps, long tasks &lt;50 ms).

## Lighthouse (optional CI)

Stub config: `lighthouserc.cjs` at repo root.

```bash
# After npm run build
npx --yes @lhci/cli autorun --config=lighthouserc.cjs
```

Do not block merge on LHCI until budgets are baselined on the soft-launch URL.

## Manual a11y smoke

1. Keyboard-only: skip → nav → pipeline rail → SWAP PATH → Hold Play → demo form.
2. OS reduced motion on: no pin sticky scrub; content fully readable.
3. Zoom 200%: no critical overflow on hero / paths SVG (horizontal scroll OK for diagram).
4. Contrast: graphite/amber tokens on dark background.

## Release log (fill per soft launch)

| Date | Framework FL JS | Home route size | Notes |
|------|-----------------|-----------------|-------|
| _TBD_ | ~103 KB shared (Next 15.5) | see `next build` | Hold play-only |
