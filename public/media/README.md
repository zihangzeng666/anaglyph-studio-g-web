# Marketing media encode recipes

Assets for the Anaglyph Studio (G) marketing site. **Do not commit multi-ten-MB zips** here — only optimized stills and short scrub loops.

## Directory layout

```text
public/media/
  hero/           # poster + optional muted loop
  pipeline/       # per-chapter stills (setup.png … track.png)
  hold/           # scrub-encoded 720p dual format + poster
  ui/             # Studio G screenshots
  print/          # tag sheet / board crops
```

## Hold scrub contract (required for HOLD_MODE=scrub)

| Parameter | Requirement |
|-----------|-------------|
| Clip length | 3–6 s (sweet spot ~4 s) |
| Resolution | **1280×720** max for scrub asset |
| Dual encode | WebM (VP9) + MP4 (H.264) |
| Keyframes | Interval **≤ 0.25 s** (or all-intra for short clips) |
| Poster | 1920×1080 WebP/AVIF or JPG |
| Runtime | rAF-throttled seek; ignore while `video.seeking` |
| Fallback | If FPS/jank QA fails → play-only + `NEXT_PUBLIC_ENABLE_HOLD_EXPLORE=0` |

Scroll **never** drives the Hold video. Only pointer/keyboard hold (or Play).

## ffmpeg examples

Assume source capture `track-source.mp4` (real Studio G Track session, bicycle example).

### Scrub MP4 (H.264, dense keyframes)

```bash
ffmpeg -y -i track-source.mp4 \
  -an -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -g 15 -keyint_min 15 -sc_threshold 0 \
  -b:v 2M -maxrate 2.5M -bufsize 4M \
  -movflags +faststart \
  public/media/hold/track-scrub.mp4
```

### Scrub WebM (VP9)

```bash
ffmpeg -y -i track-source.mp4 \
  -an -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libvpx-vp9 -b:v 1.5M -g 15 -keyint_min 15 \
  -row-mt 1 \
  public/media/hold/track-scrub.webm
```

### All-intra short hero (optional, best seek quality)

```bash
ffmpeg -y -i track-source.mp4 -t 4 -an \
  -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -g 1 -keyint_min 1 -bf 0 -pix_fmt yuv420p \
  -movflags +faststart \
  public/media/hold/track-scrub-intra.mp4
```

### Poster frame

```bash
ffmpeg -y -ss 00:00:01 -i track-source.mp4 -frames:v 1 -q:v 2 \
  public/media/hold/track-poster.jpg
```

## Feature flags

| Env | Default | Effect |
|-----|---------|--------|
| `NEXT_PUBLIC_ENABLE_HOLD_EXPLORE` | `false` / unset | Master switch for scrub UI |
| `NEXT_PUBLIC_HOLD_MODE` | `play-only` | `play-only` \| `scrub` |

Until assets land and mid-laptop QA passes (≥55 fps scrub, long tasks &lt;50 ms), ship **play-only**.

## Pipeline stills (live captures 2026-07-18)

| Path | Source |
|------|--------|
| `pipeline/setup.png` | Setup · Build · PnP (case, tags, bicycle outline) |
| `pipeline/tags.png` | Same Setup UI (AprilTag table + size_mm) |
| `pipeline/camera-k.png` | Capture · live webcam 1280×720 |
| `pipeline/solve-cmm.png` | PnP solve result (tags + outline) |
| `pipeline/scene.png` | Scene · 3D outline + landmarks |
| `pipeline/track.png` | Track · live camera ready |
| `hold/track-poster.png` | Capture still |
| `hero/poster.png` | Hero still |
| `ui/home.png` | Home · Build · CMM |

### Capture from Studio G (scripted)

```powershell
# Rebuild Studio G if src changed, then:
python scripts/capture_studio_g_shots.py
python scripts/composite_live_media.py   # fills Camera/Track feed when OpenCV lacks MP4
```

Startup hooks (Studio G binary):

| Env / file | Effect |
|------------|--------|
| `ANAGLYPH_STUDIO_PAGE` | 0–7 page enum |
| `ANAGLYPH_STUDIO_WORKFLOW` | 0–3 workflow |
| `ANAGLYPH_STUDIO_LOAD_SCENE` | path to `*_scene.json` |
| `output/.marketing_start_capture` | start video/webcam feed |

Prefer WebP/AVIF for production; PNG OK during soft launch.
