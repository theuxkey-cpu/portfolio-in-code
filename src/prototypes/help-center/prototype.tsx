"use client"

import { useState } from "react"

import { PrototypeFrame } from "@/components/prototype/prototype-frame"
import { ControlStripBar, Readout, ReadoutStrip } from "@/components/prototype/control-strip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/design-system/ui/tabs"
import { DEFAULT_FUNNEL, ILLUSTRATIVE, totalDrop, type FunnelInput } from "./data"
import { CoverageMap } from "./coverage-map"
import { FunnelSimulator } from "./funnel-simulator"
import { QuoteScreen } from "./quote-screen"
import { RumoChat } from "./rumo-chat"
import { useQuoteScreen } from "./use-quote-screen"
import { useRumo } from "./use-rumo"

const VIEWS = [
  { value: "funnel", label: "Funnel" },
  { value: "rumo", label: "Rumo" },
  { value: "quote", label: "Quote screen" },
  { value: "coverage", label: "Coverage" },
] as const

/**
 * Help center for a field-sales ERP (Rota) and its assistant (Rumo), names changed.
 * The parts arrive in phases: the funnel simulator and the chat first, then the
 * quote screen with its tour, and the coverage map. Replies are scripted; no
 * model runs behind it.
 */
export function HelpCenterPrototype() {
  const [view, setView] = useState<string>("funnel")
  const [funnel, setFunnel] = useState<FunnelInput>(DEFAULT_FUNNEL)
  const [note, setNote] = useState("")
  const rumo = useRumo()
  const quote = useQuoteScreen()

  const drop = Math.round(totalDrop(funnel) * 100)

  const reset = () => {
    setFunnel(DEFAULT_FUNNEL)
    rumo.reset()
    quote.reset()
    setNote(`Reset. Tickets down ${Math.round(totalDrop(DEFAULT_FUNNEL) * 100)} percent.`)
  }

  return (
    <PrototypeFrame
      title="Rota help center · Concept"
      label="Help center prototype"
      notice="Real work — sample data"
      announcement={rumo.announcement || note}
      controls={
        <ControlStripBar onReset={reset}>
          <ReadoutStrip>
            <Readout label="Figures" value={ILLUSTRATIVE} />
            <Readout label="Ticket drop" value={`${drop}%`} />
            <Readout label="Answered with a source" value={rumo.answered} />
            <Readout label="Declined" value={rumo.declined} />
            <Readout label="Sent to a person" value={rumo.escalated} />
          </ReadoutStrip>
        </ControlStripBar>
      }
    >
      <Tabs value={view} onValueChange={setView} className="min-h-0 flex-1 gap-0">
        <div className="overflow-x-auto border-b border-border px-3">
          <TabsList variant="line" aria-label="Prototype views" className="w-auto justify-start gap-1 p-0 group-data-[orientation=horizontal]/tabs:h-11 @2xl:group-data-[orientation=horizontal]/tabs:h-9">
            {VIEWS.map((v) => (
              <TabsTrigger
                key={v.value}
                value={v.value}
                className="h-full flex-none px-3 text-[13px] group-data-[orientation=horizontal]/tabs:after:bottom-0"
              >
                {v.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="funnel" className="flex min-h-0 flex-1 flex-col">
          <FunnelSimulator
            value={funnel}
            onChange={(next) => {
              setFunnel(next)
              setNote("")
            }}
          />
        </TabsContent>
        <TabsContent value="rumo" className="flex min-h-0 flex-1 flex-col">
          <RumoChat rumo={rumo} />
        </TabsContent>
        <TabsContent value="quote" className="flex min-h-0 flex-1 flex-col">
          <QuoteScreen quote={quote} />
        </TabsContent>
        <TabsContent value="coverage" className="flex min-h-0 flex-1 flex-col">
          <CoverageMap />
        </TabsContent>
      </Tabs>
    </PrototypeFrame>
  )
}
