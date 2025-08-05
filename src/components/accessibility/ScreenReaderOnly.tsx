import React from 'react';
import { cn } from '@/lib/utils';

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Component that hides content visually but keeps it available to screen readers
 */
export const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ 
  children, 
  className 
}) => {
  return (
    <span className={cn('sr-only', className)}>
      {children}
    </span>
  );
};