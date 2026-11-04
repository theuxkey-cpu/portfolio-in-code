import * as React from "react"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { TONE_BG_TEXT } from "@/components/design-system/lib/tone"
import { Typography } from "@/components/design-system/ui/typography"

export type StepperNodeStatus = "done" | "current" | "pending"

export interface StepperNode {
  status: StepperNodeStatus
  label: string
  caption?: string
}

// The current step never uses the brand color: a brand hue would read as a
// status. It is set apart by weight, ring and marker size instead. `done` and
// `pending` reuse TONE_BG_TEXT (success / neutral), the single source of
// tone-to-color pairing shared with Chip and Alert.
const MARKER_TONE: Record<StepperNodeStatus, string> = {
  done: TONE_BG_TEXT.success,
  current: "bg-background text-foreground ring-2 ring-foreground/30",
  pending: cn(TONE_BG_TEXT.neutral, "opacity-60"),
}

function StepperMarker({ status }: { status: StepperNodeStatus }) {
  return (
    <div
      data-slot="stepper-marker"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full",
        MARKER_TONE[status]
      )}
    >
      {status === "done" ? (
        <CheckIcon aria-hidden="true" className="size-3.5" />
      ) : null}
    </div>
  )
}

function StepperConnector({
  filled,
  hidden,
  orientation,
}: {
  filled: boolean
  hidden: boolean
  orientation: "horizontal" | "vertical"
}) {
  return (
    <div
      data-slot="stepper-connector"
      aria-hidden="true"
      className={cn(
        hidden ? "invisible" : filled ? "bg-success-700/40" : "bg-border",
        orientation === "horizontal" ? "h-px flex-1" : "w-px flex-1"
      )}
    />
  )
}

function Stepper({
  nodes,
  orientation = "horizontal",
  className,
  ...props
}: {
  nodes: StepperNode[]
  orientation?: "horizontal" | "vertical"
} & Omit<React.ComponentProps<"ol">, "children">) {
  const isHorizontal = orientation === "horizontal"

  return (
    <ol
      data-slot="stepper"
      className={cn("flex", isHorizontal ? "flex-row items-start" : "flex-col", className)}
      {...props}
    >
      {nodes.map((node, index) => (
        <li
          key={node.label}
          data-slot="stepper-node"
          aria-current={node.status === "current" ? "step" : undefined}
          className={cn(
            "flex",
            isHorizontal
              ? "flex-1 flex-col items-center gap-1"
              : "flex-1 flex-row items-start gap-2"
          )}
        >
          <div
            className={cn(
              "flex items-center",
              isHorizontal ? "w-full" : "h-full flex-col"
            )}
          >
            <StepperConnector
              hidden={index === 0}
              filled={index > 0 && nodes[index - 1].status === "done"}
              orientation={orientation}
            />
            <StepperMarker status={node.status} />
            <StepperConnector
              hidden={index === nodes.length - 1}
              filled={node.status === "done"}
              orientation={orientation}
            />
          </div>
          <div
            className={cn(
              "flex flex-col",
              isHorizontal ? "items-center text-center" : "pb-4"
            )}
          >
            <Typography
              variant="small"
              weight={node.status === "current" ? "medium" : undefined}
              className={node.status === "pending" ? "text-muted-foreground" : undefined}
            >
              {node.label}
            </Typography>
            {node.caption ? (
              <Typography variant="caption" className="text-muted-foreground">
                {node.caption}
              </Typography>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

export { Stepper }
