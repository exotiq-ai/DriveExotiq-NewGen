import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
}

export default function Card({ children, hover = false, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-graphite rounded-lg p-6 border border-metallic-silver/10 touch-manipulation',
        hover && 'transition-all duration-300 hover:border-gulf-blue/50 hover:shadow-lg hover:shadow-gulf-blue/10 hover:-translate-y-1 active:scale-[0.98]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
