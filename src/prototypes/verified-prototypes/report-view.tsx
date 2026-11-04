"use client"

import { RULES, NOT_VERIFIED, briefingOf } from "./data"
import { passedRules, ruleStatus, type PlumbState } from "./use-plumb"

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">{title}</h3>
      {children}
    </section>
  )
}

/**
 * What the report says after a run. It is built from the checker's results
 * and never from the model's opinion: three groups, and a conclusion that
 * does not use the word "validated".
 */
export function ReportView({ plumb }: { plumb: PlumbState }) {
  const briefing = briefingOf(plumb.briefingId)
  const settled = plumb.phase === "passed"
  const verified = RULES.filter((r) => ruleStatus(r.id, plumb.phase, plumb.defects) === "passed")
  const blind = plumb.defects.filter((d) => d.severity === "blind")
  const warns = plumb.defects.filter((d) => d.severity === "warn")

  if (!briefing || !settled) {
    return (
      <div className="grid min-h-0 flex-1 place-items-center p-6 text-center text-sm text-foreground/70">
        <p className="max-w-xs">No report yet. Generate a prototype on the first tab and the report appears when level 1 has run.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 text-xs leading-snug">
      <p className="text-[11px] text-foreground/70">Written by the script from what the checks found. The model does not write this page.</p>

      <Group title="Verified, passed">
        <ul className="flex flex-col gap-1">
          {verified.map((r) => (
            <li key={r.id}>
              {r.label}
              {r.id === "component" ? `, or marked Proposal (${briefing.screen.proposal.name})` : ""}
            </li>
          ))}
        </ul>
      </Group>

      <Group title={`Blocked, then fixed (${plumb.history.length})`}>
        <ul className="flex flex-col gap-1">
          {plumb.history.map((d, i) => (
            <li key={`${d.id}-${i}`}>{d.found}</li>
          ))}
        </ul>
      </Group>

      {warns.length > 0 ? (
        <Group title="Warnings, delivered">
          <ul className="flex flex-col gap-1">
            {warns.map((d) => (
              <li key={d.id}>{d.found}</li>
            ))}
          </ul>
        </Group>
      ) : null}

      <Group title="Not verified">
        <ul className="flex flex-col gap-1">
          {blind.map((d) => (
            <li key={d.id} className="font-medium">
              Whether “{briefing.screen.secondary}” is a real control. It is a div declared as Button, and level 1 cannot tell.
            </li>
          ))}
          {NOT_VERIFIED.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </Group>

      <p className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2 font-medium">
        Passed {passedRules(plumb.phase, plumb.defects)} of {RULES.length} automatic checks at level 1. Everything under “Not
        verified” needs a person.
      </p>
    </div>
  )
}
