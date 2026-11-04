"use client"

import { DECISIONS } from "./data"
import type { PlumbState } from "./use-plumb"

/**
 * Two records: what this run threw away and kept (the file Plumb writes next
 * to every prototype), and the design decisions behind the tool.
 */
export function DecisionsView({ plumb }: { plumb: PlumbState }) {
  const log = plumb.history.filter((d) => d.dropped)

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4 text-xs leading-snug @2xl:flex-row">
      <section className="min-w-0 flex-1">
        <h3 className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">This run&apos;s record</h3>
        {log.length === 0 ? (
          <p className="text-foreground/70">Nothing yet. Each correction Plumb forces is written here: what was dropped and what stayed.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {log.map((d, i) => (
              <li key={`${d.id}-${i}`} className="rounded-lg border border-border px-3 py-2">
                <p>
                  <span className="font-medium">Dropped </span>
                  {d.dropped}
                </p>
                <p>
                  <span className="font-medium">Kept </span>
                  {d.kept}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="min-w-0 flex-1">
        <h3 className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">Decisions behind the tool</h3>
        <ul className="flex flex-col gap-2">
          {DECISIONS.map((d) => (
            <li key={d.id} className="rounded-lg border border-border px-3 py-2">
              <p className="font-medium">{d.title}</p>
              <p>
                <span className="font-medium">Chose </span>
                {d.chose}
              </p>
              <p>
                <span className="font-medium">Discarded </span>
                {d.discarded}
              </p>
              <p className="text-foreground/70">{d.why}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
