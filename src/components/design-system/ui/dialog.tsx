"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { cva, type VariantProps } from "class-variance-authority"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/design-system/ui/button"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

// `size` covers content volume/complexity: `default` (single-column form,
// simple content) and `lg` (two-column form, denser). Only 2 tiers — no
// real 3rd case (e.g. a table) exists yet, same no-speculation discipline
// applied elsewhere in this catalog. A "full page" tier for when even `lg`
// isn't enough is reserved, not implemented — open it only once a real
// consumer needs it (if `lg` still scrolls too much, the answer is a
// dedicated route/page, not a 3rd Dialog tier). `size` is chosen once by
// the consumer for the whole Dialog — it never varies between steps of a
// wizard, to avoid layout shift.
const dialogContentVariants = cva("max-w-md", {
  variants: {
    size: {
      default: "max-w-md",
      lg: "max-w-xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

// Unlike Popover: has an Overlay (behind the content) and no Positioner —
// Dialog is centered in the viewport, not anchored to a trigger.
// bg-foreground/50 (not a literal "black") follows the same pattern used
// elsewhere in this catalog for overlaying a semantic color with opacity.
function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-foreground/50 duration-100 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  size = "default",
  container,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> &
  VariantProps<typeof dialogContentVariants> & {
    /**
     * Optional portal target. When set, the overlay and content are
     * positioned `absolute` inside it (the target must be `relative`),
     * so the dialog stays within an embedded frame instead of covering
     * the whole viewport.
     */
    container?: HTMLElement | null
  }) {
  const contained = container != null

  return (
    <DialogPortal container={container ?? undefined}>
      <DialogOverlay className={contained ? "absolute" : undefined} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl bg-card p-4 text-card-foreground ring-1 ring-foreground/10 duration-100 outline-hidden data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          dialogContentVariants({ size }),
          contained && "absolute",
          className
        )}
        {...props}
      />
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-base leading-none font-medium", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex items-center justify-end gap-4 rounded-b-xl border-t bg-muted/50 p-4 -mx-4 -mb-4",
        className
      )}
      {...props}
    />
  )
}

// A close button is placed explicitly by the consumer inside DialogHeader,
// not auto-injected into a corner of DialogContent. `children` defaults to
// an icon button (header usage) but accepts an override for the other real
// use: a text "Cancel" button in DialogFooter that also just closes (no
// other action). `aria-label` only applies to the default, so it doesn't
// compete with a custom `children`'s visible text.
function DialogClose({
  "aria-label": ariaLabel,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  const isIconDefault = children === undefined
  return (
    <DialogPrimitive.Close
      asChild
      data-slot="dialog-close"
      aria-label={ariaLabel ?? (isIconDefault ? "Close" : undefined)}
      {...props}
    >
      {children ?? (
        <Button variant="ghost" size="icon">
          <XIcon />
        </Button>
      )}
    </DialogPrimitive.Close>
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  dialogContentVariants,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}
