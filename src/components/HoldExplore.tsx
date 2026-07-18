"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ENABLE_HOLD_EXPLORE,
  getHoldMode,
  HOLD_MEDIA,
  type HoldMode,
} from "@/lib/holdFlags";
import { assetPath } from "@/lib/assetPath";

type HoldExploreProps = {
  caption?: string;
};

/**
 * Hold-to-explore media control.
 * v1 default: play-only (media not produced / scrub QA not passed).
 * Scrub path (pointer/Space hold) only when HOLD_MODE=scrub and flag on.
 * Scroll never drives this video — see lib/motion.ts contract.
 */
export function HoldExplore({ caption }: HoldExploreProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode] = useState<HoldMode>(() => getHoldMode());
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [mediaMissing, setMediaMissing] = useState(false);
  const holdingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  const effectiveMode: HoldMode =
    reduced || !ENABLE_HOLD_EXPLORE ? "play-only" : mode;

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v || mediaMissing) return;
    if (v.paused) {
      void v.play().then(() => setPlaying(true)).catch(() => setMediaMissing(true));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [mediaMissing]);

  /** rAF-throttled scrub — only when effectiveMode === scrub */
  const scrubTo = useCallback((clientX: number, target: HTMLElement) => {
    const v = videoRef.current;
    if (!v || v.seeking || !v.duration) return;
    const rect = target.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!v.seeking) {
        v.currentTime = p * v.duration;
      }
    });
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (effectiveMode !== "scrub" || reduced) return;
      holdingRef.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      const v = videoRef.current;
      if (v) {
        v.pause();
        setPlaying(false);
      }
      scrubTo(e.clientX, e.currentTarget);
    },
    [effectiveMode, reduced, scrubTo],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!holdingRef.current || effectiveMode !== "scrub") return;
      scrubTo(e.clientX, e.currentTarget);
    },
    [effectiveMode, scrubTo],
  );

  const onPointerUp = useCallback(() => {
    holdingRef.current = false;
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-video overflow-hidden rounded-sm border border-[var(--border)] bg-panel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="group"
        aria-label={
          effectiveMode === "scrub"
            ? "Hold to scrub tracking loop"
            : "Tracking demo video — play only"
        }
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          preload="metadata"
          poster={assetPath(HOLD_MEDIA.poster)}
          controls={false}
          onError={() => setMediaMissing(true)}
          onEnded={() => setPlaying(false)}
        >
          {/* MP4 first — H.264 scrub loop; WebM optional when present */}
          <source src={assetPath(HOLD_MEDIA.mp4)} type="video/mp4" />
          <source src={assetPath(HOLD_MEDIA.webm)} type="video/webm" />
        </video>

        {mediaMissing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(135deg,var(--frame)_0%,var(--bg)_50%,var(--panel)_100%)] p-6 text-center">
            <span className="font-mono text-xs tracking-[0.24em] text-accent uppercase">
              Media pending
            </span>
            <span className="mt-3 max-w-sm text-sm text-muted">
              Tracking loop missing under public/media/hold. See
              public/media/README.md for the ffmpeg recipe.
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-bg/95 to-transparent p-4">
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex items-center gap-2 rounded-sm border border-[var(--border)] bg-bg/90 px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-pressed={playing}
          >
            <span
              className={[
                "inline-block h-2 w-2 rounded-full",
                playing ? "bg-[var(--ok)]" : "bg-accent",
              ].join(" ")}
              aria-hidden
            />
            {playing ? "Pause" : "Play"}
          </button>
          <span className="font-mono text-[10px] tracking-wide text-muted uppercase">
            {effectiveMode === "scrub" && !reduced
              ? "Hold to explore"
              : "Play only"}
            {reduced ? " · reduced motion" : ""}
          </span>
        </div>
      </div>

      {caption ? (
        <p className="text-sm text-muted">{caption}</p>
      ) : null}

      {effectiveMode === "scrub" && !reduced ? (
        <p className="font-mono text-[11px] text-muted">
          Pointer-hold or drag to scrub. Scroll does not drive this clip.
        </p>
      ) : (
        <p className="font-mono text-[11px] text-muted">
          Play/Pause is always available
          {reduced ? " (reduced motion)." : "."}
        </p>
      )}
    </div>
  );
}
