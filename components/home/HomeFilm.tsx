"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { createMediaAnalytics } from "@/lib/analytics-media";
import { selectMediaSource } from "@/lib/media";

export default function HomeFilm() {
  const id = useId();
  const metrics = useRef(createMediaAnalytics("film", track));
  const dialog = useRef<HTMLDialogElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);
  const permanentlyFailed = useRef(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setReady(true);
    const pauseWhenHidden = () => {
      if (document.hidden) film.current?.pause();
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () =>
      document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(
    () => () => {
      if (opened.current)
        document.dispatchEvent(
          new CustomEvent("site:film-modal", { detail: { open: false } }),
        );
    },
    [],
  );

  function show() {
    if (!dialog.current || !film.current) return;
    track("CTA", { action: "watch-film" });
    metrics.current.restart();
    opened.current = true;
    setOpen(true);
    dialog.current.showModal();
    document.dispatchEvent(
      new CustomEvent("site:film-modal", { detail: { open: true } }),
    );
    film.current.poster = "/media/v2/hero-landscape-960.webp";
    if (permanentlyFailed.current) return;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    film.current.src = selectMediaSource("film", {
      mobile: matchMedia("(max-width: 767px)").matches,
      saveData: connection?.saveData,
      effectiveType: connection?.effectiveType,
    });
    void film.current.play().catch(() => {
      /* Native controls remain available if autoplay is denied. */
    });
  }

  function closed() {
    opened.current = false;
    film.current?.pause();
    film.current?.removeAttribute("src");
    film.current?.removeAttribute("poster");
    film.current?.load();
    setOpen(false);
    document.dispatchEvent(
      new CustomEvent("site:film-modal", { detail: { open: false } }),
    );
    trigger.current?.focus({ preventScroll: true });
  }

  return (
    <>
      <button
        ref={trigger}
        className="home-watch-film"
        type="button"
        disabled={!ready}
        aria-haspopup="dialog"
        aria-controls={id}
        onClick={show}
      >
        <span className="home-watch-play" aria-hidden="true">
          ▷
        </span>
        <span>
          Watch the road film<span>From our own camera roll</span>
        </span>
      </button>
      <dialog
        ref={dialog}
        id={id}
        className="home-film-dialog"
        aria-labelledby={`${id}-title`}
        onClose={closed}
        onClick={(event) => {
          if (event.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="home-film-room">
          <div className="home-film-top">
            <div>
              <p className="site-eyebrow">Drive Exotiq / A road film</p>
              <h2 id={`${id}-title`}>
                A little further <em>out.</em>
              </h2>
            </div>
            <button
              type="button"
              className="home-film-close"
              aria-label="Close road film"
              onClick={() => dialog.current?.close()}
            >
              ×
            </button>
          </div>
          <video
            ref={film}
            className="home-full-film"
            controls
            playsInline
            preload="none"
            aria-label="Drive Exotiq: original driving footage from Colorado"
            aria-describedby={`${id}-description`}
            onPlaying={() => metrics.current.play()}
            onTimeUpdate={(event) => metrics.current.progress(event.currentTarget.currentTime, event.currentTarget.duration)}
            onEnded={() => metrics.current.complete()}
            onError={() => {
              metrics.current.failure();
              permanentlyFailed.current = true;
              film.current?.pause();
              film.current?.removeAttribute("src");
              if (opened.current) setFailed(true);
            }}
          />
          <p id={`${id}-description`} className="sr-only">
            A mountain lake opens the film. A close view of a Ferrari badge
            leads to an Audi R8 and Ferrari 458 parked together. A driver
            presses the ignition and takes the wheel. The cars follow open roads
            through the mountains, return to the lakeside, and disappear into a
            final aerial view of the road.
          </p>
          {failed ? (
            <p className="home-film-error" role="alert">
              The film couldn’t load.{" "}
              <Link href="/tour">Explore the roadbook</Link> instead.
            </p>
          ) : (
            <p className="home-film-note">
              <span className="home-film-note-copy">
                The S8. The R8. The 458. Roads worth remembering.
              </span>
              <span className="home-film-source">
                Original footage · Colorado
              </span>
            </p>
          )}
        </div>
      </dialog>
    </>
  );
}
