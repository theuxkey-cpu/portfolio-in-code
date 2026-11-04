import * as React from "react"

import { cn } from "@/lib/utils"
import { Typography } from "@/components/design-system/ui/typography"

function EmptyState({
  title,
  description,
  icon,
  action,
  className,
  ...props
}: {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
} & Omit<React.ComponentProps<"div">, "title">) {
  return (
    <div
      data-slot="empty-state"
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-1 text-center",
        className
      )}
      {...props}
    >
      {icon ? (
        <div
          data-slot="empty-state-icon"
          aria-hidden="true"
          className="text-muted-foreground"
        >
          {icon}
        </div>
      ) : null}
      <Typography variant="small" as="p" className="text-muted-foreground">
        {title}
      </Typography>
      {description ? (
        <Typography variant="small" as="p" className="text-muted-foreground">
          {description}
        </Typography>
      ) : null}
      {action ? <div data-slot="empty-state-action">{action}</div> : null}
    </div>
  )
}

export { EmptyState }
