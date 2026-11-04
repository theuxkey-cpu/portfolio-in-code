import * as React from "react"

import { cn } from "@/lib/utils"
import { Typography } from "@/components/design-system/ui/typography"

function PageHeader({
  title,
  description,
  action,
  className,
  ...props
}: {
  /** Page title. Renders visually as heading3 (18px/600), but semantically
   * as an `<h1>` — it's the page's real title. */
  title: string
  /** Optional supporting text below the title. */
  description?: string
  /** Optional action slot on the right (e.g. the page's primary button). */
  action?: React.ReactNode
} & Omit<React.ComponentProps<"div">, "title">) {
  return (
    <div
      data-slot="page-header"
      className={cn("flex items-center justify-between gap-4 px-6 py-4", className)}
      {...props}
    >
      <div data-slot="page-header-title-group" className="flex flex-col gap-1">
        {/* as="h1": nothing above this in the layout emits a heading, so
            without this override the heading-outline tree would be empty
            up to here. Visual stays heading3 (18px/600), only the tag
            changes. */}
        <Typography as="h1" variant="heading3">
          {title}
        </Typography>
        {description ? (
          <Typography variant="body" className="text-muted-foreground">
            {description}
          </Typography>
        ) : null}
      </div>
      {action ? <div data-slot="page-header-action">{action}</div> : null}
    </div>
  )
}

export { PageHeader }
