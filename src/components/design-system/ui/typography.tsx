import * as React from "react"

import { cn } from "@/lib/utils"

const typographyVariants = {
  heading1: "text-[32px] font-bold",
  heading2: "text-2xl font-semibold",
  heading3: "text-lg font-semibold",
  body: "text-base font-normal",
  small: "text-sm font-normal",
  caption: "text-xs font-normal",
} as const

type TypographyVariant = keyof typeof typographyVariants

// Orthogonal to variant — overrides weight only, never becomes a new variant
// (there's no "heading2-medium"). Replaces the raw `className="font-medium"`
// override that used to get repeated ad hoc at call sites.
const weightVariants = {
  normal: "font-normal",
  medium: "font-medium",
} as const

type TypographyWeight = keyof typeof weightVariants

const defaultTag: Record<TypographyVariant, React.ElementType> = {
  heading1: "h1",
  heading2: "h2",
  heading3: "h3",
  body: "p",
  small: "span",
  caption: "span",
}

function Typography({
  variant = "body",
  weight,
  as,
  className,
  ...props
}: {
  variant?: TypographyVariant
  weight?: TypographyWeight
  as?: React.ElementType
} & React.ComponentProps<"span">) {
  const Comp = as ?? defaultTag[variant]

  return (
    <Comp
      data-slot="typography"
      data-variant={variant}
      data-weight={weight}
      className={cn(
        typographyVariants[variant],
        weight ? weightVariants[weight] : undefined,
        className
      )}
      {...props}
    />
  )
}

export { Typography, typographyVariants, weightVariants }
export type { TypographyVariant, TypographyWeight }
