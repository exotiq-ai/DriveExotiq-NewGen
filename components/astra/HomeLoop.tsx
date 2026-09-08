'use client';
import { useEffect, useRef, useState } from 'react';
type Connection = EventTarget & { saveData?: boolean };

/** Poster first; sources are assigned only on screen with motion/data consent. */
export default function HomeLoop({ variant = 'road' }: { variant?: 'hero' | 'road' }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [available, setAvailable] = useState(false);
  const userPaused = useRef(false);
  const failed = useRef(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    let visible = false;
    let alive = true;
    const sync = () => {
      const allowed = !failed.current && !motion.matches && !connection?.saveData;
      setAvailable(allowed);
      if (!allowed || !visible || document.hidden || userPaused.current) { video.pause(); return; }
      if (!video.getAttribute('src')) {
        const mobile = window.matchMedia('(max-width: 767px)').matches;
        video.src = variant === 'hero'
          ? (mobile ? '/astra/hero-garage-mobile-loop.mp4' : '/astra/hero-garage-loop.mp4')
          : (mobile ? '/astra/s8-alpine-loop-mobile.mp4' : '/astra/s8-alpine-loop.mp4');
      }
      void video.play().catch(() => { if (alive) setPlaying(false); });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.15 });
    observer.observe(video);
    motion.addEventListener('change', sync);
    connection?.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => { alive = false; observer.disconnect(); motion.removeEventListener('change', sync); connection?.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); video.pause(); };
  }, [variant]);
  return <>
    <video ref={ref} className={`home-${variant}-video${hasFrame ? ' is-playing' : ''}`} muted loop playsInline preload="none" aria-hidden="true" onPlaying={() => {
      if (failed.current) { ref.current?.pause(); return; }
      setPlaying(true); setHasFrame(true);
    }} onPause={() => setPlaying(false)} onError={() => {
      failed.current = true;
      ref.current?.pause();
      setHasFrame(false);
      setPlaying(false);
      setAvailable(false);
    }} />
    {available && <button className={`home-film-control home-${variant}-control`} type="button" aria-label={`${playing ? 'Pause' : 'Play'} film: ${variant === 'hero' ? 'garage' : 'road'}`} onClick={() => {
      const video = ref.current;
      if (!video) return;
      if (playing) { userPaused.current = true; video.pause(); }
      else { userPaused.current = false; void video.play().catch(() => setPlaying(false)); }
    }}><span aria-hidden="true">{playing ? 'Ⅱ' : '▷'}</span><span>{playing ? 'Pause film' : 'Play film'}</span></button>}
  </>;
}
