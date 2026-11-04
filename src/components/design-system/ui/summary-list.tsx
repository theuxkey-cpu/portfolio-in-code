import * as React from "react"

import { cn } from "@/lib/utils"
import { Typography } from "@/components/design-system/ui/typography"

export interface SummaryListItem {
  label: string
  value: string
  emphasis?: boolean
}

function SummaryList({
  items,
  divided = false,
  className,
  ...props
}: {
  items: SummaryListItem[]
  divided?: boolean
} & Omit<React.ComponentProps<"dl">, "children">) {
  return (
    <dl data-slot="summary-list" className={cn("flex flex-col", className)} {...props}>
      {items.map((item, index) => (
        <div
          key={item.label}
          data-slot="summary-list-item"
          className={cn(
            "flex items-center justify-between gap-4 py-2",
            divided && index > 0 && "border-t border-border"
          )}
        >
          <Typography as="dt" variant="small" className="text-muted-foreground">
            {item.label}
          </Typography>
          <Typography
            as="dd"
            variant="small"
            weight={item.emphasis ? "medium" : undefined}
            className="text-foreground"
          >
            {item.value}
          </Typography>
        </div>
      ))}
    </dl>
  )
}

export { SummaryList }
