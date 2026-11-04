"use client"

import * as React from "react"
import { RadioGroup as RadioGroupPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

/**
 * Only the group root is ported. Its item is a 16 px dot, which no case here
 * uses: selectable cards build their own item on the Radix primitive so the
 * focus ring and the touch target belong to the whole card (see the Roadfit
 * prototype's RadioCard). Port the dot item when something needs it.
 */
function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

export { RadioGroup }
