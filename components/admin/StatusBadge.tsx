import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected';
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      className: 'bg-performance-orange/20 text-performance-orange border-performance-orange/50',
    },
    approved: {
      label: 'Approved',
      className: 'bg-green-500/20 text-green-400 border-green-500/50',
    },
    rejected: {
      label: 'Rejected',
      className: 'bg-red-500/20 text-red-400 border-red-500/50',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}





