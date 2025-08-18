import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-border bg-gray-100 px-3 py-2 text-base md:text-sm text-text-strong ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-a/30 focus-visible:ring-offset-1 focus-visible:border-accent-a disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-60 transition-all duration-200 hover:bg-gray-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
