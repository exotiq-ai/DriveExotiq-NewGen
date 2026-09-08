'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

type Connection = EventTarget & { saveData?: boolean };
const TOP = 88;
const HOLD_POINTS = [0.12, 0.5, 0.88];
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export default function useGarageProgress(rootRef: RefObject<HTMLDivElement>, onSelection: (index: number) => void, disabled: boolean) {
  const [ready, setReady] = useState(false);
  const [cinematic, setCinematic] = useState(false);
  const [near, setNear] = useState(false);
  const geometry = useRef({ start: 0, travel: 1 });
  const mode = useRef(false);
  const active = useRef(0);
  const selection = useRef(onSelection);
  selection.current = onSelection;

  useEffect(() => {
    const desktop = matchMedia('(min-width: 1101px) and (min-height: 720px) and (pointer: fine)');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    const sync = () => {
      const allowed = desktop.matches && !reduce.matches && !connection?.saveData && !disabled;
      mode.current = allowed;
      setCinematic(allowed);
      setReady(true);
    };
    sync();
    desktop.addEventListener('change', sync);
    reduce.addEventListener('change', sync);
    connection?.addEventListener('change', sync);
    return () => { desktop.removeEventListener('change', sync); reduce.removeEventListener('change', sync); connection?.removeEventListener('change', sync); };
  }, [disabled]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const stage = root.querySelector<HTMLElement>('.garage-study-stage');
    if (!stage) return;
    const layers = Array.from(root.querySelectorAll<HTMLElement>('[data-car-layer]'));
    let frame = 0;
    let relevant = false;
    let disposed = false;
    function measure() {
      geometry.current = {
        start: root!.getBoundingClientRect().top + window.scrollY - TOP,
        travel: Math.max(1, root!.offsetHeight - stage!.offsetHeight),
      };
    }
    function paint() {
      frame = 0;
      if (disposed || !cinematic || document.hidden) return;
      const { start, travel } = geometry.current;
      const progress = clamp((window.scrollY - start) / travel);
      root!.style.setProperty('--garage-progress', String(progress));
      layers.forEach((layer, index) => {
        const local = clamp(progress * 3 - index);
        const incoming = index === 0 ? 1 : clamp((progress - (index / 3 - 0.065)) / 0.13);
        const covered = index < 2 && progress >= (index + 1) / 3 + 0.065;
        const direction = index === 1 ? -1 : 1;
        layer.style.opacity = covered ? '0' : incoming.toFixed(4);
        layer.style.transform = `translate3d(${((2.2 - local * 3.5) * direction).toFixed(3)}%, ${(1.1 - local * 2.2).toFixed(3)}%, 0) scale(${(1.075 - local * 0.028).toFixed(4)})`;
      });
      const index = Math.min(2, Math.floor(progress * 3));
      if (active.current !== index) { active.current = index; selection.current(index); }
    }
    function schedule() {
      if (cinematic && relevant && !document.hidden && !frame) frame = requestAnimationFrame(paint);
    }
    function resize() { measure(); schedule(); }
    const observer = new IntersectionObserver(([entry]) => {
      relevant = entry.isIntersecting;
      setNear(relevant);
      if (relevant) { measure(); schedule(); }
      else if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: '400px 0px' });
    observer.observe(root);
    measure();
    if (cinematic) {
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(root);
      resizeObserver.observe(stage);
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', resize);
      window.addEventListener('pageshow', resize);
      document.addEventListener('visibilitychange', schedule);
      // ResizeObserver also handles the enhancement's initial geometry change.
      return () => {
        disposed = true;
        observer.disconnect(); resizeObserver.disconnect();
        window.removeEventListener('scroll', schedule); window.removeEventListener('resize', resize); window.removeEventListener('pageshow', resize);
        document.removeEventListener('visibilitychange', schedule);
        if (frame) cancelAnimationFrame(frame);
        layers.forEach(layer => { layer.style.removeProperty('opacity'); layer.style.removeProperty('transform'); });
        root.style.removeProperty('--garage-progress');
      };
    }
    return () => { disposed = true; observer.disconnect(); };
  }, [cinematic, rootRef]);

  const select = useCallback((index: number) => {
    active.current = index;
    selection.current(index);
    if (mode.current && rootRef.current) {
      const root = rootRef.current;
      const stage = root.querySelector<HTMLElement>('.garage-study-stage');
      if (!stage) return;
      const start = root.getBoundingClientRect().top + window.scrollY - TOP;
      const travel = Math.max(1, root.offsetHeight - stage.offsetHeight);
      window.scrollTo({ top: start + travel * HOLD_POINTS[index], behavior: 'instant' });
    }
  }, [rootRef]);

  return { ready, cinematic, near, select };
}
