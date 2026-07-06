import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

/**
 * Film-toned native select. Matches Input: surface fill, hairline border,
 * 2px corners, gulf focus. Custom chevron (no OS default arrow) via an inline
 * SVG so it reads on the dark canvas. Keyboard focus uses the global
 * *:focus-visible outline (no local outline suppression).
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, id, 'aria-describedby': ariaDescribedBy, children, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;
    return (
      <div className="w-full">
        <div className="relative">
          <select
            ref={ref}
            id={id}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              'w-full appearance-none px-4 py-4 sm:py-3 pr-11 bg-surface text-ink border rounded-sm text-base min-h-[48px] touch-manipulation',
              'focus:border-gulf transition-colors duration-250 ease-de',
              error ? 'border-papaya' : 'border-line',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
          </svg>
        </div>
        {error && (
          <p id={errorId} role="alert" className="mt-2 text-sm text-papaya">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
