import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-ios ease-ios focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 min-w-[44px] min-h-[44px] touch-manipulation webkit-tap-transparent cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:scale-95",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-95",
        ghost: "hover:bg-accent hover:text-accent-foreground active:scale-95",
        link: "text-primary underline-offset-4 hover:underline active:scale-95",
        // iOS-style variants
        ios: "bg-[#0071e3] text-white hover:bg-[#0077ED] active:bg-[#0056b3] shadow-lg shadow-blue-500/25 rounded-xl active:scale-95",
        "ios-secondary": "bg-[#E8E8ED] text-[#1D1D1F] hover:bg-[#D2D2D7] active:bg-[#C7C7CC] shadow-md rounded-xl active:scale-95",
        "ios-tertiary": "bg-transparent text-[#0071e3] hover:bg-black/5 active:bg-black/10 border border-[#0071e3]/20 rounded-xl active:scale-95",
        // Apple/Unicorn variants (additive)
        primaryPill: "rounded-pill px-5 py-2.5 bg-brand text-white shadow-elev-2 hover:bg-brand/90 focus-visible:shadow-focus transition-[transform,box-shadow] duration-ios ease-ios",
        ghostGlass: "rounded-pill px-5 py-2.5 glass text-foreground shadow-elev-1 hover:bg-white/70 focus-visible:shadow-focus",
        primaryMinimal: "rounded-lg px-5 py-2.5 bg-[hsl(var(--accent-a))] text-white hover:opacity-90 transition duration-ios ease-ios focus-visible:shadow-focus",
        secondaryOutline: "rounded-lg px-5 py-2.5 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] hover:bg-black/5 transition duration-ios ease-ios focus-visible:shadow-focus",
        glassPrimary: "glass glass-pressable rounded-lg px-5 py-2.5 glass-allow-blur text-[hsl(var(--text-strong))] focus-ring",
        glassSecondary: "glass glass-pressable rounded-lg px-5 py-2.5 text-[hsl(var(--text-strong))] border border-[hsl(var(--border))] focus-ring",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8", 
        icon: "h-10 w-10",
        // iOS-style sizes
        "ios-sm": "h-10 px-4 text-sm rounded-xl",
        "ios-md": "h-12 px-6 text-base rounded-xl",
        "ios-lg": "h-14 px-8 text-lg rounded-xl"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
