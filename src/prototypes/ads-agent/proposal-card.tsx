"use client"

import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { MinusIcon, PlusIcon, Undo2Icon } from "lucide-react"

import { Button } from "@/components/design-system/ui/button"
import { StatusBadge } from "@/components/design-system/ui/status-badge"
import { INITIAL_CAMPAIGNS, SCENARIOS } from "./data"
import type { AgentState, Turn } from "./use-agent"

const STATUS: Record<Turn["proposalStatus"], { tone: "warning" | "success" | "neutral"; text: string }> = {
  waiting: { tone: "warning", text: "Waiting for your approval" },
  applied: { tone: "success", text: "Applied" },
  dismissed: { tone: "neutral", text: "Dismissed" },
  undone: { tone: "neutral", text: "Undone" },
}

const name = (id: string) => INITIAL_CAMPAIGNS.find((c) => c.id === id)?.name ?? id
const budgetOf = (id: string) => INITIAL_CAMPAIGNS.find((c) => c.id === id)?.budget ?? 0

/**
 * The proposed change, with nothing applied behind it. It shows the effect on
 * both budgets before it asks, lets the person change the amount, and says
 * what the estimate rests on. Approving, dismissing and undoing are all
 * explicit; focus moves to the heading when the status changes so the new
 * state is read.
 */
export function ProposalCard({ turn, agent }: { turn: Turn; agent: AgentState }) {
  const reduce = useReducedMotion()
  const proposal = SCENARIOS[turn.scenario].proposal
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstStatus = useRef(turn.proposalStatus)

  useEffect(() => {
    if (turn.proposalStatus !== firstStatus.current) headingRef.current?.focus()
  }, [turn.proposalStatus])

  if (!proposal) return null
  const status = STATUS[turn.proposalStatus]
  const applied = turn.proposalStatus === "applied"
  const waiting = turn.proposalStatus === "waiting"
  const fromNow = budgetOf(proposal.fromId) - (applied ? turn.amount : 0)
  const toNow = budgetOf(proposal.toId) + (applied ? turn.amount : 0)
  const fromAfter = budgetOf(proposal.fromId) - turn.amount
  const toAfter = budgetOf(proposal.toId) + turn.amount
  const beyond = toAfter > proposal.seenUpTo
  const extra = Math.round(turn.amount / proposal.toCpa)

  return (
    <motion.section
      aria-label="Proposed change"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.25, ease: "easeOut" }}
      className="flex flex-col gap-3 rounded-xl border border-border bg-background p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 ref={headingRef} tabIndex={-1} className="text-sm font-semibold outline-none">
          Proposed change
        </h3>
        <StatusBadge tone={status.tone}>{status.text}</StatusBadge>
      </div>

      <p className="text-sm">
        Move <strong>${turn.amount} a day</strong> from {name(proposal.fromId)} to {name(proposal.toId)}.
      </p>

      <table className="w-full text-xs">
        <caption className="sr-only">Daily budgets before and after the change</caption>
        <thead>
          <tr className="text-left text-foreground/70">
            <th scope="col" className="py-1 pr-2 font-medium">
              Campaign
            </th>
            <th scope="col" className="py-1 pr-2 text-right font-medium">
              {applied ? "Before" : "Now"}
            </th>
            <th scope="col" className="py-1 text-right font-medium">
              {applied ? "Now" : "After approval"}
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: proposal.fromId, before: budgetOf(proposal.fromId), after: applied ? fromNow : fromAfter },
            { id: proposal.toId, before: budgetOf(proposal.toId), after: applied ? toNow : toAfter },
          ].map((row) => (
            <tr key={row.id} className="border-t border-border/60">
              <th scope="row" className="py-1.5 pr-2 text-left font-normal">
                {name(row.id)}
              </th>
              <td className="py-1.5 pr-2 text-right tabular-nums">${row.before}</td>
              <td className="py-1.5 text-right font-medium tabular-nums">${row.after}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {waiting ? (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span id={`amount-${turn.id}`} className="text-foreground/70">
            Amount moved per day
          </span>
          <div role="group" aria-labelledby={`amount-${turn.id}`} className="inline-flex items-center gap-1">
            <Button
              size="icon"
              variant="outline"
              className="min-h-11 min-w-11 @2xl:min-h-8 @2xl:min-w-8"
              aria-label="Move $10 less"
              disabled={turn.amount <= proposal.min}
              onClick={() => agent.setAmount(turn.id, turn.amount - proposal.step)}
            >
              <MinusIcon aria-hidden />
            </Button>
            <output aria-live="polite" className="min-w-10 text-center text-sm font-medium tabular-nums">
              ${turn.amount}
            </output>
            <Button
              size="icon"
              variant="outline"
              className="min-h-11 min-w-11 @2xl:min-h-8 @2xl:min-w-8"
              aria-label="Move $10 more"
              disabled={turn.amount >= proposal.max}
              onClick={() => agent.setAmount(turn.id, turn.amount + proposal.step)}
            >
              <PlusIcon aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-1 rounded-lg bg-muted/50 p-2 text-xs leading-snug">
        <p>
          <strong>Expected effect:</strong> about {extra} more {extra === 1 ? "conversion" : "conversions"} a day, if{" "}
          {name(proposal.toId)} keeps its ${proposal.toCpa.toFixed(2)} cost per conversion. That is an estimate from the
          last 14 days, not a result.
        </p>
        <p>
          <strong>{beyond ? "Caution:" : "Range:"}</strong>{" "}
          {beyond
            ? `${name(proposal.toId)} would go to $${toAfter} a day, and I have only seen it up to $${proposal.seenUpTo}. Its cost per conversion may climb past that.`
            : `${name(proposal.toId)} stays at or under the $${proposal.seenUpTo} a day I have seen it hold.`}
        </p>
      </div>

      {waiting ? (
        <>
          <p className="text-xs font-medium">Nothing has changed in the account yet.</p>
          <div className="flex flex-wrap gap-2">
            <Button className="min-h-11 @2xl:min-h-8" onClick={() => agent.apply(turn.id)}>
              Apply change
            </Button>
            <Button variant="outline" className="min-h-11 @2xl:min-h-8" onClick={() => agent.dismiss(turn.id)}>
              Dismiss
            </Button>
          </div>
        </>
      ) : null}
      {applied ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-medium">The budgets above are live in the account.</p>
          <Button variant="outline" className="min-h-11 @2xl:min-h-8" onClick={() => agent.undo(turn.id)}>
            <Undo2Icon data-icon="inline-start" aria-hidden />
            Undo
          </Button>
        </div>
      ) : null}
      {turn.proposalStatus === "dismissed" || turn.proposalStatus === "undone" ? (
        <p className="text-xs font-medium">The account is as it was before this proposal.</p>
      ) : null}
    </motion.section>
  )
}
