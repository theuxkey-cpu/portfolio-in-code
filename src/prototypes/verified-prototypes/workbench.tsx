"use client"

import { useState } from "react"
import { CheckIcon, CircleIcon, LoaderCircleIcon, SquareIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/design-system/ui/button"
import { StatusBadge } from "@/components/design-system/ui/status-badge"
import { Textarea } from "@/components/design-system/ui/textarea"
import { BRIEFINGS, PLANTS, RULES, SCRIPTED_NOTE, briefingOf } from "./data"
import { PagePreview } from "./page-preview"
import { ruleStatus, type Phase, type PlumbState, type RuleStatus } from "./use-plumb"

const PHASE_BADGE: Record<Phase, { tone: "neutral" | "info" | "error" | "warning" | "success"; label: string }> = {
  idle: { tone: "neutral", label: "Waiting" },
  drafting: { tone: "info", label: "Model drafting" },
  checking: { tone: "info", label: "Checking" },
  blocked: { tone: "error", label: "Blocked" },
  fixing: { tone: "warning", label: "Model fixing" },
  passed: { tone: "success", label: "Passed level 1" },
  stopped: { tone: "neutral", label: "Stopped" },
}

const STATUS_WORD: Record<RuleStatus, string> = {
  pending: "not run",
  running: "checking",
  failed: "failed",
  passed: "passed",
}

function RuleIcon({ status }: { status: RuleStatus }) {
  const cls = "mt-0.5 size-3.5 shrink-0"
  if (status === "passed") return <CheckIcon aria-hidden className={cn(cls, "text-success-700")} />
  if (status === "failed") return <XIcon aria-hidden className={cn(cls, "text-error-700")} />
  if (status === "running") return <LoaderCircleIcon aria-hidden className={cn(cls, "animate-spin motion-reduce:animate-none")} />
  return <CircleIcon aria-hidden className={cn(cls, "text-foreground/60")} />
}

function BriefColumn({ plumb }: { plumb: PlumbState }) {
  const [choice, setChoice] = useState(BRIEFINGS[0].id)
  const [text, setText] = useState(BRIEFINGS[0].text)
  const pick = (id: string) => {
    setChoice(id)
    setText(briefingOf(id)?.text ?? "")
  }

  return (
    <div className="flex flex-col gap-3 border-b border-border p-4 @2xl:w-[15.5rem] @2xl:shrink-0 @2xl:overflow-y-auto @2xl:border-r @2xl:border-b-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">Briefing</p>
      <div role="group" aria-label="Pick a briefing" className="flex flex-wrap gap-1.5">
        {BRIEFINGS.map((b) => (
          <Button
            key={b.id}
            size="xs"
            variant={choice === b.id ? "default" : "secondary"}
            aria-pressed={choice === b.id}
            disabled={plumb.running}
            className="min-h-11 @2xl:min-h-6"
            onClick={() => pick(b.id)}
          >
            {b.label}
          </Button>
        ))}
      </div>
      <div>
        <label htmlFor="plumb-brief" className="sr-only">
          Briefing text
        </label>
        <Textarea
          id="plumb-brief"
          value={text}
          disabled={plumb.running}
          onChange={(e) => setText(e.target.value)}
          className="min-h-24 text-xs leading-snug md:text-xs"
        />
        <p className="mt-1 text-[11px] text-foreground/70">Demo uses canned outputs: editing the text does not change the result. {SCRIPTED_NOTE}</p>
      </div>
      {plumb.running ? (
        <Button variant="outline" className="min-h-11 @2xl:min-h-8" onClick={plumb.stop}>
          <SquareIcon data-icon="inline-start" aria-hidden />
          Stop
        </Button>
      ) : (
        <Button className="min-h-11 @2xl:min-h-8" onClick={() => plumb.generate(choice)}>
          Generate prototype
        </Button>
      )}
    </div>
  )
}

function VerifierColumn({ plumb }: { plumb: PlumbState }) {
  const badge = PHASE_BADGE[plumb.phase]
  const showFindings = plumb.phase === "blocked" || plumb.phase === "fixing" || plumb.phase === "passed"
  const canPlant = plumb.phase === "passed"

  return (
    <div className="flex flex-col gap-3 border-t border-border p-4 @2xl:w-[17rem] @2xl:shrink-0 @2xl:overflow-y-auto @2xl:border-t-0 @2xl:border-l">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">Plumb · level 1</p>
        <StatusBadge tone={badge.tone}>{badge.label}</StatusBadge>
      </div>

      <ul aria-label="Level 1 rules" className="flex flex-col gap-1.5 text-xs">
        {RULES.map((rule) => {
          const status = ruleStatus(rule.id, plumb.phase, plumb.defects)
          return (
            <li key={rule.id} className="flex items-start gap-2">
              <RuleIcon status={status} />
              <span>
                {rule.label}
                <span className="sr-only"> ({STATUS_WORD[status]})</span>
              </span>
            </li>
          )
        })}
      </ul>

      {showFindings && plumb.defects.length > 0 ? (
        <div>
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">Findings</p>
          <ol className="flex flex-col gap-1 text-xs leading-snug">
            {plumb.defects.map((d, i) => (
              <li key={d.id} className="flex gap-2">
                <span className="w-3 shrink-0 font-mono tabular-nums text-foreground/70">{i + 1}</span>
                <span>
                  <span className="font-medium">
                    {d.severity === "block" ? "Blocks" : d.severity === "warn" ? "Warns" : "Passes, unproven"}.{" "}
                  </span>
                  {d.found}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="mt-auto border-t border-border pt-3">
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">Plant a defect</p>
        <div className="flex flex-wrap gap-1.5">
          {PLANTS.map((p) => (
            <Button
              key={p.id}
              size="xs"
              variant="outline"
              className="min-h-11 @2xl:min-h-6"
              disabled={!canPlant || plumb.defects.some((d) => d.id === p.defect.id)}
              onClick={() => plumb.plant(p.id)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        {!canPlant ? <p className="mt-1 text-[11px] text-foreground/70">Available after a passed run.</p> : null}
      </div>
    </div>
  )
}

/**
 * The hero: a briefing on the left, the page the model wrote in the middle,
 * and the checker on the right. It blocks what is wrong, the model corrects it,
 * and the planted `div` shows what a green run cannot see.
 */
export function Workbench({ plumb }: { plumb: PlumbState }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto @2xl:flex-row @2xl:overflow-hidden">
      <BriefColumn plumb={plumb} />
      <div className="min-h-[18rem] min-w-0 flex-1 @2xl:overflow-y-auto">
        <PagePreview plumb={plumb} />
      </div>
      <VerifierColumn plumb={plumb} />
    </div>
  )
}
