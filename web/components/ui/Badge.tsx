import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-muted-foreground",
        primary: "bg-clay-100 text-clay-700",
        sage: "bg-sage-200 text-sage-600",
        success: "bg-status-success-soft text-status-success",
        warning: "bg-status-warning-soft text-status-warning",
        danger: "bg-status-danger-soft text-status-danger",
        info: "bg-status-info-soft text-status-info",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
)

const DOT_COLORS: Record<string, string> = {
  neutral: "bg-muted-foreground",
  primary: "bg-clay-500",
  sage: "bg-sage-500",
  success: "bg-status-success",
  warning: "bg-status-warning",
  danger: "bg-status-danger",
  info: "bg-status-info",
}

function Badge({
  className,
  tone = "neutral",
  dot = false,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "span"
  const resolvedTone = tone ?? "neutral"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ tone }), className)}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            DOT_COLORS[resolvedTone]
          )}
        />
      )}
      {props.children}
    </Comp>
  )
}

export { Badge, badgeVariants }
