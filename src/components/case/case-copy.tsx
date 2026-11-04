"use client"

import type { ReactNode } from "react"

/**
 * Typography and small content blocks for a CaseFrame panel's Problem / Pain
 * / Solution / Result copy. Shared across cases so each one only writes its
 * own words, not its own markup. (Separate from stories/cases/shared.tsx,
 * which belongs to the older, non-CaseFrame case pages.)
 */

export function H({ children }: { children: ReactNode }) {
  return <h2 className="mb-3 text-lg font-semibold tracking-[-0.01em]">{children}</h2>
}

export function Sub({ children }: { children: ReactNode }) {
  return <h3 className="mt-9 mb-1 text-[13px] font-semibold uppercase tracking-[0.06em] text-foreground/70">{children}</h3>
}

export function T({ children }: { children: ReactNode }) {
  return <p className="mb-4 leading-[1.75] text-foreground/75">{children}</p>
}

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="my-6 rounded-lg border border-border bg-[var(--surface-2)] px-5 py-4 text-[14px] leading-[1.65] text-foreground/75">
      <strong className="text-foreground">{title}</strong> {children}
    </div>
  )
}

export function Points({ items }: { items: readonly { title: string; body: ReactNode }[] }) {
  return (
    <ul className="my-6 flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.title} className="rounded-[10px] border border-border bg-card px-[18px] py-4">
          <p className="mb-1 text-[15px] font-medium text-foreground">{item.title}</p>
          <p className="text-[14px] leading-[1.65] text-foreground/75">{item.body}</p>
        </li>
      ))}
    </ul>
  )
}

// A short left-to-right sequence. Separate from stories/cases/shared.tsx's
// `Flow` (used by the older cases) so its text keeps AA contrast in dark mode.
export function Steps({ steps }: { steps: readonly { label: string; highlight?: boolean }[] }) {
  return (
    <ol className="my-5 flex flex-wrap items-center gap-2">
      {steps.map((step, index) => (
        <li key={step.label} className="flex items-center gap-2">
          <span
            className={`rounded-md border px-3 py-1.5 text-[12px] ${
              step.highlight
                ? "border-[var(--badge-warm-border)] bg-[var(--badge-warm-bg)] font-medium text-[var(--accent-dim)]"
                : "border-border bg-[var(--surface-2)] text-foreground/75"
            }`}
          >
            {step.label}
          </span>
          {index < steps.length - 1 ? (
            <span aria-hidden="true" className="text-[14px] text-foreground/60">
              →
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

export function Measures({ items }: { items: readonly { value: string; label: string }[] }) {
  return (
    <dl className="my-7 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
      {items.map((item) => (
        // dt before dd is the valid order inside a dl; flex-col-reverse keeps the number above its label.
        <div key={item.label} className="flex flex-col-reverse rounded-[10px] border border-border bg-card px-[22px] py-5">
          <dt className="text-[12px] leading-[1.4] text-foreground/75">{item.label}</dt>
          <dd className="mb-1.5 text-[28px] leading-none font-bold tracking-[-0.02em] text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
