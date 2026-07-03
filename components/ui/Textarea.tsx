import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-4 sm:py-3 bg-graphite text-pure-white border rounded-md resize-none text-base touch-manipulation',
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

Textarea.displayName = 'Textarea';
export default Textarea;
