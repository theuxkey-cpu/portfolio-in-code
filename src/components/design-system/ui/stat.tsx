import * as React from "react"

import { cn } from "@/lib/utils"
import { Typography } from "@/components/design-system/ui/typography"

function Stat({
  label,
  value,
  caption,
  className,
  labelClassName,
  ...props
}: {
  label: string
  value: string
  caption?: string
  /** Point override for the label's weight/color token — default preserved when omitted. */
  labelClassName?: string
} & Omit<React.ComponentProps<"div">, "children">) {
  return (
    <div
      data-slot="stat"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <Typography variant="small" as="p" className={cn("text-muted-foreground", labelClassName)}>
        {label}
      </Typography>
      <Typography variant="heading3" as="p">
        {value}
      </Typography>
      {caption ? (
        <Typography variant="small" as="p" className="text-muted-foreground">
          {caption}
        </Typography>
      ) : null}
    </div>
  )
}

export { Stat }
