"use client"

import { useState } from "react"

import "@/components/charts/chart-tokens.css"
import { cn } from "@/lib/utils"
import { FLOWS, ILLUSTRATIVE, MODULES, type Flow } from "./data"

const MAX_WEIGHT = Math.max(...FLOWS.map((f) => f.weight))
const share = (flow: Flow) => (flow.weight / 10).toFixed(1)

/** Shade of a cell: more tickets, deeper blue. Capped so the ink on top keeps its contrast. */
function shade(flow: Flow): string {
  const alpha = 0.06 + 0.39 * Math.sqrt(flow.weight / MAX_WEIGHT)
  return `color-mix(in oklab, var(--viz-series-1) ${Math.round(alpha * 100)}%, var(--viz-surface))`
}

/**
 * Every flow of the product as one cell, shaded by its share of the tickets. The
 * three flows the help covers first carry a thick border and a "Covered" tag,
 * so the map shows that a few cells hold most of the volume. Each cell prints
 * its number: color is never the only signal.
 */
export function CoverageMap() {
  const [selectedId, setSelectedId] = useState(FLOWS.find((f) => f.covered)?.id ?? FLOWS[0].id)
  const selected = FLOWS.find((f) => f.id === selectedId) ?? FLOWS[0]
  const covered = FLOWS.filter((f) => f.covered)
  const coveredShare = covered.reduce((sum, f) => sum + f.weight, 0) / 10

  return (
    <section aria-label="Coverage map" className="viz-root flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-sm">
          <span className="font-semibold">{covered.length} of ~{Math.round(FLOWS.length / 10) * 10} flows</span> hold{" "}
          <span className="font-semibold tabular-nums">{Math.round(coveredShare)}%</span> of the tickets.
        </p>
        <p className="rounded-full border border-[var(--badge-warm-border)] bg-[var(--badge-warm-bg)] px-3 py-0.5 text-[11px] font-medium text-[var(--accent-dim)]">
          {ILLUSTRATIVE}
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-2.5">
        {MODULES.map((module) => (
          <div key={module.id} className="grid gap-x-3 gap-y-1 @2xl:grid-cols-[7.5rem_minmax(0,1fr)] @2xl:items-center">
            <p className="text-[12px] font-medium text-[var(--viz-ink)]">{module.name}</p>
            <ul aria-label={`${module.name} flows`} className="grid grid-cols-5 gap-1 @2xl:grid-cols-10">
              {FLOWS.filter((f) => f.moduleId === module.id).map((flow) => (
                <li key={flow.id}>
                  <button
                    type="button"
                    aria-pressed={flow.id === selectedId}
                    aria-label={`${flow.name}, ${share(flow)}% of tickets${flow.covered ? ", covered" : ""}`}
                    onClick={() => setSelectedId(flow.id)}
                    style={{ background: shade(flow) }}
                    className={cn(
                      "flex h-11 w-full items-center justify-center rounded-md text-[11px] font-medium tabular-nums text-[var(--viz-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 @2xl:h-9",
                      flow.covered ? "border-2 border-[var(--viz-ink)]" : "border border-[var(--viz-grid)]",
                      flow.id === selectedId ? "outline-2 outline-offset-2 outline-primary" : ""
                    )}
                  >
                    {share(flow)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2">
        <p aria-live="polite" className="text-[13px] leading-snug">
          <span className="font-medium">{selected.name}.</span>{" "}
          {share(selected)}% of tickets.{" "}
          {selected.covered ? "Covered first: help sits inside this screen." : "Not covered yet."}
        </p>
        <p className="text-[11px] text-foreground/70">
          Each cell is one flow, with its share of tickets in percent. Darker means more tickets. A thick dark border means covered; the purple outline is the one you picked.
        </p>
      </div>
    </section>
  )
}
