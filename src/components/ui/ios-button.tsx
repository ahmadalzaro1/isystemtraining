
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface IOSButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  children: React.ReactNode;
}

const IOSButton = forwardRef<HTMLButtonElement, IOSButtonProps>(
  ({ className, variant = 'primary', size = 'md', hapticType = 'light', onClick, children, ...props }, ref) => {
    const { triggerHaptic } = useHapticFeedback();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      console.log('IOSButton clicked - event received, type:', e.type);
      
      // Trigger haptic feedback
      triggerHaptic(hapticType);
      
      // Call the original onClick handler
      if (onClick) {
        console.log('IOSButton calling original onClick');
        onClick(e);
      } else {
        console.log('IOSButton: no onClick handler provided');
      }
    };

    const variants = {
      primary: "bg-[#0071e3] text-white hover:bg-[#0077ED] active:bg-[#0056b3] shadow-lg shadow-blue-500/25",
      secondary: "bg-[#E8E8ED] text-[#1D1D1F] hover:bg-[#D2D2D7] active:bg-[#C7C7CC] shadow-md",
      tertiary: "bg-transparent text-[#0071e3] hover:bg-black/5 active:bg-black/10 border border-[#0071e3]/20"
    };

    const sizes = {
      sm: "h-10 px-4 text-sm",
      md: "h-12 px-6 text-base",
      lg: "h-14 px-8 text-lg"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-xl font-medium transition-all duration-200 transform will-change-transform",
          "active:scale-95 hover:-translate-y-0.5",
          "min-w-[44px] min-h-[44px]", // iOS minimum touch target
          "touch-manipulation select-none cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        onClick={handleClick}
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IOSButton.displayName = 'IOSButton';

export { IOSButton };
