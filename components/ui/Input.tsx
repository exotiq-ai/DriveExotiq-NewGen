import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, id, 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const errorId = error && id ? `${id}-error` : undefined;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;
    return (
      <div className="w-full">
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full px-4 py-4 sm:py-3 bg-surface text-ink border rounded-sm text-base min-h-[48px] touch-manipulation',
            'focus:border-gulf transition-colors duration-250 ease-de',
            'placeholder:text-ink-3',
            error ? 'border-papaya' : 'border-line',
            className
          )}
          {...props}
        />
        {error && (
          <p id={errorId} role="alert" className="mt-2 text-sm text-papaya">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
