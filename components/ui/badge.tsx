import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors border border-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-primary/10 text-primary border-primary/20",
        secondary:
          "bg-secondary text-secondary-foreground",
        destructive:
          "bg-destructive/10 text-destructive border-destructive/20",
        success:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        warning:
          "bg-amber-50 text-amber-700 border-amber-200",
        info:
          "bg-blue-50 text-blue-700 border-blue-200",
        outline:
          "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
