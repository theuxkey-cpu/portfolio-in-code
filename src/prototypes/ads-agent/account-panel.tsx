"use client"

import { motion, useReducedMotion } from "motion/react"

import { INITIAL_CAMPAIGNS } from "./data"
import type { AgentState } from "./use-agent"

const MAX_BUDGET = 200

/** The account as it stands, and the list of what the assistant has changed in it. Both only move after a person approves. */
export function AccountPanel({ agent }: { agent: AgentState }) {
  const reduce = useReducedMotion()

  return (
    <aside
      aria-label="Ad account"
      // Scrolls when short (narrow screens), so a keyboard user has to be able to focus it.
      tabIndex={0}
      className="max-h-40 shrink-0 overflow-y-auto border-b border-border bg-muted/20 p-3 @2xl:max-h-none @2xl:w-64 @2xl:border-b-0 @2xl:border-l"
    >
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/70">Ad account (fictional)</h2>
      <ul className="flex flex-col gap-2">
        {agent.campaigns.map((campaign) => {
          const original = INITIAL_CAMPAIGNS.find((c) => c.id === campaign.id)?.budget ?? campaign.budget
          return (
            <li key={campaign.id} className="text-xs">
              <p className="flex items-baseline justify-between gap-2">
                <span className="truncate">{campaign.name}</span>
                <span className="shrink-0 font-medium tabular-nums">${campaign.budget}/day</span>
              </p>
              <div className="mt-1 h-1.5 rounded-full bg-border" aria-hidden>
                <motion.div
                  className="h-full rounded-full bg-foreground/70"
                  initial={false}
                  animate={{ width: `${(campaign.budget / MAX_BUDGET) * 100}%` }}
                  transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
                />
              </div>
              {campaign.budget !== original ? (
                <p className="mt-0.5 text-foreground/70">Was ${original}/day</p>
              ) : null}
            </li>
          )
        })}
      </ul>
      <h2 className="mb-1 mt-4 text-xs font-semibold uppercase tracking-wide text-foreground/70 @2xl:mt-5">Changes made</h2>
      {agent.log.length === 0 ? (
        <p className="text-xs text-foreground/70">None. The assistant has not touched the account.</p>
      ) : (
        <ol className="flex flex-col gap-1 text-xs">
          {agent.log.map((entry) => (
            <li key={entry.id}>{entry.text}</li>
          ))}
        </ol>
      )}
    </aside>
  )
}
