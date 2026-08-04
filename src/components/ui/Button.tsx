import * as React from "react"
import { cn } from "../../utils/cn"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    const variants = {
      primary: "btn-cta",
      secondary: "bg-surface-glass border border-surface-border backdrop-blur-md text-text-primary hover:bg-white/10 transition-colors",
      outline: "border border-surface-border hover:bg-surface-glass text-text-primary",
      ghost: "hover:bg-surface-glass hover:text-text-primary text-text-secondary",
    }

    const sizes = {
      default: "h-12 px-6 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-14 rounded-full px-8 text-lg",
      icon: "h-10 w-10",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-accent disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
