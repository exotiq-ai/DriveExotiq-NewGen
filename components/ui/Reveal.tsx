'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. Defaults to a div. */
  as?: keyof JSX.IntrinsicElements;
  /** Stagger delay in ms (use 60–90ms increments for child sequences). */
  delay?: number;
}

/**
 * Scroll-reveal primitive. Starts at opacity:0 / translateY(24px) and settles
 * ONCE as it crosses ~15% into the viewport. Honors prefers-reduced-motion via
 * the global CSS rule (collapses to a 200ms opacity fade). The motion lives
 * here as a client island so pages stay Server Components and fully crawlable.
 */
export default function Reveal({
  as = 'div',
  delay = 0,
  className,
  children,
  ...props
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as any;
  return (
    <Tag
      ref={ref as any}
      className={cn('reveal', visible && 'is-visible', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
