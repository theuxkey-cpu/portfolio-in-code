"use client"

import { useEffect, useRef } from "react"
import { BookOpenIcon, CheckIcon, CircleSlashIcon, HandIcon, SquareIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/design-system/ui/button"
import { StatusBadge } from "@/components/design-system/ui/status-badge"
import { CHAT_QUESTIONS, ESCALATION_NOTE, KNOWLEDGE, replyText, type ChatQuestion } from "./data"
import type { RumoState, Turn } from "./use-rumo"

function TurnView({ turn, rumo }: { turn: Turn; rumo: RumoState }) {
  const question = CHAT_QUESTIONS.find((q) => q.id === turn.questionId) as ChatQuestion
  const article = KNOWLEDGE.find((a) => a.id === question.articleId)
  const working = turn.phase === "searching" || turn.phase === "answering"
  const full = replyText(question)
  const text = turn.phase === "done" ? full : full.split(" ").slice(0, turn.wordsShown).join(" ")
  const finished = turn.phase === "done"

  return (
    <li className="flex flex-col gap-2.5">
      <p className="max-w-[85%] self-end rounded-2xl rounded-br-sm bg-muted px-3 py-2 text-sm">{question.text}</p>
      <div className="flex flex-col gap-2.5" aria-busy={working}>
        <p className="flex items-center gap-2 text-xs text-foreground/70">
          <BookOpenIcon className="size-3.5 shrink-0" aria-hidden />
          {turn.phase === "searching" ? `Looking in ${question.looked}…` : `Looked in ${question.looked}.`}
          {finished ? (
            question.kind === "answer" ? (
              <StatusBadge tone="neutral">Found a guide</StatusBadge>
            ) : (
              <StatusBadge tone="warning">Not covered</StatusBadge>
            )
          ) : null}
        </p>
        {text ? (
          <p className="text-sm leading-relaxed">
            {text}
            {turn.phase === "answering" ? (
              <span aria-hidden className="ml-0.5 inline-block h-3.5 w-px translate-y-0.5 bg-foreground" />
            ) : null}
          </p>
        ) : null}
        {finished && article ? (
          <div className="flex flex-col gap-1.5 text-xs">
            <p className="flex items-center gap-1.5 text-foreground/70">
              <span className="font-medium text-foreground">Source</span>
              {article.source}
            </p>
            {article.checkOnScreen ? (
              <p className="rounded-lg border border-border bg-[var(--surface-2)] px-3 py-2 leading-snug">
                <span className="font-medium">Check on your screen. </span>
                {article.checkOnScreen}
              </p>
            ) : null}
          </div>
        ) : null}
        {turn.phase === "stopped" ? (
          <p className="flex items-center gap-2 text-xs font-medium">
            <CircleSlashIcon className="size-3.5" aria-hidden />
            Stopped.
          </p>
        ) : null}
        {finished ? (
          turn.escalated ? (
            <p className="flex items-start gap-2 rounded-lg border border-border px-3 py-2 text-xs leading-snug">
              <CheckIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              {ESCALATION_NOTE}
            </p>
          ) : (
            <div>
              <button
                type="button"
                className={cn(
                  buttonVariants({ variant: question.kind === "decline" ? "default" : "ghost", size: "xs" }),
                  "h-auto min-h-11 gap-1.5 whitespace-normal py-1 text-left @2xl:min-h-6"
                )}
                onClick={() => rumo.escalate(turn.id)}
              >
                <HandIcon aria-hidden />
                {question.kind === "decline" ? "Ask a person" : "Not what you needed? Ask a person"}
              </button>
            </div>
          )
        ) : null}
      </div>
    </li>
  )
}

/**
 * Rumo, the assistant inside Rota. It answers from a guide and names it, says
 * "I can't answer that" when no guide covers the question, and hands the
 * question to a person on request. Replies are scripted; no model runs behind it.
 */
export function RumoChat({ rumo }: { rumo: RumoState }) {
  const logRef = useRef<HTMLDivElement>(null)
  const last = rumo.turns[rumo.turns.length - 1]
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [last?.id, last?.wordsShown, last?.phase, last?.escalated])

  return (
    <section aria-label="Rumo conversation" className="flex min-h-0 flex-1 flex-col">
      <div ref={logRef} className="min-h-0 flex-1 overflow-y-auto p-4" tabIndex={0} role="region" aria-label="Messages">
        {rumo.turns.length === 0 ? (
          <div className="max-w-md text-sm">
            <p className="font-medium">You are Dani, three weeks in, building a quote for Alder Garage.</p>
            <p className="mt-1 text-foreground/70">
              Pick a question for Rumo. It answers from a guide and names it. When no guide covers the question, it says
              so instead of guessing, and you can hand it to a person.
            </p>
          </div>
        ) : (
          <ol className="flex flex-col gap-6">
            {rumo.turns.map((turn) => (
              <TurnView key={turn.id} turn={turn} rumo={rumo} />
            ))}
          </ol>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-border p-3">
        {rumo.running ? (
          <Button variant="outline" className="min-h-11 @2xl:min-h-8" onClick={rumo.stop}>
            <SquareIcon data-icon="inline-start" aria-hidden />
            Stop
          </Button>
        ) : (
          CHAT_QUESTIONS.map((q) => (
            // A plain button: Button's label slot is one line wide, and these questions wrap.
            <button
              key={q.id}
              type="button"
              className={cn(buttonVariants({ variant: "secondary" }), "h-auto min-h-11 whitespace-normal py-1.5 text-left @2xl:min-h-8")}
              disabled={rumo.asked.has(q.id)}
              onClick={() => rumo.ask(q.id)}
            >
              {q.text}
            </button>
          ))
        )}
      </div>
    </section>
  )
}
