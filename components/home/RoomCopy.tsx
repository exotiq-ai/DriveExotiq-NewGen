import Link from 'next/link';
import { cn } from '@/lib/utils';

interface RoomCopyProps {
  /** The room title, e.g. "The Drives". */
  title: string;
  /** The room's promise line. */
  promise: string;
  /** Quiet micro line under the promise. */
  micro: string;
  /** One Spectral italic jewelry line per scene (optional). */
  jewel?: string;
  /** Destination pillar page. */
  href: string;
  /** Link label, e.g. "Enter the drives". */
  cta: string;
  align?: 'left' | 'right';
}

/**
 * RoomCopy — server-rendered room content (heading + copy + link). Kept as a
 * plain server component so every room's headings, body and links are in the
 * static HTML for crawlers. The surrounding <Room> island only animates it.
 */
export default function RoomCopy({
  title,
  promise,
  micro,
  jewel,
  href,
  cta,
  align = 'left',
}: RoomCopyProps) {
  return (
    <>
      <h2 className="font-display text-[clamp(38px,5.4vw,72px)] font-bold leading-[0.98] tracking-tight-exotiq text-ink">
        {title}
      </h2>

      <p className="mt-6 max-w-[34ch] text-[clamp(18px,2vw,24px)] leading-snug text-ink-2">
        {promise}
      </p>

      {jewel && (
        <p
          className={cn(
            'mt-5 max-w-[40ch] font-serif text-[clamp(16px,1.5vw,20px)] italic leading-relaxed text-metal',
            align === 'right' && 'ml-auto'
          )}
        >
          {jewel}
        </p>
      )}

      <p className="mt-6 text-[13px] tracking-[0.02em] text-ink-3">{micro}</p>

      <Link
        href={href}
        className={cn(
          'group mt-8 inline-flex items-center gap-3 rounded-sm border border-gulf px-5 py-3 text-[14px] text-gulf transition-colors duration-250 ease-de hover:bg-gulf hover:text-on-gulf',
          align === 'right' && 'flex-row-reverse'
        )}
      >
        <span>{cta}</span>
        <span
          aria-hidden="true"
          className={cn(
            'transition-transform duration-250 ease-de',
            align === 'right'
              ? 'group-hover:-translate-x-1'
              : 'group-hover:translate-x-1'
          )}
        >
          {align === 'right' ? '←' : '→'}
        </span>
      </Link>
    </>
  );
}
