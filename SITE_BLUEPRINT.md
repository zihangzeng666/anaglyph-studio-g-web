# Studio G Site Blueprint (working copy)

> **This file is the collaboration interface between you and Claude.**
> Edit it directly (change text, mark statuses, add sections), save, hand it back,
> and say "**update the site from the blueprint**" — Claude does the code, cropping,
> encoding, and wiring. You never need to touch code.

---

## How to use it (three kinds of edits)

| You want to | How |
|---|---|
| **Change wording** | Edit the copy in "Per-section copy" below. Edit the English directly, or write what you mean in any language — Claude writes the final English |
| **Replace / add media** | Find the slot in the "Media slots" table, drop your file into `media-inbox/` using the **exact inbox filename**, then mark that row 🔁 |
| **Change structure** | Reorder or delete rows in "Page overview", or fill in the "Add-new template" |

**Status legend**:
✅ asset is good · 🟡 temporary / has issues, replace · ⬜ missing, no asset yet · 🔁 I dropped a new file in media-inbox (you mark this) · ✏️ I edited the text (you mark this)

---

## 1 · Page overview (top-to-bottom order, reorderable)

| # | Section ID | What it is | Media | Your notes |
|---|---|---|---|---|
| 1 | `hero` | Opening screen: tagline "Lock the outline." + two buttons | ⬜ decorative line art only, no real imagery | |
| 2 | `problem` | "Same pipeline, new shell": old CLI list vs Studio G step strip | none (text cards) | |
| 3 | `paths` | Interactive diagram of the three workflows (Load · track / Build · PnP / Build · CMM) | none (interactive SVG) | |
| 4 | `pipeline` | **Six-chapter story** (the heart of the site): Setup → Tags → Camera K → Solve/CMM → Scene → Track | 6 image slots, see below | |
| 5 | `hold` | Live-tracking demo video (auto-looping) | 1 video slot + 1 poster slot | |
| 6 | `specs` | Spec grid (platform, vision stack, cameras…) | none | |
| 7 | `printables` | Printable tag stickers + ChArUco board | 🟡 placeholder icons now; 2 photo slots possible | |
| 8 | `cameras` | Camera support (IC4 / webcam / video file / Spinnaker) | ⬜ could take 1 real photo | |
| 9 | `cta` | Call to action: request demo / get source | none | |
| 10 | `footer` | Footer | none | |

---

## 2 · Media slots ★ shoot against this table

> **Inbox filename = the name you save the file as.** Drop it into `media-inbox/`, done.
> What each frame must contain is detailed in `media-inbox/README.md`.

### P0 — do these three first, biggest impact

| Inbox filename | Used where | What's needed | Current state |
|---|---|---|---|
| `hold-track-loop.mp4` | hold video | **Screen recording**, 10–25 s: Track page, outline locked, steady frame | 🔴 **replace first** — the current clip isn't even the mould: it autoplays showing a room interior (old capture experiment). Also 720p only, webm missing |
| `hero-shot.png` | hero visual | **Screenshot or photo**: the single most representative frame — a clean shot of the outline locked on the mould (if it comes out well, also record `hero-loop.mp4`) | 🟡 hero now uses a darkened crop of the live-track photo (`public/media/hero/track-hero.jpg`, auto-cropped from `pipeline/track.png` — hand + UI sidebar removed) as its background. Works well; a purpose-shot `hero-shot.png` would still be an upgrade and drops straight in |
| `pipeline-track.png` | Chapter 6 · Track | **Screenshot**: Track page full window, locked, err readout visible | 🟡 same messy work-session grab, needs a reshoot |

### P1 — fix mismatches and visible flaws

| Inbox filename | Used where | What's needed | Current state |
|---|---|---|---|
| `pipeline-camera-k.png` | Chapter 3 · Camera K | **Screenshot**: Calibrate page (Measure K / Load K UI), ideally mid-calibration | 🟡 currently shows the Start screen — off-topic for the chapter |
| `pipeline-tags.png` | Chapter 2 · Tags | **Screenshot or photo**: the tag sheet page. White background is OK, but the current one has `??` glyph artifacts; a photo of the printed stickers would be even better | 🟡 white glare + broken glyphs |
| `print-sheet-photo.jpg` | printables, left card | **Photo**: printed AprilTag stickers (cut out / applied to the mould) | ⬜ placeholder icon now |
| `print-board-photo.jpg` | printables, right card | **Photo**: printed ChArUco board, in hand or flat on the bench | ⬜ placeholder icon now |
| `og-image.png` | social share card | **One 1200×630 image**: what shows when the site is shared on X / LINE / WeChat (Claude can crop it from hero-shot) | ⬜ none at all — shares have no image |

### P2 — fine as-is, upgrade when convenient

| Inbox filename | Used where | What's needed | Current state |
|---|---|---|---|
| `pipeline-setup.png` | Chapter 1 · Setup | Setup page full window (case, tag table, outline) | ✅ real capture, good |
| `pipeline-solve-cmm.png` | Chapter 4 · Solve/CMM | PnP solve result page (per-tag reproj numbers) | ✅ real capture, good |
| `pipeline-scene.png` | Chapter 5 · Scene | 3D scene preview (outline + L1–L7) | ✅ real capture, good (a bit empty — a fuller angle would help) |
| `camera-rig-photo.jpg` | cameras section | **Photo**: the actual rig — IC4 or webcam aimed at the mould | ⬜ text-only now; a real photo adds credibility |

### Orphan files — archived (cleanup 2026-07-18)

Five files nothing on the site referenced were moved to `media-inbox/_archive/`:
`solve-pnp-result.png`, `home.png`, `home-start.png`, `hero-poster-old.png` (the messy work grab), `track-poster-source.jpg`.
Still on disk — tell Claude to restore any of them.

---

## 3 · Per-section copy (edit freely)

> How: edit the quoted English directly, or write what you mean in the ✏️ field — any language.

### 1 · hero

> Tagline: **Lock the outline.**
> Lead: An industrial desktop console for mould setup and live AR outline tracking. Build the scene from photos or CMM corners — or load one you trust and go straight to track.
> Buttons: Request a demo / Explore the pipeline / Build notes

✏️ Changes:

### 2 · problem — "same pipeline, new shell"

> Title: One Studio for the steps you already know
> Key line: The solver, the CMM corners, the live outline lock — same stack, same author. What changed is how you drive it.

✏️ Changes:

### 3 · paths

> Title: Pick a workflow. Follow the strip.

✏️ Changes:

### 4 · pipeline — six chapters (each = title + body + image + caption)

| Ch | Title | Body (editable) | Caption (editable) |
|---|---|---|---|
| 01 | Setup | Every job starts as a case. Name it, list the tags (id + size_mm), load the CAD outline, then attach landmarks for PnP — or a CMM CSV of measured corners. | Case my_mould in Setup — tags, landmarks, and the bicycle outline, ready for Build · PnP. |
| 02 | Tags | Print AprilTag sticker sheets and a ChArUco board at actual size — 100% scale, never fit-to-page — so the markers on the mould measure exactly what the case says they do. | One sheet, IDs 1–5 at 25–30 mm — printed at 100%, applied straight to the mould. |
| 03 | Camera K | Real intrinsics come from Load K or Measure K; a saved scene can carry its own. The FOV guess stays what it says it is — a placeholder, not a real calibration. | The Start screen — open a saved scene, or take the camera path into Build · PnP. |
| 04 | Solve / CMM | Here the paths part. Build · PnP shoots the mould, annotates landmarks, and solves multi-view PnP; Build · CMM skips photo capture entirely and builds from measured tag corners. | A solve, landed — the outline over its landmarks, per-tag reprojection in the margin. |
| 05 | Scene | One scene JSON carries the outline, tags, and intrinsics — turn it over in 3D before you commit. CMM compare checks against measured ground truth; a check, not a live accuracy certificate. | The scene in 3D — outline, axes, landmarks L1–L7 — one last look before tracking. |
| 06 | Track | Tags found, outline locked — live on the mould. Error reads as reprojection in pixels; approx mm at estimated depth is there when you want it, and it says approx. | Live on the carbon mould — outline locked, tag in view. |

✏️ Changes:

### 5 · hold — tracking video

> Title: Tracking, frame by frame
> Side copy: Point the camera at the mould and the overlay settles where the CAD says it should. What you see here is what the operator sees on Track — tags in, outline on.

✏️ Changes:

### 6–10 · specs / printables / cameras / cta / footer

> These sections are mostly fixed copy (specs, downloads, legal). To change a line, paste the original below and write what you want instead.

✏️ Changes:

---

## 4 · Add-new template (copy a block and fill it in)

```
[New section]
Goes between which two sections:
What it should say (any language):
Assets needed (screenshot? photo? video?):

[New media slot]
In which section:
What the frame shows:
Filename I'll use in media-inbox:
```

---

## 5 · Hand-back routine (always the same three steps)

1. Edit this file, save
2. Drop new assets into `media-inbox/` under the exact filenames
3. Tell Claude: "**update the site from the blueprint**" (中文也可以：按結構表更新網站)

Claude then: crops/encodes assets → wires them in → applies copy edits → runs the tests → reports which slots are still open.

*Compiled 2026-07-18 · site state as of this date*
