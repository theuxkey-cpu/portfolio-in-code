"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

import { INITIAL_CAMPAIGNS, SCENARIOS, type Campaign, type ScenarioId } from "./data"

/** How long a reasoning step takes to "run", and how fast the answer types. */
const STEP_MS = 1100
const WORD_MS = 38

export type Phase = "thinking" | "answering" | "done" | "stopped"
export type ProposalStatus = "waiting" | "applied" | "dismissed" | "undone"

export interface Turn {
  id: number
  scenario: ScenarioId
  phase: Phase
  /** Steps finished; the step at this index is the one running while phase is "thinking". */
  stepsDone: number
  wordsShown: number
  proposalStatus: ProposalStatus
  /** The amount the person settled on; starts at the proposed one. */
  amount: number
}

export interface LogEntry {
  id: number
  text: string
}

function wordCount(text: string) {
  return text.split(" ").length
}

/**
 * The whole assistant, scripted. A run plays its steps one by one, then types
 * the answer, then (for one scenario) puts a proposal in front of the person.
 * The campaigns only change through `apply`, which the person triggers, and
 * `undo` puts them back. Nothing runs without a person starting it.
 */
export function useAgent() {
  const reduce = useReducedMotion()
  const [turns, setTurns] = useState<Turn[]>([])
  const [campaigns, setCampaigns] = useState<readonly Campaign[]>(INITIAL_CAMPAIGNS)
  const [log, setLog] = useState<LogEntry[]>([])
  const [announcement, setAnnouncement] = useState("")
  const [gapsNamed, setGapsNamed] = useState(0)
  const nextId = useRef(1)
  // The timer effect and the handlers read the latest turns without re-running on every change.
  const turnsRef = useRef(turns)
  useEffect(() => {
    turnsRef.current = turns
  }, [turns])

  const running = turns.find((t) => t.phase === "thinking" || t.phase === "answering")

  // Plays the running turn forward: one timer at a time, cleaned up if the turn is stopped.
  const runningId = running?.id
  const runningPhase = running?.phase
  const runningSteps = running?.stepsDone
  const runningWords = running?.wordsShown
  useEffect(() => {
    if (runningId === undefined || runningPhase === undefined) return
    const turn = turnsRef.current.find((t) => t.id === runningId)
    if (!turn) return
    const scenario = SCENARIOS[turn.scenario]
    const patch = (change: Partial<Turn>) =>
      setTurns((all) => all.map((t) => (t.id === runningId ? { ...t, ...change } : t)))

    if (runningPhase === "thinking") {
      const timer = window.setTimeout(() => {
        const done = (runningSteps ?? 0) + 1
        if (scenario.steps[done - 1].kind === "missing") setGapsNamed((n) => n + 1)
        patch(done >= scenario.steps.length ? { stepsDone: done, phase: "answering" } : { stepsDone: done })
      }, STEP_MS)
      return () => window.clearTimeout(timer)
    }

    const total = wordCount(scenario.answer)
    const timer = window.setTimeout(() => {
      const shown = (runningWords ?? 0) + 1
      if (shown >= total) {
        patch({ wordsShown: total, phase: "done" })
        setAnnouncement(
          scenario.proposal
            ? "The assistant finished and proposes a change. It is waiting for your approval. Nothing has changed in the account."
            : "The assistant finished. It does not propose a change, because data is missing."
        )
      } else {
        patch({ wordsShown: shown })
      }
    }, WORD_MS)
    return () => window.clearTimeout(timer)
  }, [runningId, runningPhase, runningSteps, runningWords])

  const ask = useCallback(
    (scenarioId: ScenarioId) => {
      if (turnsRef.current.some((t) => t.phase === "thinking" || t.phase === "answering")) return
      const scenario = SCENARIOS[scenarioId]
      const id = nextId.current++
      const finished = reduce
        ? { phase: "done" as const, stepsDone: scenario.steps.length, wordsShown: wordCount(scenario.answer) }
        : { phase: "thinking" as const, stepsDone: 0, wordsShown: 0 }
      setTurns((all) => [
        ...all,
        { id, scenario: scenarioId, proposalStatus: "waiting", amount: scenario.proposal?.amount ?? 0, ...finished },
      ])
      if (reduce) {
        if (scenario.steps.some((s) => s.kind === "missing")) setGapsNamed((n) => n + 1)
        setAnnouncement(
          scenario.proposal
            ? "The assistant proposes a change. It is waiting for your approval. Nothing has changed in the account."
            : "The assistant does not propose a change, because data is missing."
        )
      } else {
        setAnnouncement("The assistant is working. Its steps appear as it goes.")
      }
    },
    [reduce]
  )

  const stop = useCallback(() => {
    setTurns((all) =>
      all.map((t) => (t.phase === "thinking" || t.phase === "answering" ? { ...t, phase: "stopped" as const } : t))
    )
    setAnnouncement("Stopped. Nothing was changed in the account.")
  }, [])

  const setAmount = useCallback((turnId: number, amount: number) => {
    setTurns((all) => all.map((t) => (t.id === turnId ? { ...t, amount } : t)))
  }, [])

  const apply = useCallback((turnId: number) => {
    const turn = turnsRef.current.find((t) => t.id === turnId)
    const proposal = turn ? SCENARIOS[turn.scenario].proposal : undefined
    if (!turn || !proposal || turn.proposalStatus !== "waiting") return
    setCampaigns((all) =>
      all.map((c) =>
        c.id === proposal.fromId
          ? { ...c, budget: c.budget - turn.amount }
          : c.id === proposal.toId
            ? { ...c, budget: c.budget + turn.amount }
            : c
      )
    )
    const from = INITIAL_CAMPAIGNS.find((c) => c.id === proposal.fromId)?.name
    const to = INITIAL_CAMPAIGNS.find((c) => c.id === proposal.toId)?.name
    setLog((all) => [...all, { id: nextId.current++, text: `You approved moving $${turn.amount} a day from ${from} to ${to}.` }])
    setTurns((all) => all.map((t) => (t.id === turnId ? { ...t, proposalStatus: "applied" } : t)))
    setAnnouncement(`Applied. $${turn.amount} a day moved from ${from} to ${to}.`)
  }, [])

  const dismiss = useCallback((turnId: number) => {
    setTurns((all) => all.map((t) => (t.id === turnId ? { ...t, proposalStatus: "dismissed" } : t)))
    setLog((all) => [...all, { id: nextId.current++, text: "You dismissed the proposal. Nothing changed." }])
    setAnnouncement("Dismissed. Nothing changed in the account.")
  }, [])

  const undo = useCallback((turnId: number) => {
    const turn = turnsRef.current.find((t) => t.id === turnId)
    const proposal = turn ? SCENARIOS[turn.scenario].proposal : undefined
    if (!turn || !proposal || turn.proposalStatus !== "applied") return
    setCampaigns((all) =>
      all.map((c) =>
        c.id === proposal.fromId
          ? { ...c, budget: c.budget + turn.amount }
          : c.id === proposal.toId
            ? { ...c, budget: c.budget - turn.amount }
            : c
      )
    )
    setLog((all) => [...all, { id: nextId.current++, text: `You undid it. The budgets are back to what they were.` }])
    setTurns((all) => all.map((t) => (t.id === turnId ? { ...t, proposalStatus: "undone" } : t)))
    setAnnouncement("Undone. The budgets are back to what they were.")
  }, [])

  const reset = useCallback(() => {
    setTurns([])
    setCampaigns(INITIAL_CAMPAIGNS)
    setLog([])
    setGapsNamed(0)
    setAnnouncement("")
  }, [])

  const asked = useMemo(() => new Set(turns.map((t) => t.scenario)), [turns])
  const applied = turns.filter((t) => t.proposalStatus === "applied").length
  const waiting = turns.filter((t) => t.phase === "done" && SCENARIOS[t.scenario].proposal && t.proposalStatus === "waiting").length

  return {
    turns,
    campaigns,
    log,
    announcement,
    running: Boolean(running),
    asked,
    applied,
    waiting,
    gapsNamed,
    ask,
    stop,
    setAmount,
    apply,
    dismiss,
    undo,
    reset,
  }
}

export type AgentState = ReturnType<typeof useAgent>
