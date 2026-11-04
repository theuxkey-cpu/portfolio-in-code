"use client"

import type { ReactNode } from "react"

import { Button } from "@/components/design-system/ui/button"

interface ControlStripBarProps {
  onReset: () => void
  children: ReactNode
}

/** Shared shell for a prototype's control strip: a wrapping row, plus a Reset button pinned to the right. */
export function ControlStripBar({ onReset, children }: ControlStripBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2 text-xs">
      {children}
      <Button size="xs" variant="ghost" className="ml-auto" onClick={onReset}>
        Reset
      </Button>
    </div>
  )
}

/** `<dl>` shell for a row of Readouts — mono, dense, one per case's own facts. */
export function ReadoutStrip({ children }: { children: ReactNode }) {
  return (
    <dl className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-foreground/70">
      {children}
    </dl>
  )
}

interface ReadoutProps {
  label: string
  value: ReactNode
  /** Colors the value green/red; omit for a neutral (untoned) value. */
  tone?: boolean | null
  /** Extra untoned content after the value, e.g. "(table)". */
  suffix?: ReactNode
}

export function Readout({ label, value, tone = null, suffix }: ReadoutProps) {
  const toneClass = tone === null ? "" : tone ? "text-success-700" : "text-error-700"
  return (
    <div className="flex gap-1">
      <dt>{label}</dt>
      <dd>
        <span className={`font-medium tabular-nums ${toneClass}`}>{value}</span>
        {suffix ? <> {suffix}</> : null}
      </dd>
    </div>
  )
}
