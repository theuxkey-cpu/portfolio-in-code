"use client"

import { useState } from "react"

import "@/components/charts/chart-tokens.css"
import { Button } from "@/components/design-system/ui/button"
import {
  ANALYSTS,
  CHECKED_POINTS,
  CHECKED_RIGHT,
  DEFECTS_BEFORE,
  ILLUSTRATIVE,
  REVIEW_ROUNDS,
  TIME,
  UNCHECKED_POINTS,
  UNCHECKED_RIGHT,
  checkedShare,
  reviewDrop,
} from "./data"

type Scope = "checked" | "all"

const pct = (n: number) => `${Math.round(n * 100)}%`

function Bar({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <li className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-3">
      <span className="text-[var(--viz-ink)]">{label}</span>
      <div className="relative h-3.5">
        <div
          className="absolute inset-y-0 left-0 rounded-r-[4px] transition-[width] duration-300 motion-reduce:transition-none"
          style={{ background: tone, width: `${value * 88}%` }}
        />
        <span
          className="absolute inset-y-0 flex items-center pl-2 font-medium tabular-nums text-[var(--viz-ink)]"
          style={{ left: `${value * 88}%` }}
        >
          {pct(value)}
        </span>
      </div>
    </li>
  )
}

/**
 * The numbers behind the headline, with the arithmetic on the screen. The
 * toggle is the point: the same run reads 96% on the rules Plumb checks and
 * 84% across everything, because most of what is left sits where nobody looks.
 */
export function FunnelView() {
  const [scope, setScope] = useState<Scope>("checked")

  const beforeAll = CHECKED_RIGHT.before + UNCHECKED_RIGHT.before
  const afterAll = CHECKED_RIGHT.after + UNCHECKED_RIGHT.after
  const before = scope === "checked" ? checkedShare(CHECKED_RIGHT.before) : beforeAll / DEFECTS_BEFORE
  const after = scope === "checked" ? checkedShare(CHECKED_RIGHT.after) : afterAll / DEFECTS_BEFORE
  const wrongChecked = CHECKED_POINTS - CHECKED_RIGHT.after
  const wrongUnchecked = UNCHECKED_POINTS - UNCHECKED_RIGHT.after

  return (
    <div className="viz-root flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 @2xl:flex-row">
      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p className="text-[44px] leading-none font-bold tracking-[-0.03em] tabular-nums">−{Math.round(reviewDrop() * 100)}%</p>
            <p className="mt-1 text-[12px] text-foreground/70">
              review rounds with engineering, {REVIEW_ROUNDS.before} to {REVIEW_ROUNDS.after}
            </p>
          </div>
          <p className="rounded-full border border-[var(--badge-warm-border)] bg-[var(--badge-warm-bg)] px-3 py-1 text-[11px] font-medium text-[var(--accent-dim)]">
            {ILLUSTRATIVE}
          </p>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="text-[12px] font-medium">Prototype conformity</p>
            <div role="group" aria-label="Scope of the measure" className="flex gap-1">
              <Button size="xs" variant={scope === "checked" ? "default" : "secondary"} aria-pressed={scope === "checked"} className="min-h-11 @2xl:min-h-6" onClick={() => setScope("checked")}>
                Checked rules
              </Button>
              <Button size="xs" variant={scope === "all" ? "default" : "secondary"} aria-pressed={scope === "all"} className="min-h-11 @2xl:min-h-6" onClick={() => setScope("all")}>
                Everything
              </Button>
            </div>
          </div>
          <ul aria-label="Conformity before and after" className="flex flex-col gap-2.5 text-xs">
            <Bar label="Before" value={before} tone="var(--viz-grid)" />
            <Bar label="After" value={after} tone="var(--viz-series-1)" />
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-[var(--surface-2)] px-4 py-3 font-mono text-[12px] leading-[1.9] tabular-nums">
          <p>
            <span className="text-foreground/70">Checked layer </span>
            {CHECKED_RIGHT.before} → {CHECKED_RIGHT.after} right of {CHECKED_POINTS} = {pct(checkedShare(CHECKED_RIGHT.before))} → {pct(checkedShare(CHECKED_RIGHT.after))}
          </p>
          <p>
            <span className="text-foreground/70">Unchecked layer </span>
            {UNCHECKED_RIGHT.before} → {UNCHECKED_RIGHT.after} right of {UNCHECKED_POINTS}, unchanged
          </p>
          <p>
            <span className="text-foreground/70">Everything </span>
            {beforeAll} → {afterAll} right of {DEFECTS_BEFORE} = {pct(beforeAll / DEFECTS_BEFORE)} → {pct(afterAll / DEFECTS_BEFORE)}
          </p>
          <p className="font-sans text-[11px] leading-[1.5] text-foreground/70">
            Of the {wrongChecked + wrongUnchecked} points still wrong, {wrongUnchecked} are in the layer no check reaches.
          </p>
        </div>
      </div>

      <dl className="grid content-start gap-3 text-xs @2xl:w-[16rem] @2xl:shrink-0">
        <div className="rounded-lg border border-border px-3 py-2.5">
          <dt className="text-foreground/70">Analysts who finish alone</dt>
          <dd className="text-lg font-bold tabular-nums">
            {ANALYSTS.before} → {ANALYSTS.after} of {ANALYSTS.of}
          </dd>
          <dd className="text-[11px] text-foreground/70">Small sample: nine people.</dd>
        </div>
        <div className="rounded-lg border border-border px-3 py-2.5">
          <dt className="text-foreground/70">Briefing to a faithful, clickable page</dt>
          <dd className="text-lg font-bold tabular-nums">
            {TIME.before} → {TIME.after}
          </dd>
          <dd className="text-[11px] leading-snug text-foreground/70">
            {TIME.beforeParts} against {TIME.afterParts}. Calendar time against active time, so read it as a direction.
          </dd>
        </div>
      </dl>
    </div>
  )
}
