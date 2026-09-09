import { cn } from '@/lib/utils';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'section' | 'div' | 'footer' | 'header' | 'article';
  /** Class names applied to the inner max-width container. */
  containerClassName?: string;
  /** Full-bleed: render children edge-to-edge with no inner container. */
  bleed?: boolean;
  /** Layer cinematic film grain over this section. */
  grain?: boolean;
}

/**
 * Layout primitive — the single source of truth for section rhythm
 * (cinematic vertical padding) and the 1200px content container.
 * Replaces the ~12 copy-pasted "py-24 / max-w-7xl mx-auto px-6" blocks.
 */
export default function Section({
  as = 'section',
  className,
  containerClassName,
  bleed = false,
  grain = false,
  children,
  ...props
}: SectionProps) {
  const Tag = as as any;
  return (
    <Tag
      className={cn('relative py-section', grain && 'bg-grain', className)}
      {...props}
    >
      {bleed ? (
        children
      ) : (
        <div
          className={cn(
            'relative z-[2] mx-auto w-full max-w-content px-6 md:px-8',
            containerClassName
          )}
        >
          {children}
        </div>
      )}
    </Tag>
  );
}
