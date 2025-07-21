
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
      triggerHaptic(hapticType);
      onClick?.(e);
    };

    const variants = {
      primary: "bg-[#0071e3] text-white hover:bg-[#0077ED] shadow-lg shadow-blue-500/25",
      secondary: "bg-[#E8E8ED] text-[#1D1D1F] hover:bg-[#D2D2D7] shadow-md",
      tertiary: "bg-transparent text-[#0071e3] hover:bg-black/5 border border-[#0071e3]/20"
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
          "touch-manipulation select-none",
          "-webkit-tap-highlight-color: transparent",
          variants[variant],
          sizes[size],
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IOSButton.displayName = 'IOSButton';

export { IOSButton };
