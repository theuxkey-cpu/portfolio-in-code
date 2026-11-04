"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/design-system/ui/button"
import { StatusBadge } from "@/components/design-system/ui/status-badge"
import { briefingOf, type Defect, type Severity, type Target } from "./data"
import type { PlumbState } from "./use-plumb"

const OUTLINE: Record<Severity, string> = {
  block: "outline-2 outline-offset-2 outline-error-700",
  warn: "outline-2 outline-offset-2 outline-[var(--accent-dim)]",
  blind: "outline-2 outline-dashed outline-offset-2 outline-foreground/60",
}

/** A numbered chip that ties an outlined element to the finding with the same number. */
function Mark({ n, severity }: { n: number; severity: Severity }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute -top-2 -right-2 z-10 grid size-4 place-items-center rounded-full text-[10px] font-bold tabular-nums",
        severity === "block"
          ? "bg-error-700 text-white"
          : severity === "warn"
            ? "bg-[var(--accent-dim)] text-background"
            : "bg-foreground text-background"
      )}
    >
      {n}
    </span>
  )
}

/** Wraps a part of the page and outlines it when a finding points at it. */
function Spot({
  target,
  found,
  className,
  children,
}: {
  target: Target
  found: readonly { defect: Defect; n: number }[]
  className?: string
  children: ReactNode
}) {
  const hits = found.filter((f) => f.defect.target === target)
  const worst = hits.find((h) => h.defect.severity === "block") ?? hits[0]
  return (
    <span className={cn("relative inline-flex", worst && OUTLINE[worst.defect.severity], "rounded-md", className)}>
      {children}
      {hits.map((h) => (
        <Mark key={h.defect.id} n={h.n} severity={h.defect.severity} />
      ))}
    </span>
  )
}

/**
 * The page the model "wrote". It reads from the briefing's screen and is not
 * focusable: it is the thing being checked, not a working form. Outlines and
 * numbers appear where the checker found something.
 */
export function PagePreview({ plumb }: { plumb: PlumbState }) {
  const briefing = briefingOf(plumb.briefingId)
  if (!briefing) {
    return (
      <div className="grid h-full place-items-center p-6 text-center text-sm text-foreground/70">
        <p className="max-w-[16rem]">The generated page appears here. Pick a briefing and press Generate.</p>
      </div>
    )
  }

  const { screen } = briefing
  const drafting = plumb.phase === "drafting"
  const showFound = plumb.phase === "blocked" || plumb.phase === "fixing" || plumb.phase === "passed"
  const found = showFound ? plumb.defects.map((defect, i) => ({ defect, n: i + 1 })) : []
  const inventedHeading = plumb.defects.some((d) => d.rule === "text")
  const heading = inventedHeading ? screen.invented : screen.heading
  const declared = plumb.defects.some((d) => d.rule === "declared")

  return (
    <div
      role="group"
      aria-label="Generated page, not interactive"
      aria-busy={drafting}
      className={cn("flex h-full flex-col gap-3 p-4 transition-opacity motion-reduce:transition-none", drafting && "opacity-40")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Spot target="heading" found={found}>
            <h3 className="text-base font-semibold tracking-[-0.01em]">{heading}</h3>
          </Spot>
          <p className="mt-1 text-[11px] text-foreground/70">3 waiting for you</p>
        </div>
        <Spot target="status" found={found}>
          <StatusBadge tone="warning">Pending</StatusBadge>
        </Spot>
      </div>

      <Spot target="list" found={found} className="w-full">
        <div className="w-full overflow-hidden rounded-lg border border-border text-xs">
          <div className="grid grid-cols-3 gap-2 bg-muted/60 px-3 py-1.5 font-medium text-foreground/70">
            {screen.columns.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          {screen.rows.map((row) => (
            <div key={row.a} className="grid grid-cols-3 gap-2 border-t border-border px-3 py-1.5 tabular-nums">
              <span className="truncate">{row.a}</span>
              <span>{row.b}</span>
              <span>{row.c}</span>
            </div>
          ))}
        </div>
      </Spot>

      <div className="flex flex-wrap items-center gap-2">
        <Spot target="primary" found={found}>
          <span className={cn(buttonVariants({ size: "sm" }), "pointer-events-none")}>{screen.primary}</span>
        </Spot>
        <Spot target="secondary" found={found}>
          <span className={cn(buttonVariants({ variant: "outline", size: "sm" }), "pointer-events-none")}>
            {screen.secondary}
          </span>
        </Spot>
        {declared ? <span className="text-[11px] text-foreground/70">“{screen.secondary}” is a div, declared as Button</span> : null}
      </div>

      <div className="mt-auto flex items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs">
        <StatusBadge tone="info">Proposal</StatusBadge>
        <span className="min-w-0 truncate">
          <span className="font-medium">{screen.proposal.name}</span> · {screen.proposal.label}
        </span>
        <span className="ml-auto hidden shrink-0 text-[11px] text-foreground/70 @lg:inline">not in Tessera yet</span>
      </div>
    </div>
  )
}
