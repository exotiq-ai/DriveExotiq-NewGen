'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';

export default function HomeFilm() {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setReady(true);
    const pauseWhenHidden = () => { if (document.hidden) film.current?.pause(); };
    document.addEventListener('visibilitychange', pauseWhenHidden);
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  useEffect(() => () => {
    if (opened.current) document.dispatchEvent(new CustomEvent('astra:film-modal', { detail: { open: false } }));
  }, []);

  function show() {
    if (!dialog.current || !film.current) return;
    opened.current = true;
    setOpen(true);
    setFailed(false);
    dialog.current.showModal();
    document.dispatchEvent(new CustomEvent('astra:film-modal', { detail: { open: true } }));
    film.current.poster = '/astra/telluride-pair.webp';
    film.current.src = '/astra/film-roadbook.mp4';
    void film.current.play().catch(() => { /* Native controls remain available if autoplay is denied. */ });
  }

  function closed() {
    opened.current = false;
    film.current?.pause();
    film.current?.removeAttribute('src');
    film.current?.removeAttribute('poster');
    film.current?.load();
    setOpen(false);
    document.dispatchEvent(new CustomEvent('astra:film-modal', { detail: { open: false } }));
    trigger.current?.focus({ preventScroll: true });
  }

  return <>
    <button ref={trigger} className="home-watch-film" type="button" disabled={!ready} aria-haspopup="dialog" aria-controls={id} onClick={show}>
      <span className="home-watch-play" aria-hidden="true">▷</span><span>Watch the road film<span>From our own camera roll</span></span>
    </button>
    <dialog ref={dialog} id={id} className="home-film-dialog" aria-labelledby={`${id}-title`} onClose={closed} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className="home-film-room">
        <div className="home-film-top"><div><p className="astra-eyebrow">Drive Exotiq / A road film</p><h2 id={`${id}-title`}>A little further <em>out.</em></h2></div><button type="button" className="home-film-close" aria-label="Close road film" onClick={() => dialog.current?.close()}>×</button></div>
        <video ref={film} className="home-full-film" controls playsInline preload="none" aria-label="Drive Exotiq: original driving footage from Colorado" aria-describedby={`${id}-description`} onError={() => { if (opened.current) setFailed(true); }} />
        <p id={`${id}-description`} className="sr-only">A mountain lake opens the film. A close view of a Ferrari badge leads to an Audi R8 and Ferrari 458 parked together. A driver presses the ignition and takes the wheel. The cars follow open roads through the mountains, return to the lakeside, and disappear into a final aerial view of the road.</p>
        {failed ? <p className="home-film-error" role="alert">The film couldn’t load. <Link href="/tour">Explore the roadbook</Link> or close the film and try again.</p> : <p className="home-film-note">The S8. The R8. The 458. Roads worth remembering.<span>Original footage / Colorado</span></p>}
      </div>
    </dialog>
  </>;
}
