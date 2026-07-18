"""Capture real Anaglyph Studio (G) window screenshots for marketing media."""
from __future__ import annotations

import ctypes
import json
import os
import shutil
import subprocess
import sys
import time
from ctypes import wintypes
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

STUDIO_ROOT = Path(r"C:\dev\grok\Anaglyph Studio (source) - grok")
EXE = STUDIO_ROOT / "bin" / "anaglyph_studio_g.exe"
SESSION = STUDIO_ROOT / "output" / "session.json"
WEB_MEDIA = Path(r"C:\dev\pkg-dev\anaglyph-studio-g-web\public\media")
RAW = WEB_MEDIA / "_raw_captures"
PIPELINE = WEB_MEDIA / "pipeline"
HOLD = WEB_MEDIA / "hold"
HERO = WEB_MEDIA / "hero"

# Prefer a short path without spaces/parens (OpenCV reliability).
VIDEO = Path(r"C:\temp\test_paper.mp4")
if not VIDEO.is_file():
    VIDEO = Path(
        r"C:\dev\grok\Anaglyph Studio (source) - grok\output\videos\test_paper.mp4"
    )
if not VIDEO.is_file():
    VIDEO = Path(
        r"C:\Users\zihan\OneDrive\Desktop\Anaglyph 3.0\Anaglyph3.0\output\videos\test_paper.mp4"
    )
SCENE = STUDIO_ROOT / "output" / "studio_grok" / "scenes" / "my_mould_scene.json"
CALIB = STUDIO_ROOT / "output" / "studio_grok" / "camera_intrinsics.json"
ANNOTATE = (
    STUDIO_ROOT
    / "output"
    / "studio_grok"
    / "my_mould"
    / "pnp_test"
    / "photos"
    / "view_1.png"
)
TAG_SHEET = STUDIO_ROOT / "output" / "sheets" / "print_mould_tags_A4.png"
CHARUCO = STUDIO_ROOT / "output" / "sheets" / "charuco_board.png"
CASE_TAGS = STUDIO_ROOT / "output" / "tags" / "my_mould" / "case_tags.png"

user32 = ctypes.windll.user32
gdi32 = ctypes.windll.gdi32

PW_RENDERFULLCONTENT = 2
SW_MAXIMIZE = 3
SRCCOPY = 0x00CC0020


class RECT(ctypes.Structure):
    _fields_ = [
        ("left", ctypes.c_long),
        ("top", ctypes.c_long),
        ("right", ctypes.c_long),
        ("bottom", ctypes.c_long),
    ]


def write_session(
    page: int,
    workflow: int = 2,
    source: int = 1,
    scene_choice: int = 0,
    *,
    include_calib: bool = True,
) -> None:
    session = {
        "kind": "anaglyph_studio_g_session",
        "version": 2,
        "case_name": "my_mould",
        "workflow": workflow,
        "home_scene_path": str(SCENE) if SCENE.is_file() else "",
        "home_build_method": 0,
        "outline_paths": ["examples/bicycle/outline.txt"],
        "landmarks_path": "examples/bicycle/landmarks.csv",
        "cmm_path": "examples/bicycle/cmm_reference.csv",
        "out_dir": "output",
        "landmarks": [
            {"label": "L1", "x": 3.04, "y": -15.44, "z": -47.4},
            {"label": "L2", "x": -30.0, "y": 0.68, "z": -261.38},
            {"label": "L3", "x": 175.52, "y": -0.69, "z": -195.98},
            {"label": "L4", "x": -39.1, "y": 12.8, "z": -66.0},
            {"label": "L5", "x": 62.3, "y": -12.8, "z": -60.0},
            {"label": "L6", "x": 274.4, "y": -7.7, "z": -201.4},
            {"label": "L7", "x": -170.0, "y": -9.2, "z": -300.9},
        ],
        "tags": [
            {"id": 1, "size_mm": 25.0},
            {"id": 2, "size_mm": 25.0},
            {"id": 3, "size_mm": 25.0},
            {"id": 4, "size_mm": 25.0},
        ],
        "dictionary_index": 0,
        "camera": {
            "source": source,
            "index": 0,
            "resolution": 1,
            "serial": "",
            "video_path": str(VIDEO) if VIDEO.is_file() else "",
            "calib_path": str(CALIB) if (include_calib and CALIB.is_file()) else "",
        },
        "solver": {"max_reproj_px": 6.4, "bundle_adjust": True},
        "cmm_tolerances": {
            "side_pct": 6.0,
            "diagonal_pct": 5.2,
            "angle_deg": 5.0,
            "planarity_mm": 1.08,
        },
        "scene_source": {"choice": scene_choice, "chosen": True},
        "page": page,
        "accent_theme": 0,
    }
    SESSION.parent.mkdir(parents=True, exist_ok=True)
    SESSION.write_text(json.dumps(session, indent=2), encoding="utf-8")


def kill_studio() -> None:
    subprocess.run(
        ["taskkill", "/F", "/IM", "anaglyph_studio_g.exe"],
        capture_output=True,
        text=True,
    )
    time.sleep(0.4)


def find_hwnd(pid: int, timeout: float = 20.0) -> int:
    deadline = time.time() + timeout
    while time.time() < deadline:
        hwnds: list[int] = []

        @ctypes.WINFUNCTYPE(ctypes.c_bool, wintypes.HWND, wintypes.LPARAM)
        def enum_proc(hwnd, _lparam):
            if not user32.IsWindowVisible(hwnd):
                return True
            pid_out = wintypes.DWORD()
            user32.GetWindowThreadProcessId(hwnd, ctypes.byref(pid_out))
            if pid_out.value == pid:
                length = user32.GetWindowTextLengthW(hwnd)
                if length > 0:
                    buf = ctypes.create_unicode_buffer(length + 1)
                    user32.GetWindowTextW(hwnd, buf, length + 1)
                    if "Anaglyph" in buf.value or "Studio" in buf.value:
                        hwnds.append(int(hwnd))
            return True

        user32.EnumWindows(enum_proc, 0)
        if hwnds:
            return hwnds[0]
        time.sleep(0.25)
    raise RuntimeError(f"No window for pid {pid}")


def capture_window(hwnd: int, out_path: Path) -> None:
    user32.ShowWindow(hwnd, SW_MAXIMIZE)
    time.sleep(0.3)
    user32.SetForegroundWindow(hwnd)
    rect = RECT()
    if not user32.GetWindowRect(hwnd, ctypes.byref(rect)):
        raise RuntimeError("GetWindowRect failed")
    w = max(1, rect.right - rect.left)
    h = max(1, rect.bottom - rect.top)

    hwnd_dc = user32.GetWindowDC(hwnd)
    mem_dc = gdi32.CreateCompatibleDC(hwnd_dc)
    bmp = gdi32.CreateCompatibleBitmap(hwnd_dc, w, h)
    old = gdi32.SelectObject(mem_dc, bmp)

    ok = user32.PrintWindow(hwnd, mem_dc, PW_RENDERFULLCONTENT)
    if not ok:
        # Fallback: BitBlt from screen
        screen_dc = user32.GetDC(0)
        gdi32.BitBlt(mem_dc, 0, 0, w, h, screen_dc, rect.left, rect.top, SRCCOPY)
        user32.ReleaseDC(0, screen_dc)

    # BITMAPINFO for 32bpp
    class BITMAPINFOHEADER(ctypes.Structure):
        _fields_ = [
            ("biSize", wintypes.DWORD),
            ("biWidth", ctypes.c_long),
            ("biHeight", ctypes.c_long),
            ("biPlanes", wintypes.WORD),
            ("biBitCount", wintypes.WORD),
            ("biCompression", wintypes.DWORD),
            ("biSizeImage", wintypes.DWORD),
            ("biXPelsPerMeter", ctypes.c_long),
            ("biYPelsPerMeter", ctypes.c_long),
            ("biClrUsed", wintypes.DWORD),
            ("biClrImportant", wintypes.DWORD),
        ]

    class BITMAPINFO(ctypes.Structure):
        _fields_ = [("bmiHeader", BITMAPINFOHEADER), ("bmiColors", wintypes.DWORD * 3)]

    bmi = BITMAPINFO()
    bmi.bmiHeader.biSize = ctypes.sizeof(BITMAPINFOHEADER)
    bmi.bmiHeader.biWidth = w
    bmi.bmiHeader.biHeight = -h  # top-down
    bmi.bmiHeader.biPlanes = 1
    bmi.bmiHeader.biBitCount = 32
    bmi.bmiHeader.biCompression = 0

    buf = (ctypes.c_ubyte * (w * h * 4))()
    gdi32.GetDIBits(mem_dc, bmp, 0, h, buf, ctypes.byref(bmi), 0)

    gdi32.SelectObject(mem_dc, old)
    gdi32.DeleteObject(bmp)
    gdi32.DeleteDC(mem_dc)
    user32.ReleaseDC(hwnd, hwnd_dc)

    img = Image.frombuffer("RGBA", (w, h), bytes(buf), "raw", "BGRA", 0, 1)
    # Drop fully-black capture failures
    extrema = img.convert("L").getextrema()
    if extrema == (0, 0):
        raise RuntimeError("Captured black frame — PrintWindow/BitBlt failed")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "PNG", optimize=True)
    print(f"  saved {out_path} ({out_path.stat().st_size} bytes) {w}x{h}")


def shot(
    name: str,
    page: int,
    workflow: int = 2,
    source: int = 1,
    scene_choice: int = 0,
    load_scene: bool = False,
    start_capture: bool = False,
    annotate: Path | None = None,
    include_calib: bool = True,
    warmup: float = 3.0,
) -> Path:
    kill_studio()
    write_session(
        page,
        workflow,
        source,
        scene_choice,
        include_calib=include_calib,
    )

    flag = STUDIO_ROOT / "output" / ".marketing_start_capture"
    if start_capture:
        flag.parent.mkdir(parents=True, exist_ok=True)
        flag.write_text("1", encoding="utf-8")
    elif flag.exists():
        flag.unlink()

    env = os.environ.copy()
    env["ANAGLYPH_STUDIO_PAGE"] = str(page)
    env["ANAGLYPH_STUDIO_WORKFLOW"] = str(workflow)
    if load_scene and SCENE.is_file():
        env["ANAGLYPH_STUDIO_LOAD_SCENE"] = str(SCENE)
    else:
        env.pop("ANAGLYPH_STUDIO_LOAD_SCENE", None)
    if start_capture:
        env["ANAGLYPH_STUDIO_START_CAPTURE"] = "1"
    else:
        env.pop("ANAGLYPH_STUDIO_START_CAPTURE", None)
    if annotate and annotate.is_file():
        env["ANAGLYPH_STUDIO_ANNOTATE_IMG"] = str(annotate)
    else:
        env.pop("ANAGLYPH_STUDIO_ANNOTATE_IMG", None)

    print(
        f"=== {name} page={page} workflow={workflow} "
        f"load_scene={load_scene} capture={start_capture} ==="
    )
    proc = subprocess.Popen([str(EXE)], cwd=str(STUDIO_ROOT), env=env)
    try:
        hwnd = find_hwnd(proc.pid)
        time.sleep(warmup)
        out = RAW / f"{name}.png"
        capture_window(hwnd, out)
        return out
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except subprocess.TimeoutExpired:
            proc.kill()
        kill_studio()
        flag = STUDIO_ROOT / "output" / ".marketing_start_capture"
        if flag.exists():
            flag.unlink()


def fit_cover(img: Image.Image, tw: int, th: int) -> Image.Image:
    scale = max(tw / img.width, th / img.height)
    nw, nh = int(img.width * scale), int(img.height * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = (nh - th) // 2
    return resized.crop((left, top, left + tw, top + th))


def export_web(src: Path, dest: Path, size: tuple[int, int] = (1280, 720)) -> None:
    img = Image.open(src).convert("RGB")
    # Prefer content area: slight crop of window chrome if very large
    w, h = img.size
    if w > 100 and h > 100:
        # trim 1px borders that PrintWindow sometimes adds
        img = img.crop((1, 1, w - 1, h - 1))
    out = fit_cover(img, size[0], size[1])
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.suffix.lower() in {".jpg", ".jpeg"}:
        out.save(dest, "JPEG", quality=90, optimize=True)
    else:
        out.save(dest, "PNG", optimize=True)
    print(f"  web {dest.name} <- {src.name} ({dest.stat().st_size} bytes)")


def make_tags_composite() -> Path:
    """Real print assets side-by-side for the Tags chapter."""
    canvas = Image.new("RGB", (1280, 720), (12, 14, 17))
    draw = ImageDraw.Draw(canvas)
    try:
        font = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", 18)
        title = ImageFont.truetype(r"C:\Windows\Fonts\segoeuib.ttf", 28)
    except OSError:
        font = ImageFont.load_default()
        title = font
    draw.text((40, 28), "Anaglyph Studio (G)  ·  Print at 100%", fill=(212, 146, 60), font=font)
    draw.text((40, 58), "AprilTag sheets + ChArUco board", fill=(235, 238, 240), font=title)

    assets = []
    for p in (CASE_TAGS, TAG_SHEET, CHARUCO):
        if p.is_file():
            assets.append(p)
    if not assets:
        raise RuntimeError("No tag sheet PNGs found under output/")

    slot_w = (1280 - 80 - 20 * (len(assets) - 1)) // len(assets)
    slot_h = 560
    x = 40
    for p in assets:
        im = Image.open(p).convert("RGB")
        thumb = fit_cover(im, slot_w, slot_h - 40)
        canvas.paste(thumb, (x, 110))
        draw.rectangle([x, 110, x + slot_w, 110 + slot_h - 40], outline=(48, 54, 62), width=1)
        draw.text((x, 110 + slot_h - 30), p.name, fill=(154, 163, 176), font=font)
        x += slot_w + 20

    out = RAW / "tags.png"
    canvas.save(out, "PNG", optimize=True)
    print(f"  tags composite {out} ({out.stat().st_size} bytes)")
    return out


def main() -> int:
    if not EXE.is_file():
        print("Missing exe", EXE, file=sys.stderr)
        return 1

    RAW.mkdir(parents=True, exist_ok=True)
    PIPELINE.mkdir(parents=True, exist_ok=True)
    HOLD.mkdir(parents=True, exist_ok=True)
    HERO.mkdir(parents=True, exist_ok=True)

    backup = SESSION.with_suffix(".json.pre_capture.bak")
    if SESSION.is_file():
        shutil.copy2(SESSION, backup)

    try:
        setup = shot("setup", page=0, workflow=2, source=1, warmup=2.5)
        # Camera page with video feed + no preloaded K so Measure/Load K UI shows.
        camera = shot(
            "camera-k",
            page=1,
            workflow=2,
            source=1,
            start_capture=True,
            include_calib=False,
            warmup=4.0,
        )
        solve = shot(
            "solve-cmm",
            page=3,
            workflow=2,
            source=1,
            annotate=ANNOTATE if ANNOTATE.is_file() else None,
            warmup=3.5,
        )
        # Build·PnP + loaded scene so Scene page is on-path and haveScene=true.
        scene = shot(
            "scene",
            page=4,
            workflow=2,
            source=1,
            load_scene=True,
            warmup=4.0,
        )
        # Load·track + scene + live video for Track feed.
        track = shot(
            "track",
            page=5,
            workflow=1,
            source=1,
            load_scene=True,
            start_capture=True,
            warmup=5.0,
        )
        tags = make_tags_composite()

        export_web(setup, PIPELINE / "setup.png")
        export_web(tags, PIPELINE / "tags.png")
        export_web(camera, PIPELINE / "camera-k.png")
        export_web(solve, PIPELINE / "solve-cmm.png")
        export_web(scene, PIPELINE / "scene.png")
        export_web(track, PIPELINE / "track.png")
        export_web(track, HOLD / "track-poster.jpg")
        export_web(track, HERO / "poster.jpg")

        # Keep existing hold video if present; poster is real now.
        print("DONE — pipeline stills are real Studio G captures")
        for p in sorted(PIPELINE.glob("*.png")):
            print(f"  {p.name:16} {p.stat().st_size:8d}")
        return 0
    finally:
        if backup.is_file():
            shutil.copy2(backup, SESSION)
            print("Restored session.json from backup")
        kill_studio()


if __name__ == "__main__":
    raise SystemExit(main())
