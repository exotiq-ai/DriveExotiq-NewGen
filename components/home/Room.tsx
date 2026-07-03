'use client';

import { useRef } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '@/lib/utils';

interface RoomProps {
  /** Zero-padded index shown as a quiet idx marker, e.g. "01". */
  index: string;
  /** Decorative car plate for lit rooms (e.g. the Sponsor crescendo). */
  image?: { src: string; alt?: string };
  /** The most-lit room (Sponsor) gets a brighter exposure + larger plate. */
  lit?: boolean;
  /** The quietest room (Marketplace) sits darker, the glow almost asleep. */
  quiet?: boolean;
  /** Mirror the content to the right rail to vary the walk down the garage. */
  align?: 'left' | 'right';
  children: React.ReactNode;
}

/**
 * Room — one pillar bay in the garage. Resolves into focus on arrival
 * (blur + lift settling as it enters view) and carries a subtle parallax on
 * its decorative plate. Content (heading/copy/link) is server-rendered and
 * passed as children so the page stays crawlable.
 *
 * Reduced motion: no blur/parallax — a clean static block.
 */
export default function Room({
  index,
  image,
  lit = false,
  quiet = false,
  align = 'left',
  children,
}: RoomProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { amount: 0.35, once: true });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const plateY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const plateScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.02, 1.08]);

  const resolved = reduce || inView;

  return (
    <div
      ref={ref}
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden"
    >
      {/* decorative plate for lit rooms */}
      {image && (
        <motion.div
          aria-hidden="true"
          className={cn(
            'absolute top-1/2 -translate-y-1/2 will-change-transform',
            align === 'right' ? 'left-[2vw]' : 'right-[2vw]',
            lit ? 'h-[64vh] w-[58vw]' : 'h-[52vh] w-[46vw]'
          )}
          style={reduce ? undefined : { y: plateY, scale: plateScale }}
        >
          <span className="absolute inset-0 overflow-hidden rounded-sm border border-line-2">
            <Image
              src={image.src}
              alt=""
              fill
              sizes="58vw"
              className="object-cover"
              style={{
                filter: lit
                  ? 'brightness(.82) contrast(1.08) saturate(.96)'
                  : 'brightness(.5) contrast(1.05) saturate(.78)',
              }}
            />
            <span
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(11,11,12,.5), transparent 28%, transparent 60%, rgba(11,11,12,.88)), radial-gradient(80% 60% at 50% 46%, transparent 42%, rgba(11,11,12,.55))',
              }}
            />
          </span>
        </motion.div>
      )}

      {/* per-room exposure: the quietest room sits darker, the lit room warms */}
      {quiet && (
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(11,11,12,.55), rgba(11,11,12,.78))' }}
        />
      )}
      {lit && (
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-[40vh] w-[70vw] -translate-x-1/2"
          style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(108,189,230,.22), transparent 70%)' }}
        />
      )}

      {/* content rail, resolving into focus on arrival */}
      <div className="relative z-[2] mx-auto w-full max-w-content px-6 md:px-8">
        <motion.div
          className={cn(
            'max-w-[42rem]',
            align === 'right' && 'ml-auto text-right'
          )}
          initial={false}
          animate={
            reduce
              ? undefined
              : {
                  opacity: resolved ? 1 : 0,
                  y: resolved ? 0 : 28,
                  filter: resolved ? 'blur(0px)' : 'blur(8px)',
                }
          }
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className={cn(
              'idx mb-7 block text-[11px] tracking-[0.04em] text-ink-3',
              align === 'right' && 'text-right'
            )}
          >
            {index}
          </span>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
