"use client"

import { Tabs } from "@base-ui/react/tabs"
import { cn } from "@/lib/utils"
import { useShell, type InspectorTab } from "./shell-provider"
import { ControlsPanel } from "./controls-panel"
import { A11yPanel } from "./a11y-panel"
import { SourcePanel } from "./source-panel"

const TABS: { readonly value: InspectorTab; readonly label: string }[] = [
  { value: "controls", label: "Controls" },
  { value: "a11y", label: "A11y" },
  { value: "source", label: "Source" },
]

export function Inspector() {
  const { inspectorTab, setInspectorTab } = useShell()

  return (
    <Tabs.Root
      value={inspectorTab}
      onValueChange={(value) => setInspectorTab(value as InspectorTab)}
      className="flex h-full flex-col"
    >
      <Tabs.List className="flex shrink-0 border-b border-[var(--shell-line)] px-2">
        {TABS.map((tab) => (
          <Tabs.Tab
            key={tab.value}
            value={tab.value}
            className={cn(
              "px-3 py-2.5 text-[13px] text-muted-foreground transition-colors",
              "data-[active]:font-medium data-[active]:text-foreground"
            )}
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <Tabs.Panel value="controls">
          <ControlsPanel />
        </Tabs.Panel>
        <Tabs.Panel value="a11y">
          <A11yPanel />
        </Tabs.Panel>
        <Tabs.Panel value="source">
          <SourcePanel />
        </Tabs.Panel>
      </div>
    </Tabs.Root>
  )
}
