'use client';

import { useEffect, useRef, useState } from 'react';

const chapters = [
  ['the-feeling', 'The feeling'],
  ['the-garage', 'The machines'],
  ['the-road', 'The road'],
  ['the-people', 'The people'],
  ['the-invitation', 'Your invitation'],
] as const;

type Connection = EventTarget & { saveData?: boolean };
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Native scroll supplies the timeline; all content is rendered independently. */
export default function HomeMotion() {
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.home-experience');
    const hero = document.querySelector<HTMLElement>('.home-hero');
    const road = document.querySelector<HTMLElement>('.home-road');
    const manifesto = document.querySelector<HTMLElement>('.home-manifesto');
    if (!root || !hero || !road || !manifesto) return;
    const sections = chapters.map(([id]) => document.getElementById(id));
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const large = matchMedia('(min-width: 1101px) and (min-height: 650px)');
    const connection = (navigator as Navigator & { connection?: Connection }).connection;
    let frame = 0;
    let selected = -1;

    const update = () => {
      frame = 0;
      if (document.hidden) return;
      const height = innerHeight;
      // Read geometry together before applying visual-only writes.
      const positions = sections.map(section => section?.getBoundingClientRect().top ?? Infinity);
      const heroRect = hero.getBoundingClientRect();
      const roadRect = road.getBoundingClientRect();
      const manifestoRect = manifesto.getBoundingClientRect();
      let current = 0;
      positions.forEach((top, index) => { if (top <= height * .46) current = index; });
      if (current !== selected) { selected = current; setActive(current); }
      const enabled = !motion.matches && !connection?.saveData && large.matches;
      root.dataset.motion = enabled ? 'on' : 'off';
      if (enabled) {
        const exit = clamp(-heroRect.top / heroRect.height);
        hero.style.setProperty('--hero-drift', `${(exit * 100).toFixed(2)}px`);
        hero.style.setProperty('--hero-scale', (1 + exit * .035).toFixed(4));
        const arrival = clamp((height - roadRect.top) / (height * .76));
        road.style.setProperty('--road-inset', `${((1 - arrival) * 56).toFixed(2)}px`);
        road.style.setProperty('--road-radius', `${((1 - arrival) * 12).toFixed(2)}px`);
        const words = clamp((height * .83 - manifestoRect.top) / (height * .65));
        manifesto.style.setProperty('--word-reveal', `${(words * 100).toFixed(2)}%`);
      }
      const distance = Math.max(1, root.scrollHeight - height);
      rail.current?.style.setProperty('--journey-progress', `${clamp(scrollY / distance) * 100}%`);
    };
    const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update); };
    const resize = new ResizeObserver(schedule);
    resize.observe(root);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', schedule);
    large.addEventListener('change', schedule);
    connection?.addEventListener('change', schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', schedule);
      motion.removeEventListener('change', schedule);
      large.removeEventListener('change', schedule);
      connection?.removeEventListener('change', schedule);
      delete root.dataset.motion;
    };
  }, []);

  return <nav ref={rail} className="home-chapters" aria-label="Chapters in the drive">
    {chapters.map(([id, label], index) => <a key={id} href={`#${id}`} aria-label={`${index + 1}. ${label}`} aria-current={active === index ? 'location' : undefined}>
      <span className="home-chapter-dot" aria-hidden="true" />
      <span className="home-chapter-label"><span>0{index + 1}</span> {label}</span>
    </a>)}
    <span className="home-chapter-track" aria-hidden="true"><span /></span>
  </nav>;
}
