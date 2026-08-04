import * as React from "react"
import { cn } from "../../utils/cn"

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerClassName?: string
  dark?: boolean
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, containerClassName, dark, children, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "py-24 px-6 md:px-12",
          dark && "bg-bg-darkest",
          className
        )}
        {...props}
      >
        <div className={cn("max-w-7xl mx-auto w-full", containerClassName)}>
          {children}
        </div>
      </section>
    )
  }
)
Section.displayName = "Section"

export { Section }
