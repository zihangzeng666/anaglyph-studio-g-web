"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ENABLE_HOLD_EXPLORE,
  getHoldMode,
  HOLD_HAS_SCRUB_LOOP,
  HOLD_MEDIA,
  type HoldMode,
} from "@/lib/holdFlags";
import { assetPath } from "@/lib/assetPath";

type HoldExploreProps = {
  caption?: string;
};

/**
 * Hold-to-explore media control.
 * Soft launch: SVG poster still. Scrub loop optional (HOLD_HAS_SCRUB_LOOP).
 * Scroll never drives this video — see lib/motion.ts contract.
 */
export function HoldExplore({ caption }: HoldExploreProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode] = useState<HoldMode>(() => getHoldMode());
  const [playing, setPlaying] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [videoFailed, setVideoFailed] = useState(!HOLD_HAS_SCRUB_LOOP);
  const holdingRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const posterSrc = assetPath(HOLD_MEDIA.poster);
  const webmSrc = assetPath(HOLD_MEDIA.webm);
  const mp4Src = assetPath(HOLD_MEDIA.mp4);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  const effectiveMode: HoldMode =
    reduced || !ENABLE_HOLD_EXPLORE || videoFailed ? "play-only" : mode;

  const canPlayVideo = HOLD_HAS_SCRUB_LOOP && !videoFailed;

  const togglePlay = useCallback(() => {
    if (!canPlayVideo) return;
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      void v
        .play()
        .then(() => setPlaying(true))
        .catch(() => setVideoFailed(true));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [canPlayVideo]);

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
      if (effectiveMode !== "scrub" || reduced || !canPlayVideo) return;
      holdingRef.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      const v = videoRef.current;
      if (v) {
        v.pause();
        setPlaying(false);
      }
      scrubTo(e.clientX, e.currentTarget);
    },
    [effectiveMode, reduced, canPlayVideo, scrubTo],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!holdingRef.current || effectiveMode !== "scrub" || !canPlayVideo) {
        return;
      }
      scrubTo(e.clientX, e.currentTarget);
    },
    [effectiveMode, canPlayVideo, scrubTo],
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
        className={[
          "relative aspect-video overflow-hidden rounded-sm border border-[var(--border)] bg-panel",
          !canPlayVideo ? "hold-poster-live" : "",
        ].join(" ")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="group"
        aria-label={
          canPlayVideo
            ? effectiveMode === "scrub"
              ? "Hold to scrub tracking loop"
              : "Tracking demo video — play only"
            : "Tracking demo still — scrub loop not published yet"
        }
      >
        {/* Poster always present so soft launch shows real visual media */}
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG poster */}
        <img
          src={posterSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          width={1280}
          height={720}
          decoding="async"
        />

        {canPlayVideo ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            playsInline
            preload="metadata"
            poster={posterSrc}
            controls={false}
            onError={() => setVideoFailed(true)}
            onEnded={() => setPlaying(false)}
          >
            <source src={webmSrc} type="video/webm" />
            <source src={mp4Src} type="video/mp4" />
          </video>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-bg/95 to-transparent p-4">
          <button
            type="button"
            onClick={togglePlay}
            disabled={!canPlayVideo}
            className="inline-flex items-center gap-2 rounded-sm border border-[var(--border)] bg-bg/90 px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-[var(--border)] disabled:hover:text-ink"
            aria-pressed={playing}
            aria-disabled={!canPlayVideo}
          >
            <span
              className={[
                "inline-block h-2 w-2 rounded-full",
                playing ? "bg-[var(--ok)]" : "bg-accent",
              ].join(" ")}
              aria-hidden
            />
            {canPlayVideo ? (playing ? "Pause" : "Play") : "Still"}
          </button>
          <span className="font-mono text-[10px] tracking-wide text-muted uppercase">
            {canPlayVideo
              ? effectiveMode === "scrub" && !reduced
                ? "Hold to explore"
                : "Play only"
              : "Poster · clip pending"}
            {reduced ? " · reduced motion" : ""}
          </span>
        </div>
      </div>

      {caption ? (
        <p className="text-sm text-muted">{caption}</p>
      ) : null}

      {canPlayVideo && effectiveMode === "scrub" && !reduced ? (
        <p className="font-mono text-[11px] text-muted">
          Pointer-hold or drag to scrub. Scroll does not drive this clip.
        </p>
      ) : (
        <p className="font-mono text-[11px] text-muted">
          {canPlayVideo
            ? "Play/Pause is available. Hold-scrub ships after encode QA (ENABLE_HOLD_EXPLORE + HOLD_MODE=scrub)."
            : "Soft-launch still — drop scrub-encoded loops in public/media/hold and set HOLD_HAS_SCRUB_LOOP when QA passes."}
        </p>
      )}
    </div>
  );
}
