import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-4 sm:py-3 bg-graphite text-pure-white border rounded-md text-base min-h-[48px] touch-manipulation',
            'focus:outline-none focus:border-gulf-blue transition-colors',
            'placeholder:text-metallic-silver/50',
            error ? 'border-performance-orange' : 'border-metallic-silver/30',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-performance-orange">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
