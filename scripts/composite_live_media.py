"""Composite real mould photos / video frames into Studio G UI chrome captures."""
from __future__ import annotations

from pathlib import Path

import cv2
from PIL import Image, ImageDraw, ImageEnhance, ImageFont

RAW = Path(r"C:\dev\pkg-dev\anaglyph-studio-g-web\public\media\_raw_captures")
PIPE = Path(r"C:\dev\pkg-dev\anaglyph-studio-g-web\public\media\pipeline")
HOLD = Path(r"C:\dev\pkg-dev\anaglyph-studio-g-web\public\media\hold")
HERO = Path(r"C:\dev\pkg-dev\anaglyph-studio-g-web\public\media\hero")
PHOTO = Path(
    r"C:\dev\grok\Anaglyph Studio (source) - grok\output\studio_grok\my_mould\pnp_test\photos\view_1.png"
)
VIDEO = Path(r"C:\temp\test_paper.mp4")


def fit_cover(img: Image.Image, tw: int, th: int) -> Image.Image:
    scale = max(tw / img.width, th / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left, top = (nw - tw) // 2, (nh - th) // 2
    return resized.crop((left, top, left + tw, top + th))


def extract_video_frame() -> Image.Image | None:
    if not VIDEO.is_file():
        return None
    cap = cv2.VideoCapture(str(VIDEO))
    n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    if n > 10:
        cap.set(cv2.CAP_PROP_POS_FRAMES, n // 3)
    ok, frame = cap.read()
    cap.release()
    if not ok or frame is None:
        return None
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    img = Image.fromarray(rgb)
    img.save(RAW / "video_frame.png")
    return img


def paste_into_dark_panel(
    chrome_path: Path,
    content: Image.Image,
    out_path: Path,
    min_dark: int = 28,
) -> Image.Image:
    chrome = Image.open(chrome_path).convert("RGB")
    w, h = chrome.size
    gray = chrome.convert("L")
    pix = gray.load()
    best = None
    step = 8
    for y0 in range(100, h // 2, step):
        for x0 in range(10, w // 3, step):
            x1 = x0
            while x1 < w - 10 and pix[min(x1 + step, w - 1), y0] < min_dark + 15:
                x1 += step
            y1 = y0
            while y1 < h - 10 and pix[x0, min(y1 + step, h - 1)] < min_dark + 15:
                y1 += step
            area = (x1 - x0) * (y1 - y0)
            if area > 200_000 and (best is None or area > best[0]):
                crop = gray.crop((x0, y0, x1, y1))
                if sum(crop.resize((32, 32)).getdata()) / (32 * 32) < 40:
                    best = (area, x0, y0, x1, y1)
    if best is None:
        box = (24, 280, w - 24, h - 40)
    else:
        box = best[1:]
        print(f"panel {chrome_path.name} {box} area={best[0]}")
    x0, y0, x1, y1 = box
    tw, th = max(1, x1 - x0), max(1, y1 - y0)
    filled = fit_cover(content.convert("RGB"), tw, th)
    out = chrome.copy()
    out.paste(filled, (x0, y0))
    draw = ImageDraw.Draw(out)
    draw.rectangle([x0, y0, x1 - 1, y1 - 1], outline=(212, 146, 60), width=1)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out.save(out_path, "PNG", optimize=True)
    print(f"wrote {out_path} ({out_path.stat().st_size})")
    return out


def make_track_overlay(mould: Image.Image) -> Image.Image:
    tb = ImageEnhance.Contrast(mould.convert("RGB")).enhance(1.08)
    draw = ImageDraw.Draw(tb)
    try:
        font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 28)
        font_sm = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
    except OSError:
        font = ImageFont.load_default()
        font_sm = font
    w, h = tb.size
    hx, hy = w - 340, 40
    draw.rounded_rectangle(
        [hx, hy, w - 30, hy + 130],
        radius=6,
        fill=(12, 14, 17),
        outline=(212, 146, 60),
        width=2,
    )
    draw.text((hx + 18, hy + 16), "OUTLINE LOCK", fill=(212, 146, 60), font=font_sm)
    draw.text((hx + 18, hy + 52), "err   1.8 px", fill=(89, 184, 122), font=font)
    draw.text((hx + 18, hy + 90), "live tags 4", fill=(154, 163, 176), font=font_sm)
    cx, cy = w // 2, int(h * 0.55)
    pts = [
        (cx - 220, cy + 80),
        (cx - 120, cy - 120),
        (cx + 40, cy - 40),
        (cx + 160, cy - 140),
        (cx + 260, cy + 20),
        (cx + 180, cy + 160),
        (cx - 80, cy + 140),
    ]
    draw.line(pts + [pts[0]], fill=(230, 168, 82), width=4)
    for p in pts:
        draw.ellipse([p[0] - 5, p[1] - 5, p[0] + 5, p[1] + 5], fill=(89, 184, 122))
    tb.save(RAW / "track_overlay.png")
    return tb


def export(src: Path | Image.Image, dest: Path, size: tuple[int, int] = (1280, 720)) -> None:
    im = src if isinstance(src, Image.Image) else Image.open(src)
    out = fit_cover(im.convert("RGB"), size[0], size[1])
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.suffix.lower() in {".jpg", ".jpeg"}:
        out.save(dest, "JPEG", quality=90, optimize=True)
    else:
        out.save(dest, "PNG", optimize=True)
    print(f"export {dest.name} {dest.stat().st_size}")


def main() -> None:
    mould = Image.open(PHOTO).convert("RGB")
    frame = extract_video_frame()
    cam_src = frame if frame is not None else mould

    paste_into_dark_panel(RAW / "camera-k.png", cam_src, RAW / "camera-k_live.png")
    track_content = make_track_overlay(mould)
    paste_into_dark_panel(RAW / "track.png", track_content, RAW / "track_live.png")

    export(RAW / "camera-k_live.png", PIPE / "camera-k.png")
    export(RAW / "track_live.png", PIPE / "track.png")
    export(RAW / "track_live.png", HOLD / "track-poster.jpg")
    export(RAW / "track_live.png", HERO / "poster.jpg")
    # Pure photo for video gen base
    export(mould, HOLD / "track-poster-source.jpg")
    print("COMPOSITE OK")


if __name__ == "__main__":
    main()
