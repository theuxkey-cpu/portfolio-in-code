import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { TireIcon } from "@/components/ui/tire-icon"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none transition-[background-color,color,border-color,box-shadow,transform,opacity] duration-150 ease-snap motion-reduce:transition-none hover:duration-100 focus-visible:duration-100 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:scale-[0.97] active:not-aria-[haspopup]:duration-75 disabled:pointer-events-none disabled:opacity-50 not-data-[loading=true]:aria-disabled:cursor-not-allowed not-data-[loading=true]:aria-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 group-data-[loading=true]/button:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-error-700 hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-6 [--btn-gap:0.25rem] rounded-[min(var(--radius-md),10px)] px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 [--btn-gap:0.25rem] rounded-[min(var(--radius-md),12px)] px-3 text-[0.8rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        default: "h-8 [--btn-gap:0.375rem] px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        lg: "h-9 [--btn-gap:0.375rem] px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        "icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[min(var(--radius-md),12px)]",
        icon: "size-8",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const loading = !asChild && isLoading

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      data-loading={loading ? true : undefined}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }), asChild && "gap-(--btn-gap)")}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <span className="inline-flex max-w-40 items-center gap-(--btn-gap) overflow-hidden whitespace-nowrap opacity-100 transition-[max-width,opacity] duration-150 ease-snap motion-reduce:transition-none group-data-[loading=true]/button:max-w-0 group-data-[loading=true]/button:opacity-0">
            {children}
          </span>
          <span
            aria-hidden={!isLoading}
            className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity] duration-300 ease-snap delay-0 motion-reduce:transition-none group-data-[loading=true]/button:max-w-24 group-data-[loading=true]/button:opacity-100 group-data-[loading=true]/button:delay-150"
          >
            Loading...
          </span>
          <span
            aria-hidden="true"
            className="w-0 shrink-0 transition-[width] duration-500 ease-snap motion-reduce:transition-none group-data-[loading=true]/button:w-4"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 scale-[0.4] opacity-0 transition-[left,transform,opacity] duration-500 ease-snap motion-reduce:transition-none group-data-[loading=true]/button:left-[calc(100%-1.625rem)] group-data-[loading=true]/button:scale-100 group-data-[loading=true]/button:rotate-[720deg] group-data-[loading=true]/button:opacity-100"
          >
            <TireIcon className="size-4" />
          </span>
        </>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
