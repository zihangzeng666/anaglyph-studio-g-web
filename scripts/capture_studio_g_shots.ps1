# Capture real Anaglyph Studio (G) window screenshots for marketing media.
# Requires rebuilt bin\anaglyph_studio_g.exe with ANAGLYPH_STUDIO_* env hooks.
$ErrorActionPreference = "Stop"

$StudioRoot = "C:\dev\grok\Anaglyph Studio (source) - grok"
$Exe = Join-Path $StudioRoot "bin\anaglyph_studio_g.exe"
$SessionPath = Join-Path $StudioRoot "output\session.json"
$WebMedia = "C:\dev\pkg-dev\anaglyph-studio-g-web\public\media"
$RawDir = Join-Path $WebMedia "_raw_captures"
$OutPipeline = Join-Path $WebMedia "pipeline"
$OutHold = Join-Path $WebMedia "hold"
$OutHero = Join-Path $WebMedia "hero"
$VideoPath = "C:\Users\zihan\OneDrive\Desktop\Anaglyph 3.0\Anaglyph3.0\output\videos\test_paper.mp4"
$ScenePath = Join-Path $StudioRoot "output\studio_grok\scenes\my_mould_scene.json"
$CalibPath = Join-Path $StudioRoot "output\studio_grok\camera_intrinsics.json"
$AnnotateImg = Join-Path $StudioRoot "output\studio_grok\my_mould\pnp_test\photos\view_1.png"

New-Item -ItemType Directory -Force -Path $RawDir, $OutPipeline, $OutHold, $OutHero | Out-Null

if (-not (Test-Path $Exe)) { throw "Missing exe: $Exe" }
if (-not (Test-Path $VideoPath)) { Write-Warning "Video missing: $VideoPath — Track feed may be empty" }

# Backup session
$backup = "$SessionPath.pre_capture.bak"
if (Test-Path $SessionPath) { Copy-Item $SessionPath $backup -Force }

Add-Type -AssemblyName System.Drawing
Add-Type -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
public static class WinCap {
  [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT r);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
  [DllImport("user32.dll")] public static extern bool PrintWindow(IntPtr hwnd, IntPtr hdcBlt, uint nFlags);
  public struct RECT { public int Left, Top, Right, Bottom; }
  public static Bitmap Capture(IntPtr hwnd) {
    RECT r;
    GetWindowRect(hwnd, out r);
    int w = Math.Max(1, r.Right - r.Left);
    int h = Math.Max(1, r.Bottom - r.Top);
    Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
    using (Graphics g = Graphics.FromImage(bmp)) {
      IntPtr hdc = g.GetHdc();
      bool ok = PrintWindow(hwnd, hdc, 2);
      g.ReleaseHdc(hdc);
      if (!ok) {
        g.CopyFromScreen(r.Left, r.Top, 0, 0, new Size(w, h), CopyPixelOperation.SourceCopy);
      }
    }
    return bmp;
  }
}
'@

function Write-Session {
  param(
    [int]$Page,
    [int]$Workflow = 2,
    [int]$Source = 1,
    [int]$SceneChoice = 0
  )
  $calib = if (Test-Path $CalibPath) { $CalibPath.Replace('\','/') } else { "" }
  $vp = if (Test-Path $VideoPath) { $VideoPath.Replace('\','\\') } else { "" }
  $obj = [ordered]@{
    kind = "anaglyph_studio_g_session"
    version = 2
    case_name = "my_mould"
    workflow = $Workflow
    home_scene_path = $(if (Test-Path $ScenePath) { $ScenePath.Replace('\','/') } else { "" })
    home_build_method = 0
    outline_paths = @("examples/bicycle/outline.txt")
    landmarks_path = "examples/bicycle/landmarks.csv"
    cmm_path = "examples/bicycle/cmm_reference.csv"
    out_dir = "output"
    landmarks = @(
      @{ label="L1"; x=3.04; y=-15.44; z=-47.4 }
      @{ label="L2"; x=-30.0; y=0.68; z=-261.38 }
      @{ label="L3"; x=175.52; y=-0.69; z=-195.98 }
      @{ label="L4"; x=-39.1; y=12.8; z=-66.0 }
      @{ label="L5"; x=62.3; y=-12.8; z=-60.0 }
      @{ label="L6"; x=274.4; y=-7.7; z=-201.4 }
      @{ label="L7"; x=-170.0; y=-9.2; z=-300.9 }
    )
    tags = @(
      @{ id=1; size_mm=25.0 }
      @{ id=2; size_mm=25.0 }
      @{ id=3; size_mm=25.0 }
      @{ id=4; size_mm=25.0 }
    )
    dictionary_index = 0
    camera = @{
      source = $Source
      index = 0
      resolution = 1
      serial = ""
      video_path = $vp.Replace('\\','\')
      calib_path = $calib
    }
    solver = @{ max_reproj_px = 6.4; bundle_adjust = $true }
    cmm_tolerances = @{ side_pct=6.0; diagonal_pct=5.2; angle_deg=5.0; planarity_mm=1.08 }
    scene_source = @{ choice = $SceneChoice; chosen = $true }
    page = $Page
    accent_theme = 0
  }
  # Fix video path escaping for JSON
  $json = $obj | ConvertTo-Json -Depth 8
  # ConvertTo-Json may mangle path - rewrite camera.video_path cleanly
  $hash = $obj | ConvertTo-Json -Depth 8 | ConvertFrom-Json
  $hash.camera.video_path = $(if (Test-Path $VideoPath) { $VideoPath } else { "" })
  $hash.camera.calib_path = $calib
  $hash.home_scene_path = $(if (Test-Path $ScenePath) { $ScenePath } else { "" })
  ($hash | ConvertTo-Json -Depth 8) | Set-Content -Path $SessionPath -Encoding UTF8
}

function Capture-Shot {
  param(
    [string]$Name,
    [int]$Page,
    [int]$Workflow = 2,
    [int]$Source = 1,
    [int]$SceneChoice = 0,
    [switch]$LoadScene,
    [switch]$StartCapture,
    [string]$AnnotateImg = "",
    [int]$WarmupSec = 3
  )
  Get-Process -Name "anaglyph_studio_g" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 400

  Write-Session -Page $Page -Workflow $Workflow -Source $Source -SceneChoice $SceneChoice

  $env:ANAGLYPH_STUDIO_PAGE = "$Page"
  $env:ANAGLYPH_STUDIO_WORKFLOW = "$Workflow"
  if ($LoadScene -and (Test-Path $ScenePath)) {
    $env:ANAGLYPH_STUDIO_LOAD_SCENE = $ScenePath
  } else {
    Remove-Item Env:ANAGLYPH_STUDIO_LOAD_SCENE -ErrorAction SilentlyContinue
  }
  if ($StartCapture) {
    $env:ANAGLYPH_STUDIO_START_CAPTURE = "1"
  } else {
    Remove-Item Env:ANAGLYPH_STUDIO_START_CAPTURE -ErrorAction SilentlyContinue
  }
  if ($AnnotateImg -and (Test-Path $AnnotateImg)) {
    $env:ANAGLYPH_STUDIO_ANNOTATE_IMG = $AnnotateImg
  } else {
    Remove-Item Env:ANAGLYPH_STUDIO_ANNOTATE_IMG -ErrorAction SilentlyContinue
  }

  Write-Host "=== $Name  page=$Page workflow=$Workflow loadScene=$LoadScene capture=$StartCapture ==="
  $proc = Start-Process -FilePath $Exe -WorkingDirectory $StudioRoot -PassThru
  $deadline = (Get-Date).AddSeconds(20)
  $hwnd = [IntPtr]::Zero
  while ((Get-Date) -lt $deadline) {
    Start-Sleep -Milliseconds 300
    $p = Get-Process -Id $proc.Id -ErrorAction SilentlyContinue
    if (-not $p) { throw "Process died early for $Name" }
    if ($p.MainWindowHandle -ne [IntPtr]::Zero) {
      $hwnd = $p.MainWindowHandle
      break
    }
  }
  if ($hwnd -eq [IntPtr]::Zero) { throw "No main window for $Name" }

  [void][WinCap]::ShowWindow($hwnd, 3) # SW_MAXIMIZE
  Start-Sleep -Milliseconds 400
  [void][WinCap]::SetForegroundWindow($hwnd)
  Start-Sleep -Seconds $WarmupSec

  $bmp = [WinCap]::Capture($hwnd)
  $rawPath = Join-Path $RawDir "$Name.png"
  $bmp.Save($rawPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Host "  saved $rawPath ($((Get-Item $rawPath).Length) bytes)"

  Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
  Start-Sleep -Milliseconds 500
  Get-Process -Name "anaglyph_studio_g" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

  # Clear env so next shot is clean
  Remove-Item Env:ANAGLYPH_STUDIO_PAGE -ErrorAction SilentlyContinue
  Remove-Item Env:ANAGLYPH_STUDIO_WORKFLOW -ErrorAction SilentlyContinue
  Remove-Item Env:ANAGLYPH_STUDIO_LOAD_SCENE -ErrorAction SilentlyContinue
  Remove-Item Env:ANAGLYPH_STUDIO_START_CAPTURE -ErrorAction SilentlyContinue
  Remove-Item Env:ANAGLYPH_STUDIO_ANNOTATE_IMG -ErrorAction SilentlyContinue
}

# Page enum: UseCase=0 Camera=1 Calibrate=2 Solve=3 Scene=4 Track=5 Settings=6 Home=7
# Workflow: None=0 LoadTrack=1 BuildPnp=2 BuildCmm=3
# Source: Webcam=0 VideoFile=1

Capture-Shot -Name "setup" -Page 0 -Workflow 2 -Source 1 -WarmupSec 2
Capture-Shot -Name "camera-k" -Page 2 -Workflow 2 -Source 1 -StartCapture -WarmupSec 3
Capture-Shot -Name "solve-cmm" -Page 3 -Workflow 2 -Source 1 -AnnotateImg $AnnotateImg -WarmupSec 3
Capture-Shot -Name "scene" -Page 4 -Workflow 2 -Source 1 -LoadScene -WarmupSec 3
Capture-Shot -Name "track" -Page 5 -Workflow 2 -Source 1 -LoadScene -StartCapture -WarmupSec 4
Capture-Shot -Name "home" -Page 7 -Workflow 0 -Source 1 -WarmupSec 2

# Restore session backup if we had one
if (Test-Path $backup) {
  Copy-Item $backup $SessionPath -Force
  Write-Host "Restored session from backup"
}

Write-Host "RAW CAPTURES DONE"
Get-ChildItem $RawDir | Format-Table Name, Length
