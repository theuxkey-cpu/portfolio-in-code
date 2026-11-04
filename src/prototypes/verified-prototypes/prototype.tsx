"use client"

import { useState } from "react"

import { PrototypeFrame } from "@/components/prototype/prototype-frame"
import { ControlStripBar, Readout, ReadoutStrip } from "@/components/prototype/control-strip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/design-system/ui/tabs"
import { ILLUSTRATIVE, NOT_VERIFIED, SIMULATION } from "./data"
import { DecisionsView } from "./decisions-view"
import { FunnelView } from "./funnel-view"
import { ReportView } from "./report-view"
import { usePlumb } from "./use-plumb"
import { Workbench } from "./workbench"

const VIEWS = [
  { value: "workbench", label: "Workbench" },
  { value: "report", label: "Report" },
  { value: "funnel", label: "Figures" },
  { value: "decisions", label: "Decisions" },
] as const

/**
 * A fictional prototype checker (Plumb) for a fictional design system
 * (Tessera). A briefing becomes a page, level 1 blocks what does not trace to
 * the system or the brief, and the report always says what it did not check.
 * Everything is scripted; no model and no real checker run behind it.
 */
export function VerifiedPrototypesPrototype() {
  const [view, setView] = useState<string>("workbench")
  const plumb = usePlumb()

  const level = plumb.phase === "passed" ? "Passed" : plumb.phase === "blocked" || plumb.phase === "fixing" ? "Blocked" : "—"

  return (
    <PrototypeFrame
      title="Tessera prototype checker · Concept"
      label="Prototype checker"
      notice={SIMULATION}
      announcement={plumb.announcement}
      controls={
        <ControlStripBar onReset={plumb.reset}>
          <ReadoutStrip>
            <Readout label="Figures" value={ILLUSTRATIVE} />
            <Readout label="Level 1" value={level} tone={level === "Passed" ? true : level === "Blocked" ? false : null} />
            <Readout label="Blocked" value={plumb.blocked} />
            <Readout label="Warnings" value={plumb.warnings} />
            <Readout label="Not verified" value={plumb.phase === "passed" ? NOT_VERIFIED.length + plumb.blind : "—"} />
          </ReadoutStrip>
        </ControlStripBar>
      }
    >
      <Tabs value={view} onValueChange={setView} className="min-h-0 flex-1 gap-0">
        <div className="border-b border-border px-3">
          <TabsList variant="line" aria-label="Prototype views" className="w-auto justify-start gap-1 p-0 group-data-[orientation=horizontal]/tabs:h-11 @2xl:group-data-[orientation=horizontal]/tabs:h-9">
            {VIEWS.map((v) => (
              <TabsTrigger
                key={v.value}
                value={v.value}
                className="h-full flex-none px-2 text-[13px] @2xl:px-3 group-data-[orientation=horizontal]/tabs:after:bottom-0"
              >
                {v.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="workbench" className="flex min-h-0 flex-1 flex-col">
          <Workbench plumb={plumb} />
        </TabsContent>
        <TabsContent value="report" className="flex min-h-0 flex-1 flex-col">
          <ReportView plumb={plumb} />
        </TabsContent>
        <TabsContent value="funnel" className="flex min-h-0 flex-1 flex-col">
          <FunnelView />
        </TabsContent>
        <TabsContent value="decisions" className="flex min-h-0 flex-1 flex-col">
          <DecisionsView plumb={plumb} />
        </TabsContent>
      </Tabs>
    </PrototypeFrame>
  )
}
