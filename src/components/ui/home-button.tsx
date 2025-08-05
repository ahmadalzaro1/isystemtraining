import React from 'react';
import { cn } from '@/lib/utils';

interface HomeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'lg';
}

const HomeButton = React.forwardRef<HTMLButtonElement, HomeButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground hover:shadow-lg hover:scale-105 active:scale-95",
      secondary: "bg-background/10 text-foreground border border-border hover:bg-background/20"
    };
    
    const sizes = {
      default: "h-12 px-6 rounded-xl text-base",
      lg: "h-14 px-8 rounded-2xl text-lg"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
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