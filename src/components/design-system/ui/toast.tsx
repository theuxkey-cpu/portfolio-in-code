"use client"

import * as React from "react"
import { CheckCircleIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { TONE_TEXT } from "@/components/design-system/lib/tone"
import { Button } from "@/components/design-system/ui/button"

const AUTO_DISMISS_MS = 4000

export interface ToastProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
}

// Controlled via open/onOpenChange (same pattern as Dialog/Popover/Select in
// this catalog) — no useToast()/queue hook: only a success variant, no
// consumer needs multiple simultaneous toasts yet. No overlay/Portal by
// design, to avoid stacking-context issues with Popover/Select. z-[60]:
// needs to render above DialogOverlay/DialogContent (z-50 in dialog.tsx),
// since a toast can fire the instant a Dialog closes. No exit animation
// (unmounts immediately on close) — no consumer has needed one yet.
function Toast({ open, onOpenChange, title, description }: ToastProps) {
  React.useEffect(() => {
    if (!open) return
    const timeout = setTimeout(() => onOpenChange(false), AUTO_DISMISS_MS)
    return () => clearTimeout(timeout)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div
      data-slot="toast"
      data-state="open"
      role="status"
      aria-live="polite"
      className={cn(
        "fixed right-4 bottom-4 z-[60] flex w-full max-w-sm items-start gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-lg",
        "duration-100 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-2"
      )}
    >
      <CheckCircleIcon
        aria-hidden="true"
        className={cn("mt-0.5 size-5 shrink-0", TONE_TEXT.success)}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="text-sm font-medium">{title}</p>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={() => onOpenChange(false)}
        aria-label="Close"
      >
        <XIcon />
      </Button>
    </div>
  )
}

export { Toast }
