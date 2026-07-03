import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Drive Exotiq button. Gulf blue is the ONE action color (CLAUDE.md).
 * 2px corners, no pills, hairline depth, never glow.
 * - primary   = gulf fill
 * - secondary = quiet outline (hairline)
 * - outline   = same family, lower emphasis
 * - ghost     = text only
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-sm font-sans font-semibold',
          'transition-colors duration-250 ease-de touch-manipulation select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gulf focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-gulf text-on-gulf hover:bg-gulf-2': variant === 'primary',
            'border border-line-2 text-ink hover:border-ink-3 hover:bg-white/[0.03]':
              variant === 'secondary',
            'border border-line text-ink-2 hover:text-ink hover:border-line-2':
              variant === 'outline',
            'text-ink-2 hover:text-ink': variant === 'ghost',

            'px-5 py-2.5 text-[15px] min-h-[44px]': size === 'sm',
            'px-6 py-3 text-[16px] min-h-[48px]': size === 'md',
            'px-7 py-3.5 text-[17px] min-h-[52px]': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
