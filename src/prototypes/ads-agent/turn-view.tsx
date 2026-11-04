"use client"

import { motion, useReducedMotion } from "motion/react"
import { CheckIcon, CircleAlertIcon, CircleSlashIcon, Loader2Icon } from "lucide-react"

import { StatusBadge } from "@/components/design-system/ui/status-badge"
import { SCENARIOS, type Step, type StepKind } from "./data"
import { ProposalCard } from "./proposal-card"
import type { AgentState, Turn } from "./use-agent"

const KIND: Record<StepKind, { tone: "neutral" | "warning" | "error"; text: string }> = {
  data: { tone: "neutral", text: "From the account" },
  inference: { tone: "warning", text: "My reading" },
  missing: { tone: "error", text: "Missing data" },
}

function StepRow({ step, done }: { step: Step; done: boolean }) {
  const reduce = useReducedMotion()
  const kind = KIND[step.kind]
  const Icon = !done ? Loader2Icon : step.kind === "missing" ? CircleAlertIcon : CheckIcon
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
      className="flex gap-2 text-xs leading-snug"
    >
      <Icon
        aria-hidden
        className={`mt-0.5 size-3.5 shrink-0 ${done ? "text-foreground/70" : "text-foreground motion-safe:animate-spin"}`}
      />
      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className={done ? "text-foreground/70" : "font-medium"}>{done ? step.doing : `${step.doing}…`}</span>
          {done ? <StatusBadge tone={kind.tone}>{kind.text}</StatusBadge> : null}
        </p>
        {done ? <p className="mt-0.5 text-sm text-foreground">{step.found}</p> : null}
      </div>
    </motion.li>
  )
}

/** One question and everything the assistant did about it: its steps, its answer, and a proposal or a list of what it needs. */
export function TurnView({ turn, agent }: { turn: Turn; agent: AgentState }) {
  const scenario = SCENARIOS[turn.scenario]
  const working = turn.phase === "thinking"
  const visibleSteps = scenario.steps.slice(0, working ? turn.stepsDone + 1 : turn.stepsDone)
  const words = scenario.answer.split(" ")
  const answer = turn.phase === "done" ? scenario.answer : words.slice(0, turn.wordsShown).join(" ")

  return (
    <li className="flex flex-col gap-3">
      <p className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-muted px-3 py-2 text-sm">{scenario.prompt}</p>
      <div className="flex flex-col gap-3" aria-busy={working || turn.phase === "answering"}>
        <ol aria-label="What the assistant did" className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-3">
          {visibleSteps.map((step, i) => (
            <StepRow key={step.doing} step={step} done={i < turn.stepsDone} />
          ))}
        </ol>
        {answer ? (
          <p className="text-sm leading-relaxed">
            {answer}
            {turn.phase === "answering" ? <span aria-hidden className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-foreground" /> : null}
          </p>
        ) : null}
        {turn.phase === "stopped" ? (
          <p className="flex items-center gap-2 text-xs font-medium">
            <CircleSlashIcon className="size-3.5" aria-hidden />
            Stopped. Nothing was changed in the account.
          </p>
        ) : null}
        {turn.phase === "done" && scenario.proposal ? <ProposalCard turn={turn} agent={agent} /> : null}
        {turn.phase === "done" && scenario.needs ? (
          <div className="rounded-xl border border-border p-3 text-xs leading-snug">
            <p className="mb-1 font-semibold">What I need to answer this</p>
            <ul className="list-disc pl-4">
              {scenario.needs.map((need) => (
                <li key={need}>{need}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </li>
  )
}
