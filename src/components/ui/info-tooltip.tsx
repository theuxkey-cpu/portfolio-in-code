"use client"

import { Tooltip as TooltipPrimitive } from "radix-ui"
import { Info } from "lucide-react"
import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface InfoTooltipProps {
  title: string
  description: string
  children?: ReactNode
}

export function InfoTooltip({ title, description, children }: InfoTooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children ?? (
            <Button
              type="button"
              variant="ghost"
              className="h-auto p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
              aria-label="More information"
            >
              <Info className="size-3.5" />
            </Button>
          )}
        </TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="top"
            sideOffset={6}
            className="z-50 max-w-[220px] rounded-md border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95"
          >
            <p className="font-medium">{title}</p>
            <p className="mt-0.5 text-muted-foreground">{description}</p>
            <TooltipPrimitive.Arrow className="fill-border" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}
