"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"

import { CHAT_QUESTIONS, replyText } from "./data"

/** How long Rumo "searches" before it answers, and how fast the reply types. */
const SEARCH_MS = 900
const WORD_MS = 32

export type Phase = "searching" | "answering" | "done" | "stopped"

export interface Turn {
  id: number
  questionId: string
  phase: Phase
  wordsShown: number
  escalated: boolean
}

const wordCount = (text: string) => text.split(" ").length
const questionOf = (id: string) => CHAT_QUESTIONS.find((q) => q.id === id)

/**
 * Rumo, scripted. A turn searches the guides, then types either the guide's
 * answer or a refusal, and the person can hand any turn to a human. Nothing
 * runs until a person asks.
 */
export function useRumo() {
  const reduce = useReducedMotion()
  const [turns, setTurns] = useState<Turn[]>([])
  const [announcement, setAnnouncement] = useState("")
  const nextId = useRef(1)
  const turnsRef = useRef(turns)
  useEffect(() => {
    turnsRef.current = turns
  }, [turns])

  const running = turns.find((t) => t.phase === "searching" || t.phase === "answering")
  const runningId = running?.id
  const runningPhase = running?.phase
  const runningWords = running?.wordsShown

  useEffect(() => {
    if (runningId === undefined || runningPhase === undefined) return
    const turn = turnsRef.current.find((t) => t.id === runningId)
    const question = turn ? questionOf(turn.questionId) : undefined
    if (!turn || !question) return
    const patch = (change: Partial<Turn>) =>
      setTurns((all) => all.map((t) => (t.id === runningId ? { ...t, ...change } : t)))

    if (runningPhase === "searching") {
      const timer = window.setTimeout(() => patch({ phase: "answering" }), SEARCH_MS)
      return () => window.clearTimeout(timer)
    }

    const total = wordCount(replyText(question))
    const timer = window.setTimeout(() => {
      const shown = (runningWords ?? 0) + 1
      if (shown >= total) {
        patch({ wordsShown: total, phase: "done" })
        setAnnouncement(
          question.kind === "answer"
            ? "Rumo answered and named its source."
            : "Rumo can't answer that and did not guess. You can send it to a person."
        )
      } else {
        patch({ wordsShown: shown })
      }
    }, WORD_MS)
    return () => window.clearTimeout(timer)
  }, [runningId, runningPhase, runningWords])

  const ask = useCallback(
    (questionId: string) => {
      const question = questionOf(questionId)
      if (!question || turnsRef.current.some((t) => t.phase === "searching" || t.phase === "answering")) return
      const id = nextId.current++
      const start = reduce
        ? { phase: "done" as const, wordsShown: wordCount(replyText(question)) }
        : { phase: "searching" as const, wordsShown: 0 }
      setTurns((all) => [...all, { id, questionId, escalated: false, ...start }])
      setAnnouncement(
        reduce
          ? question.kind === "answer"
            ? "Rumo answered and named its source."
            : "Rumo can't answer that and did not guess. You can send it to a person."
          : "Rumo is looking in the guides."
      )
    },
    [reduce]
  )

  const stop = useCallback(() => {
    setTurns((all) =>
      all.map((t) => (t.phase === "searching" || t.phase === "answering" ? { ...t, phase: "stopped" as const } : t))
    )
    setAnnouncement("Stopped.")
  }, [])

  const escalate = useCallback((turnId: number) => {
    setTurns((all) => all.map((t) => (t.id === turnId ? { ...t, escalated: true } : t)))
    setAnnouncement("Sent to a person, with your question and the guides Rumo checked.")
  }, [])

  const reset = useCallback(() => {
    setTurns([])
    setAnnouncement("")
  }, [])

  const asked = useMemo(() => new Set(turns.map((t) => t.questionId)), [turns])
  const done = turns.filter((t) => t.phase === "done")
  const answered = done.filter((t) => questionOf(t.questionId)?.kind === "answer").length
  const declined = done.length - answered
  const escalated = turns.filter((t) => t.escalated).length

  return { turns, announcement, running: Boolean(running), asked, answered, declined, escalated, ask, stop, escalate, reset }
}

export type RumoState = ReturnType<typeof useRumo>
