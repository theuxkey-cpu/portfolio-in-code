"use client"

import { useEffect, useRef } from "react"
import { SquareIcon } from "lucide-react"

import { PrototypeFrame } from "@/components/prototype/prototype-frame"
import { ControlStripBar, Readout, ReadoutStrip } from "@/components/prototype/control-strip"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/design-system/ui/button"
import { AccountPanel } from "./account-panel"
import { SCENARIOS, SCENARIO_ORDER } from "./data"
import { TurnView } from "./turn-view"
import { useAgent } from "./use-agent"

/**
 * An assistant for a fictional ad account. It shows its steps as it goes and
 * says which are read from the account and which are its own reading, names
 * the data it doesn't have, and proposes a change that only reaches the
 * account after a person approves it. The replies are scripted; no model runs
 * behind it.
 */
export function AdsAgentPrototype() {
  const agent = useAgent()
  const logRef = useRef<HTMLDivElement>(null)

  // The question buttons are swapped for Stop while it runs, so the focused button disappears.
  // Move focus to Stop when a run starts, and back to the messages when it ends, so a keyboard
  // user is never dropped on the page body.
  const stopRef = useRef<HTMLButtonElement>(null)
  const wasRunning = useRef(false)
  useEffect(() => {
    if (agent.running) {
      stopRef.current?.focus()
    } else if (wasRunning.current && (!document.activeElement || document.activeElement === document.body)) {
      logRef.current?.focus()
    }
    wasRunning.current = agent.running
  }, [agent.running])

  // Keep the newest line in view while the assistant writes.
  const last = agent.turns[agent.turns.length - 1]
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [last?.id, last?.stepsDone, last?.wordsShown, last?.phase, last?.proposalStatus])

  return (
    <PrototypeFrame
      title="Ad account assistant · Concept"
      label="Ad account assistant prototype"
      announcement={agent.announcement}
      controls={
        <ControlStripBar onReset={agent.reset}>
          <ReadoutStrip>
            <Readout label="Replies" value="scripted" />
            <Readout label="Awaiting approval" value={agent.waiting} />
            <Readout label="Applied" value={agent.applied} />
            <Readout label="Data gaps named" value={agent.gapsNamed} />
          </ReadoutStrip>
        </ControlStripBar>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col @2xl:flex-row">
        <AccountPanel agent={agent} />
        <section aria-label="Conversation" className="flex min-h-0 min-w-0 flex-1 flex-col @2xl:order-first">
          <div ref={logRef} className="min-h-0 flex-1 overflow-y-auto p-4" tabIndex={0} role="region" aria-label="Messages">
            {agent.turns.length === 0 ? (
              <div className="max-w-md text-sm">
                <p className="font-medium">Ask about the account.</p>
                <p className="mt-1 text-foreground/70">
                  Pick a question below. The assistant shows what it reads, tells you what is its own guess, and changes
                  nothing until you approve.
                </p>
              </div>
            ) : (
              <ol className="flex flex-col gap-6">
                {agent.turns.map((turn) => (
                  <TurnView key={turn.id} turn={turn} agent={agent} />
                ))}
              </ol>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-border p-3">
            {agent.running ? (
              <Button ref={stopRef} variant="outline" className="min-h-11 @2xl:min-h-8" onClick={agent.stop}>
                <SquareIcon data-icon="inline-start" aria-hidden />
                Stop
              </Button>
            ) : (
              SCENARIO_ORDER.map((id) => (
                // A plain button: Button's label slot is one line wide, and these questions wrap.
                <button
                  key={id}
                  type="button"
                  className={cn(buttonVariants({ variant: "secondary" }), "h-auto min-h-11 whitespace-normal py-1.5 text-left @2xl:min-h-8")}
                  disabled={agent.asked.has(id)}
                  onClick={() => agent.ask(id)}
                >
                  {SCENARIOS[id].prompt}
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </PrototypeFrame>
  )
}
