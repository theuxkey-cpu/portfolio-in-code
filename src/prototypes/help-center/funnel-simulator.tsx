"use client"

import { useId } from "react"

import "@/components/charts/chart-tokens.css"
import { BASELINE_TICKETS, ILLUSTRATIVE, coveredDrop, totalDrop, type FunnelInput } from "./data"

interface FunnelSimulatorProps {
  value: FunnelInput
  onChange: (next: FunnelInput) => void
}

interface SliderDef {
  key: keyof FunnelInput
  label: string
  hint: string
  min: number
  max: number
}

const SLIDERS: readonly SliderDef[] = [
  { key: "covered", label: "Tickets in the covered flows", hint: "3 of ~50 flows", min: 10, max: 70 },
  { key: "howTo", label: "That are “how do I” questions", hint: "the rest need a person", min: 20, max: 90 },
  { key: "resolved", label: "Resolved by the assistant", hint: "of those questions", min: 30, max: 95 },
]

const pct = (n: number) => `${Math.round(n * 100)}%`
const factor = (n: number) => n.toFixed(2)

function Slider({ def, value, onChange }: { def: SliderDef; value: number; onChange: (v: number) => void }) {
  const id = useId()
  const percent = Math.round(value * 100)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium">
          {def.label}
        </label>
        <output htmlFor={id} className="font-mono text-[13px] font-medium tabular-nums">
          {percent}%
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={def.min}
        max={def.max}
        step={1}
        value={percent}
        aria-valuetext={`${percent} percent`}
        onChange={(e) => onChange(Number(e.target.value) / 100)}
        className="mt-1 block h-11 w-full cursor-pointer accent-primary @2xl:h-7"
      />
      <p className="text-[11px] text-foreground/70">{def.hint}</p>
    </div>
  )
}

/**
 * The hero of the case: change how much of the volume the help covers and how
 * well the assistant resolves it, and watch the tickets change. The arithmetic
 * is on the screen so the headline is never a number to take on trust.
 */
export function FunnelSimulator({ value, onChange }: FunnelSimulatorProps) {
  const inCovered = BASELINE_TICKETS * value.covered
  const howTo = inCovered * value.howTo
  const resolved = howTo * value.resolved
  const left = BASELINE_TICKETS - resolved
  const drop = totalDrop(value)
  const inner = coveredDrop(value)
  const exact = Math.abs(inner * 100 - Math.round(inner * 100)) < 1e-9

  const rows = [
    { id: "all", label: "All tickets", n: BASELINE_TICKETS, tone: "var(--viz-grid)" },
    { id: "covered", label: "In covered flows", n: inCovered, tone: "var(--viz-series-1)" },
    { id: "howto", label: "“How do I” questions", n: howTo, tone: "var(--viz-series-1)" },
    { id: "resolved", label: "Resolved in the screen", n: resolved, tone: "var(--viz-series-3)" },
  ]

  return (
    <div className="viz-root flex min-h-0 flex-1 flex-col overflow-y-auto @2xl:flex-row">
      <div className="flex flex-col gap-3 border-b border-border p-4 @2xl:w-[19rem] @2xl:shrink-0 @2xl:border-r @2xl:border-b-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">Change the inputs</p>
        {SLIDERS.map((def) => (
          <Slider key={def.key} def={def} value={value[def.key]} onChange={(v) => onChange({ ...value, [def.key]: v })} />
        ))}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="text-[44px] leading-none font-bold tracking-[-0.03em] tabular-nums">−{Math.round(drop * 100)}%</p>
            <p className="mt-1 text-[12px] text-foreground/70">tickets a month, out of {BASELINE_TICKETS.toLocaleString("en-US")}</p>
          </div>
          <p className="rounded-full border border-[var(--badge-warm-border)] bg-[var(--badge-warm-bg)] px-3 py-1 text-[11px] font-medium text-[var(--accent-dim)]">
            {ILLUSTRATIVE}
          </p>
        </div>

        <ul aria-label="Tickets at each step of the funnel" className="flex flex-col gap-2.5 text-xs">
          {rows.map((row) => (
            <li key={row.id} className="grid grid-cols-[8.5rem_minmax(0,1fr)] items-center gap-3">
              <span className="truncate text-[var(--viz-ink)]">{row.label}</span>
              <div className="relative h-3.5">
                <div
                  className="absolute inset-y-0 left-0 rounded-r-[4px] transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ background: row.tone, width: `${(row.n / BASELINE_TICKETS) * 100}%` }}
                />
                <span
                  className="absolute inset-y-0 flex items-center pl-2 font-medium tabular-nums text-[var(--viz-ink)]"
                  style={{ left: `${Math.min((row.n / BASELINE_TICKETS) * 100, 88)}%` }}
                >
                  {Math.round(row.n)}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-border bg-[var(--surface-2)] px-4 py-3 font-mono text-[12px] leading-[1.9] tabular-nums">
          <p>
            <span className="text-foreground/70">Inside the covered flows </span>
            {factor(value.howTo)} × {factor(value.resolved)} {exact ? "=" : "≈"} {pct(inner)}
          </p>
          <p>
            <span className="text-foreground/70">Across all tickets </span>
            {factor(value.covered)} × {factor(inner)} ≈ {pct(drop)}
          </p>
          <p className="text-foreground/70 font-sans text-[11px] leading-[1.5]">
            {Math.round(left)} of {BASELINE_TICKETS.toLocaleString("en-US")} tickets are left.
          </p>
        </div>
      </div>
    </div>
  )
}
