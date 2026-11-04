import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { TONES, TONE_BG_TEXT, TONE_BORDER, type Tone } from "@/components/design-system/lib/tone"

const DEFAULT_TONE = "neutral"

// Structure/mechanics (grid, action slot, icon sizing) are stock shadcn,
// unchanged — only the color axis swaps from `variant` (default/destructive)
// to `tone`, reusing the same tone→color pairing as Chip/StatusBadge.
// `brand` is left out for now, same discipline as Chip (no real consumer
// yet) — revisit only once one exists (e.g. a "what's new" banner).
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      tone: Object.fromEntries(
        TONES.map((tone) => [tone, cn(TONE_BORDER[tone], TONE_BG_TEXT[tone])])
      ) as Record<Tone, string>,
    },
    defaultVariants: {
      tone: DEFAULT_TONE,
    },
  }
)

function Alert({
  className,
  tone,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-tone={tone ?? DEFAULT_TONE}
      role="alert"
      className={cn(alertVariants({ tone }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

// Color is inherited from the Alert's `text-{tone}-700` (currentColor) — same
// color as the title, just normal weight instead of medium. Doesn't hardcode
// `text-muted-foreground` (the stock default): dimming a text that already
// sits close to the AA minimum would risk repeating the same contrast issue
// documented on StatusBadge.
function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction }
