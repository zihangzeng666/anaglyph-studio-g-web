"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HOLD_MEDIA } from "@/lib/holdFlags";
import { assetPath } from "@/lib/assetPath";

type HoldExploreProps = {
  caption?: string;
};

/**
 * Tracking demo video — muted autoplay + loop.
 * No hold-to-explore / scrub; scroll never drives the clip.
 */
export function HoldExplore({ caption }: HoldExploreProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [mediaMissing, setMediaMissing] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onMq = () => setReduced(mq.matches);
    mq.addEventListener("change", onMq);
    return () => mq.removeEventListener("change", onMq);
  }, []);

  // Autoplay muted loop when motion is allowed
  useEffect(() => {
    const v = videoRef.current;
    if (!v || mediaMissing || reduced) return;

    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    const tryPlay = () => {
      void v
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Autoplay blocked — user can press Play
          setPlaying(false);
        });
    };
    if (v.readyState >= 2) tryPlay();
    else v.addEventListener("loadeddata", tryPlay, { once: true });
  }, [mediaMissing, reduced]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v || mediaMissing) return;
    if (v.paused) {
      void v
        .play()
        .then(() => setPlaying(true))
        .catch(() => setMediaMissing(true));
    } else {
      v.pause();
      setPlaying(false);
    }
  }, [mediaMissing]);

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-video overflow-hidden rounded-sm border border-[var(--border)] bg-panel"
        role="group"
        aria-label="Tracking demo video — looping playback"
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          playsInline
          muted
          loop
          autoPlay={!reduced}
          preload="metadata"
          poster={assetPath(HOLD_MEDIA.poster)}
          controls={false}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setMediaMissing(true)}
        >
          <source src={assetPath(HOLD_MEDIA.mp4)} type="video/mp4" />
          <source src={assetPath(HOLD_MEDIA.webm)} type="video/webm" />
        </video>

        {mediaMissing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[linear-gradient(135deg,var(--frame)_0%,var(--bg)_50%,var(--panel)_100%)] p-6 text-center">
            <span className="font-mono text-xs tracking-[0.24em] text-accent uppercase">
              Media pending
            </span>
            <span className="mt-3 max-w-sm text-sm text-muted">
              Tracking loop missing under public/media/hold.
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-bg/95 to-transparent p-4">
          <button
            type="button"
            onClick={togglePlay}
            disabled={mediaMissing}
            className="inline-flex items-center gap-2 rounded-sm border border-[var(--border)] bg-bg/90 px-4 py-2 font-mono text-xs text-ink transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60"
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
            {reduced ? "Poster · reduced motion" : "Loop"}
          </span>
        </div>
      </div>

      {caption ? (
        <p className="text-sm text-muted">{caption}</p>
      ) : null}

      <p className="font-mono text-[11px] text-muted">
        {reduced
          ? "Autoplay paused for reduced motion — use Play if you want the clip."
          : "Looping demo clip. Mute by default for autoplay."}
      </p>
    </div>
  );
}
