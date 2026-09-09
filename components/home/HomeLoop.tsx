"use client";
import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { createMediaAnalytics } from "@/lib/analytics-media";
import { selectMediaSource } from "@/lib/media";

type Connection = EventTarget & { saveData?: boolean; effectiveType?: string };

export default function HomeLoop({
  variant = "road",
}: {
  variant?: "hero" | "road" | "pair";
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const metrics = useRef(createMediaAnalytics(variant, track));
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [available, setAvailable] = useState(false);
  const [ended, setEnded] = useState(false);
  const userPaused = useRef(false),
    failed = useRef(false),
    visible = useRef(false),
    modalOpen = useRef(false);
  const posterPainted = useRef(variant !== "hero"),
    posterFailed = useRef(false),
    completed = useRef(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: Connection })
      .connection;
    let alive = true,
      decodedFrame = 0,
      paintedFrame = 0;
    const sync = () => {
      const allowed =
        !failed.current &&
        !posterFailed.current &&
        !motion.matches &&
        !connection?.saveData;
      setAvailable(allowed);
      if (
        !allowed ||
        !visible.current ||
        !posterPainted.current ||
        document.hidden ||
        modalOpen.current ||
        userPaused.current ||
        (variant === "hero" && completed.current)
      )
        return video.pause();
      if (!video.getAttribute("src"))
        video.src = selectMediaSource(variant, {
          mobile: window.matchMedia("(max-width: 767px)").matches,
          saveData: connection?.saveData,
          effectiveType: connection?.effectiveType,
        });
      void video.play().catch(() => {
        if (alive) setPlaying(false);
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        sync();
      },
      {
        rootMargin: variant === "hero" ? "0px" : "300px 0px",
        threshold: variant === "hero" ? 0.15 : 0.01,
      },
    );
    const onModal = (event: Event) => {
      modalOpen.current = Boolean(
        (event as CustomEvent<{ open: boolean }>).detail.open,
      );
      sync();
    };
    const prepareHero = async () => {
      if (variant !== "hero") return;
      const poster =
        document.querySelector<HTMLImageElement>(".home-hero-image");
      if (!poster) return;
      try {
        await poster.decode();
      } catch {
        posterFailed.current = true;
        setAvailable(false);
        return;
      }
      if (alive)
        decodedFrame = requestAnimationFrame(() => {
          paintedFrame = requestAnimationFrame(() => {
            posterPainted.current = true;
            sync();
          });
        });
    };
    observer.observe(video);
    motion.addEventListener("change", sync);
    connection?.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    document.addEventListener("site:film-modal", onModal);
    void prepareHero();
    sync();
    return () => {
      alive = false;
      cancelAnimationFrame(decodedFrame);
      cancelAnimationFrame(paintedFrame);
      observer.disconnect();
      motion.removeEventListener("change", sync);
      connection?.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      document.removeEventListener("site:film-modal", onModal);
      video.pause();
    };
  }, [variant]);

  const label =
    variant === "hero" ? "garage" : variant === "pair" ? "Telluride" : "road";
  const action =
    variant === "hero" && ended ? "Replay" : playing ? "Pause" : "Play";
  return (
    <>
      <video
        ref={ref}
        className={`home-${variant}-video${hasFrame ? " is-playing" : ""}`}
        muted
        loop={variant !== "hero"}
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={() => {
          if (failed.current || completed.current) return ref.current?.pause();
          metrics.current.play(variant === "hero");
          setPlaying(true);
          setHasFrame(true);
        }}
        onTimeUpdate={(event) => metrics.current.progress(event.currentTarget.currentTime, event.currentTarget.duration, variant !== "hero")}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          metrics.current.complete();
          completed.current = true;
          setPlaying(false);
          setEnded(true);
        }}
        onError={() => {
          metrics.current.failure();
          failed.current = true;
          ref.current?.pause();
          ref.current?.removeAttribute("src");
          setHasFrame(false);
          setPlaying(false);
          setAvailable(false);
        }}
      />
      {(available || variant === "hero") && (
        <button
          aria-hidden={!available || undefined}
          disabled={!available}
          style={!available ? { visibility: "hidden" } : undefined}
          className={`home-film-control home-${variant}-control`}
          type="button"
          aria-label={`${action} film: ${label}`}
          onClick={() => {
            const video = ref.current;
            if (
              !video ||
              failed.current ||
              posterFailed.current ||
              !visible.current ||
              document.hidden ||
              modalOpen.current
            )
              return;
            const connection = (
              navigator as Navigator & { connection?: Connection }
            ).connection;
            if (
              window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
              connection?.saveData
            )
              return;
            if (playing) {
              userPaused.current = true;
              video.pause();
            } else {
              userPaused.current = false;
              if (completed.current || video.ended) {
                completed.current = false;
                setEnded(false);
                video.currentTime = 0;
              }
              void video.play().catch(() => setPlaying(false));
            }
          }}
        >
          <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
          <span>{action} film</span>
        </button>
      )}
    </>
  );
}
