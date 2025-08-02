
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from './button';
import { IOSButton } from './ios-button';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { cn } from '@/lib/utils';

interface UniversalButtonProps extends ButtonProps {
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  children: React.ReactNode;
}

const UniversalButton = forwardRef<HTMLButtonElement, UniversalButtonProps>(
  ({ className, variant = 'default', size = 'default', hapticType = 'light', children, onClick, ...props }, ref) => {
    
    // Simplified click handler - removed device detection complexity
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log('UniversalButton clicked - simplified');
      
      if (onClick) {
        console.log('Calling original onClick handler');
        onClick(e);
      }
    };

    // Simplified - just use standard Button for now
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "cursor-pointer select-auto",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

UniversalButton.displayName = 'UniversalButton';

export { UniversalButton };
