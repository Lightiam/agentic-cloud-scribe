import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-xl border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#607afb] text-white hover:bg-[#4a62d3]",
        secondary:
          "border-transparent bg-[#4a62d3] text-white hover:bg-[#607afb]",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600",
        outline: "border-[#2f396a] text-[#8e99cc]",
        cloud: "border-transparent bg-[#607afb] text-white hover:bg-[#4a62d3]",
        cloudSecondary: "border-transparent bg-[#21284a] text-[#8e99cc] hover:bg-[#2f396a]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
