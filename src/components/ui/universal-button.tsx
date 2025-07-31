
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
    const { isIOS, isMobile, hasTouch } = useDeviceDetection();

    // Enhanced click handler with debugging
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log('UniversalButton clicked:', {
        isIOS,
        isMobile,
        hasTouch,
        variant,
        size,
        eventType: e.type
      });
      
      if (onClick) {
        console.log('UniversalButton calling original onClick');
        onClick(e);
      } else {
        console.log('UniversalButton: no onClick handler provided');
      }
    };

    // Use iOS button for iOS devices or when explicitly using iOS variants
    if (isIOS || (typeof variant === 'string' && variant.startsWith('ios'))) {
      const iosVariant = typeof variant === 'string' && variant.startsWith('ios') 
        ? variant.replace('ios-', '') as 'primary' | 'secondary' | 'tertiary'
        : variant === 'secondary' ? 'secondary' : variant === 'outline' ? 'tertiary' : 'primary';
      
      const iosSize = typeof size === 'string' && size.startsWith('ios')
        ? size.replace('ios-', '') as 'sm' | 'md' | 'lg'
        : size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'md';

      return (
        <IOSButton
          ref={ref}
          variant={iosVariant}
          size={iosSize}
          hapticType={hapticType}
          className={className}
          onClick={handleClick}
          {...props}
        >
          {children}
        </IOSButton>
      );
    }

    // Enhanced button for mobile devices with touch optimization
    if (isMobile || hasTouch) {
      return (
        <Button
          ref={ref}
          variant={variant}
          size={size}
          className={cn(
            "transition-transform duration-150 active:scale-95",
            "min-w-[44px] min-h-[44px] touch-manipulation",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
            className
          )}
          onClick={handleClick}
          {...props}
        >
          {children}
        </Button>
      );
    }

    // Standard button for desktop with hover effects
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "hover:-translate-y-0.5 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
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
