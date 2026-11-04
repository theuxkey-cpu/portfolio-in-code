import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { TONE_BG_TEXT } from "@/components/design-system/lib/tone"

// 5 tones, same set as Chip/Alert (shared tone module). `info`/`warning`
// were added when the first real consumer appeared (an order-status list
// that needs 5 distinguishable states); until then only 3 existed.
const statusBadgeVariants = cva(
  "inline-flex items-center rounded-xl px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        success: TONE_BG_TEXT.success,
        error: TONE_BG_TEXT.error,
        neutral: TONE_BG_TEXT.neutral,
        info: TONE_BG_TEXT.info,
        warning: TONE_BG_TEXT.warning,
      },
    },
    defaultVariants: {
      tone: "success",
    },
  }
)

function StatusBadge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof statusBadgeVariants>) {
  return (
    <span
      data-slot="status-badge"
      className={cn(statusBadgeVariants({ tone, className }))}
      {...props}
    />
  )
}

export { StatusBadge, statusBadgeVariants }
