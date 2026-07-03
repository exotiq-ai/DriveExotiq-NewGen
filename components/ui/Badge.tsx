import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'orange' | 'outline';
}

export default function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wide uppercase',
        {
          'bg-gulf-blue/20 text-gulf-blue': variant === 'default',
          'bg-performance-orange/20 text-performance-orange': variant === 'orange',
          'border border-metallic-silver/30 text-metallic-silver': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
