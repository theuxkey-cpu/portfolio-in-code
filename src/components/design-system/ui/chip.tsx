import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { TONES, TONE_BG_TEXT, TONE_ICON } from "@/components/design-system/lib/tone"

const DEFAULT_TONE = "neutral"
const DEFAULT_EMPHASIS = "solid"

// A dense-card status marker (icon, not a dot — that's StatusBadge).
// `brand` is deliberately excluded: brand color isn't a state semantic, it's
// reserved for action/focus. `emphasis` maps a visual-cost scale: `subtle`
// (neutral badge + colored icon) is the mid tier, for a stable/settled
// state; `solid` (colored pill, same -100/-700 pair as StatusBadge) is the
// expensive tier, reserved for a real blocker — not for "it has a color."
// Tone→color pairing comes from the shared tone module (also used by
// StatusBadge/Alert).
const chipVariants = cva(
  "inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      tone: {
        neutral: "",
        info: "",
        success: "",
        warning: "",
        error: "",
      },
      emphasis: {
        subtle: "border border-border bg-background text-foreground",
        solid: "",
      },
    },
    compoundVariants: [
      ...TONES.map((tone) => ({ tone, emphasis: "subtle" as const, class: TONE_ICON[tone] })),
      ...TONES.map((tone) => ({ tone, emphasis: "solid" as const, class: TONE_BG_TEXT[tone] })),
    ],
    defaultVariants: {
      tone: DEFAULT_TONE,
      emphasis: DEFAULT_EMPHASIS,
    },
  }
)

function Chip({
  className,
  tone,
  emphasis,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof chipVariants>) {
  return (
    <span
      data-slot="chip"
      data-tone={tone ?? DEFAULT_TONE}
      data-emphasis={emphasis ?? DEFAULT_EMPHASIS}
      className={cn(chipVariants({ tone, emphasis, className }))}
      {...props}
    />
  )
}

export { Chip, chipVariants }
