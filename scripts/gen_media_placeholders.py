"""Generate claim-safe industrial placeholder stills for marketing media."""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1] / "public" / "media"
(ROOT / "pipeline").mkdir(parents=True, exist_ok=True)
(ROOT / "hold").mkdir(parents=True, exist_ok=True)
(ROOT / "hero").mkdir(parents=True, exist_ok=True)

BG = (12, 14, 17)
PANEL = (20, 24, 30)
FRAME = (28, 34, 42)
ACCENT = (212, 146, 60)
ACCENT_HI = (230, 168, 82)
OK = (89, 184, 122)
MUTED = (154, 163, 176)
INK = (235, 238, 240)

W, H = 1280, 720


def font(size: int, bold: bool = False) -> ImageFont.ImageFont:
    candidates = [
        r"C:\Windows\Fonts\segoeuib.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\consola.ttf",
        r"C:\Windows\Fonts\arial.ttf",
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


F_TITLE = font(28, True)
F_MONO = font(16)
F_SM = font(14)
F_LG = font(42, True)


def base(title: str, subtitle: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    d.rectangle([32, 32, W - 32, H - 32], fill=PANEL, outline=(40, 46, 54), width=1)
    d.rectangle([32, 32, W - 32, 88], fill=FRAME)
    d.text((52, 48), "ANAGLYPH  ·  Studio (G)", fill=ACCENT, font=F_MONO)
    d.text((52, 110), title, fill=INK, font=F_LG)
    d.text((52, 168), subtitle, fill=MUTED, font=F_SM)
    d.rectangle([52, 200, 220, 203], fill=ACCENT)
    return im, d


def chrome_window(
    d: ImageDraw.ImageDraw, x: int, y: int, w: int, h: int, label: str
) -> None:
    d.rounded_rectangle(
        [x, y, x + w, y + h],
        radius=6,
        fill=FRAME,
        outline=(48, 54, 62),
        width=1,
    )
    d.rectangle([x, y, x + w, y + 28], fill=(16, 18, 22))
    d.ellipse([x + 10, y + 8, x + 20, y + 18], fill=(224, 92, 87))
    d.ellipse([x + 26, y + 8, x + 36, y + 18], fill=(224, 173, 90))
    d.ellipse([x + 42, y + 8, x + 52, y + 18], fill=(89, 184, 122))
    d.text((x + 64, y + 6), label, fill=MUTED, font=F_SM)


def setup() -> None:
    im, d = base("01  ·  Setup", "Case · tags · outline · landmarks or CMM")
    chrome_window(d, 52, 230, 560, 420, "Setup")
    fields = ["Case name", "Tags CSV", "Outline DXF", "Landmarks", "CMM CSV"]
    for i, label in enumerate(fields):
        y = 280 + i * 58
        d.rounded_rectangle(
            [72, y, 580, y + 42],
            radius=4,
            fill=BG,
            outline=(48, 54, 62),
            width=1,
        )
        d.text((88, y + 12), label, fill=MUTED, font=F_SM)
        if i < 3:
            d.text((400, y + 12), "loaded", fill=OK, font=F_SM)
    chrome_window(d, 650, 230, 560, 420, "Preview")
    pts = [(720, 520), (780, 360), (860, 420), (940, 300), (1040, 480), (1100, 400)]
    d.line(pts, fill=ACCENT, width=3)
    for x, y in pts[1:-1]:
        d.ellipse([x - 5, y - 5, x + 5, y + 5], fill=ACCENT_HI)
    d.text((720, 280), "OUTLINE", fill=ACCENT, font=F_MONO)
    im.save(ROOT / "pipeline" / "setup.png", optimize=True)


def tags() -> None:
    im, d = base("02  ·  Tags", "AprilTag sheets · ChArUco board · actual size print")
    chrome_window(d, 80, 240, 520, 400, "AprilTag sheet")
    ox, oy = 110, 290
    for r in range(4):
        for c in range(5):
            x = ox + c * 90
            y = oy + r * 80
            d.rectangle([x, y, x + 64, y + 64], fill=(0, 0, 0), outline=INK, width=1)
            for i in range(4):
                for j in range(4):
                    if (i + j + r + c) % 2 == 0:
                        d.rectangle(
                            [x + 8 + i * 12, y + 8 + j * 12, x + 18 + i * 12, y + 18 + j * 12],
                            fill=INK,
                        )
    chrome_window(d, 640, 240, 540, 400, "ChArUco board")
    ox, oy = 680, 300
    for r in range(5):
        for c in range(7):
            x = ox + c * 60
            y = oy + r * 55
            fill = (0, 0, 0) if (r + c) % 2 == 0 else INK
            d.rectangle([x, y, x + 52, y + 48], fill=fill)
    d.text((680, 260), "PRINT @ 100%", fill=ACCENT, font=F_MONO)
    im.save(ROOT / "pipeline" / "tags.png", optimize=True)


def camera_k() -> None:
    im, d = base("03  ·  Camera K", "Load K · Measure K · Scene K  ·  FOV is placeholder only")
    chrome_window(d, 80, 240, 540, 400, "Calibrate")
    rows = [
        ("fx", "1 245.2"),
        ("fy", "1 244.8"),
        ("cx", "640.1"),
        ("cy", "360.4"),
        ("rms", "0.42 px"),
    ]
    for i, (key, val) in enumerate(rows):
        y = 300 + i * 48
        d.text((110, y), key, fill=MUTED, font=F_MONO)
        d.text((280, y), val, fill=INK, font=F_MONO)
        d.rectangle([110, y + 28, 560, y + 29], fill=(40, 46, 54))
    chrome_window(d, 660, 240, 540, 400, "Board detect")
    d.rectangle([700, 300, 1140, 580], fill=BG, outline=ACCENT, width=2)
    corners = [(720, 320), (1120, 320), (1120, 560), (720, 560)]
    for i, (x, y) in enumerate(corners):
        d.line([(x, y), (x + 30 if i % 3 == 0 else x - 30, y)], fill=OK, width=3)
        d.line([(x, y), (x, y + 30 if i < 2 else y - 30)], fill=OK, width=3)
    d.text((840, 430), "MEASURE K", fill=ACCENT, font=F_TITLE)
    d.text((820, 480), "not FOV guess", fill=MUTED, font=F_SM)
    im.save(ROOT / "pipeline" / "camera-k.png", optimize=True)


def solve_cmm() -> None:
    im, d = base("04  ·  Solve / CMM", "Build · PnP  vs  Build · CMM")
    chrome_window(d, 60, 240, 560, 400, "Build · PnP")
    d.rectangle([90, 300, 580, 520], fill=BG, outline=(48, 54, 62), width=1)
    d.ellipse([220, 360, 420, 500], outline=ACCENT, width=2)
    d.line([(250, 480), (300, 360), (360, 440), (400, 380)], fill=OK, width=2)
    d.text((100, 540), "Capture · annotate · solve", fill=MUTED, font=F_SM)
    chrome_window(d, 660, 240, 560, 400, "Build · CMM")
    for i, row in enumerate(
        [
            "id,x,y,z",
            "0, 12.4, 0.2, 3.1",
            "1, 88.0, 0.1, 3.0",
            "2, 88.1, 54.2, 3.1",
            "3, 12.3, 54.0, 3.0",
        ]
    ):
        d.text((700, 310 + i * 36), row, fill=OK if i else MUTED, font=F_MONO)
    d.text((700, 520), "Skip photo · measured corners", fill=MUTED, font=F_SM)
    im.save(ROOT / "pipeline" / "solve-cmm.png", optimize=True)


def scene() -> None:
    im, d = base("05  ·  Scene", "Scene JSON · 3D preview · optional CMM compare")
    chrome_window(d, 60, 240, 500, 400, "scene.json")
    lines = [
        "{",
        '  "outline": "...",',
        '  "tags": [ ... ],',
        '  "K": { "fx": 1245 },',
        '  "method": "pnp"',
        "}",
    ]
    for i, line in enumerate(lines):
        d.text((90, 300 + i * 36), line, fill=INK if i not in (0, 5) else MUTED, font=F_MONO)
    chrome_window(d, 600, 240, 620, 400, "3D preview")
    cx, cy = 910, 460
    d.polygon(
        [(cx, cy - 120), (cx + 160, cy - 40), (cx + 160, cy + 80), (cx, cy + 20)],
        fill=(40, 48, 58),
        outline=ACCENT,
    )
    d.polygon(
        [(cx, cy - 120), (cx - 160, cy - 40), (cx - 160, cy + 80), (cx, cy + 20)],
        fill=(32, 38, 48),
        outline=ACCENT,
    )
    d.polygon(
        [(cx, cy + 20), (cx + 160, cy + 80), (cx, cy + 140), (cx - 160, cy + 80)],
        fill=(24, 28, 34),
        outline=ACCENT,
    )
    d.line([(cx - 80, cy), (cx + 80, cy - 40), (cx + 40, cy + 40)], fill=ACCENT_HI, width=2)
    im.save(ROOT / "pipeline" / "scene.png", optimize=True)


def track() -> None:
    im, d = base("06  ·  Track", "Live outline lock · err px · approx mm")
    chrome_window(d, 60, 230, 1160, 430, "Track feed")
    d.rectangle([90, 280, 1180, 620], fill=(18, 22, 28))
    d.ellipse([280, 340, 780, 580], fill=(45, 52, 62), outline=(70, 80, 95), width=2)
    outline = [
        (340, 500),
        (400, 380),
        (480, 420),
        (560, 340),
        (640, 430),
        (700, 390),
        (740, 500),
    ]
    d.line(outline + [outline[0]], fill=ACCENT_HI, width=3)
    for x, y in outline:
        d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=OK)
    d.rounded_rectangle(
        [920, 300, 1150, 420],
        radius=4,
        fill=(12, 14, 17),
        outline=ACCENT,
        width=1,
    )
    d.text((940, 320), "OUTLINE LOCK", fill=ACCENT, font=F_MONO)
    d.text((940, 355), "err   1.8 px", fill=OK, font=F_MONO)
    d.text((940, 385), "approx mm · depth est.", fill=MUTED, font=F_SM)
    im.save(ROOT / "pipeline" / "track.png", optimize=True)
    im.save(ROOT / "hold" / "track-poster.jpg", quality=90, optimize=True)
    im.save(ROOT / "hero" / "poster.jpg", quality=88, optimize=True)


def main() -> None:
    setup()
    tags()
    camera_k()
    solve_cmm()
    scene()
    track()
    for path in sorted((ROOT / "pipeline").glob("*.png")):
        print(f"{path.relative_to(ROOT.parent.parent)}  {path.stat().st_size}")
    poster = ROOT / "hold" / "track-poster.jpg"
    print(f"{poster.relative_to(ROOT.parent.parent)}  {poster.stat().st_size}")
    print("OK")


if __name__ == "__main__":
    main()
