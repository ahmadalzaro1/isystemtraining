import React from 'react';
import { cn } from '@/lib/utils';

interface HomeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary';
  size?: 'default' | 'lg';
}

const HomeButton = React.forwardRef<HTMLButtonElement, HomeButtonProps>(
  ({ children, onClick, variant = 'default', size = 'default', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          // Base styles
          'touch-manipulation webkit-tap-transparent transition-all duration-200',
          'font-semibold border-none cursor-pointer',
          // Variant styles
          variant === 'default' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'secondary' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          // Size styles
          size === 'default' && 'h-[52px] px-6 text-lg rounded-xl min-w-[200px]',
          size === 'lg' && 'h-[60px] px-8 text-xl rounded-xl min-w-[240px]',
          // iOS-style effects
          'active:scale-[0.98] shadow-lg hover:shadow-xl',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

HomeButton.displayName = 'HomeButton';

export { HomeButton };