"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

import { PLANTS, RULES, briefingOf, type Defect, type PlantId, type RuleId } from "./data"

/** How long each step of a run takes on screen. */
const DRAFT_MS = 900
const CHECK_MS = 800
const HOLD_MS = 1400
const FIX_MS = 900

export type Phase = "idle" | "drafting" | "checking" | "blocked" | "fixing" | "passed" | "stopped"
export type RuleStatus = "pending" | "running" | "failed" | "passed"

interface State {
  briefingId: string | null
  phase: Phase
  /** What is in the page right now. */
  defects: readonly Defect[]
  /** What the checker blocked and the model corrected, in order. */
  history: readonly Defect[]
}

const INITIAL: State = { briefingId: null, phase: "idle", defects: [], history: [] }

const isBlock = (d: Defect) => d.severity === "block"
const RUNNING: readonly Phase[] = ["drafting", "checking", "blocked", "fixing"]

/** The model corrects every blocking defect; warnings and blind spots stay. */
function settle(state: State): State {
  return {
    ...state,
    phase: "passed",
    defects: state.defects.filter((d) => !isBlock(d)),
    history: [...state.history, ...state.defects.filter(isBlock)],
  }
}

/**
 * One run of the scripted checker: the model drafts a page, level 1 checks it,
 * blocks what fails, the model corrects it and the check goes green. After
 * that a person can plant a defect and watch the same check react. Nothing
 * runs until a person asks.
 */
export function usePlumb() {
  const reduce = useReducedMotion()
  const [state, setState] = useState<State>(INITIAL)
  const [announcement, setAnnouncement] = useState("")

  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const { phase } = state
  useEffect(() => {
    if (!RUNNING.includes(phase)) return
    const step = (ms: number, next: (s: State) => State, say?: (s: State) => string) => {
      const timer = window.setTimeout(() => {
        const out = next(stateRef.current)
        setState(out)
        if (say) setAnnouncement(say(out))
      }, ms)
      return () => window.clearTimeout(timer)
    }
    if (phase === "drafting") return step(DRAFT_MS, (s) => ({ ...s, phase: "checking" }), () => "Plumb is checking the page.")
    if (phase === "checking") {
      return step(
        CHECK_MS,
        (s) => (s.defects.some(isBlock) ? { ...s, phase: "blocked" } : { ...s, phase: "passed" }),
        (s) => (s.phase === "blocked" ? describeBlocked(s) : describePassed(s))
      )
    }
    if (phase === "blocked") return step(HOLD_MS, (s) => ({ ...s, phase: "fixing" }), () => "The model is correcting the page.")
    return step(FIX_MS, settle, describePassed)
  }, [phase])

  const running = RUNNING.includes(phase)

  const generate = useCallback(
    (briefingId: string) => {
      const briefing = briefingOf(briefingId)
      if (!briefing || RUNNING.includes(state.phase)) return
      const fresh: State = { briefingId, phase: "drafting", defects: briefing.draft, history: [] }
      if (reduce) {
        const done = settle({ ...fresh, phase: "checking" })
        setState(done)
        setAnnouncement(describePassed(done))
      } else {
        setState(fresh)
        setAnnouncement("The model is drafting the page.")
      }
    },
    [reduce, state.phase]
  )

  const plant = useCallback(
    (id: PlantId) => {
      const defect = PLANTS.find((p) => p.id === id)?.defect
      if (!defect || state.phase !== "passed" || state.defects.some((d) => d.id === defect.id)) return
      const next: State = { ...state, phase: "checking", defects: [...state.defects, defect] }
      if (reduce) {
        const done = settle(next)
        setState(done)
        setAnnouncement(describePassed(done))
      } else {
        setState(next)
        setAnnouncement("Plumb is checking the page.")
      }
    },
    [reduce, state]
  )

  const stop = useCallback(() => {
    setState((s) => (RUNNING.includes(s.phase) ? { ...s, phase: "stopped" } : s))
    setAnnouncement("Stopped.")
  }, [])

  const reset = useCallback(() => {
    setState(INITIAL)
    setAnnouncement("")
  }, [])

  const blocked = state.history.length + state.defects.filter(isBlock).length
  const warnings = state.defects.filter((d) => d.severity === "warn").length
  const blind = state.defects.filter((d) => d.severity === "blind").length

  return { ...state, announcement, running, blocked, warnings, blind, generate, plant, stop, reset }
}

export type PlumbState = ReturnType<typeof usePlumb>

/** Where one rule stands, from what the checker has done so far. */
export function ruleStatus(rule: RuleId, phase: Phase, defects: readonly Defect[]): RuleStatus {
  if (phase === "checking") return "running"
  if (phase === "blocked" || phase === "fixing") return defects.some((d) => isBlock(d) && d.rule === rule) ? "failed" : "passed"
  if (phase === "passed") return "passed"
  return "pending"
}

/** Number of rules that passed, for the report's conclusion. */
export function passedRules(phase: Phase, defects: readonly Defect[]): number {
  return RULES.filter((r) => ruleStatus(r.id, phase, defects) === "passed").length
}

function describeBlocked(s: State): string {
  const n = s.defects.filter(isBlock).length
  return `Blocked: ${n} ${n === 1 ? "problem" : "problems"}. Nothing is delivered until they are fixed.`
}

function describePassed(s: State): string {
  const extra = s.defects.filter((d) => d.severity !== "block").length
  return `Passed level 1. ${extra} ${extra === 1 ? "note" : "notes"} and four things not verified.`
}
