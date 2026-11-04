"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ComponentIcon,
  HammerIcon,
  HeartPulseIcon,
  HomeIcon,
  LayersIcon,
  ShapesIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { PrototypeFrame } from "@/components/prototype/prototype-frame"
import { SidebarNavigation, SidebarNavigationMenu } from "@/components/design-system/patterns/sidebar-navigation"
import { Button } from "@/components/design-system/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/design-system/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/design-system/ui/collapsible"
import { Progress } from "@/components/design-system/ui/progress"
import { Separator } from "@/components/design-system/ui/separator"
import { Stat } from "@/components/design-system/ui/stat"
import { StatusBadge } from "@/components/design-system/ui/status-badge"
import { PREVIEWS } from "./previews"
import {
  COMPONENTS,
  DECISIONS,
  FRONTS,
  HEALTH_READING_DATE,
  MODULES,
  PATTERNS,
  SUMMARY,
  type CatalogItem,
  type Decision,
  type Section,
  type Tone,
} from "./data"

const SECTIONS: readonly { id: Section; label: string; Icon: typeof HomeIcon }[] = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "health", label: "Health", Icon: HeartPulseIcon },
  { id: "components", label: "Components", Icon: ComponentIcon },
  { id: "patterns", label: "Patterns", Icon: LayersIcon },
  { id: "modules", label: "Modules", Icon: ShapesIcon },
  { id: "decisions", label: "Pending decisions", Icon: HammerIcon },
]

const HAS_LIST: readonly Section[] = ["components", "patterns", "modules", "decisions"]

const STATUS_TONE: Record<CatalogItem["status"], Tone> = { ready: "success", draft: "neutral" }

/**
 * The design-system governance dashboard, cut down: the same six sections and
 * the same list-and-detail navigation, over a small excerpt of the catalog.
 * Read-only; everything is static data and nothing here talks to a server.
 */
export function DsDashboardPrototype() {
  const [section, setSection] = useState<Section>("home")
  const [selected, setSelected] = useState<string | null>(null)
  const [focusTick, setFocusTick] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)

  // After a move (new section, item opened, back to the list) focus goes to the
  // heading now on screen, so the click's target unmounting never drops it.
  // Skipped until the first move so nothing steals focus on mount.
  useEffect(() => {
    if (focusTick > 0) headingRef.current?.focus()
  }, [focusTick])

  const label = SECTIONS.find((s) => s.id === section)?.label ?? ""
  const hasList = HAS_LIST.includes(section)

  function goTo(next: Section) {
    setSection(next)
    setSelected(null)
    setFocusTick((n) => n + 1)
  }

  function open(id: string | null) {
    setSelected(id)
    setFocusTick((n) => n + 1)
  }

  return (
    <PrototypeFrame
      title="Design system dashboard"
      label="Design system dashboard prototype"
      notice="Preview only — full dashboard shown in interviews"
      announcement={selected ? `${label}: item opened` : `${label} section`}
    >
      <div className="flex min-h-0 flex-1 flex-col @2xl:flex-row">
        <SidebarNavigation
          aria-label="Dashboard sections"
          className="h-auto w-full flex-row border-r-0 border-b border-border @2xl:h-full @2xl:w-52 @2xl:flex-col @2xl:border-r @2xl:border-b-0"
        >
          <SidebarNavigationMenu className="flex-row overflow-x-auto overflow-y-hidden p-1.5 @2xl:flex-col @2xl:overflow-x-hidden @2xl:overflow-y-auto @2xl:p-2">
            {SECTIONS.map(({ id, label: text, Icon }) => (
              <NavButton key={id} active={section === id} onClick={() => goTo(id)}>
                <span className="shrink-0 [&_svg]:size-4">
                  <Icon aria-hidden />
                </span>
                <span className="min-w-0 flex-1 truncate">{text}</span>
              </NavButton>
            ))}
          </SidebarNavigationMenu>
        </SidebarNavigation>

        <div className="flex min-h-0 min-w-0 flex-1">
          {hasList ? (
            <aside
              aria-label={label}
              className={cn(
                "w-full shrink-0 overflow-y-auto border-border p-2 @2xl:block @2xl:w-60 @2xl:border-r",
                selected ? "hidden" : "block"
              )}
            >
              {section === "components" ? (
                <CatalogList items={COMPONENTS} selected={selected} onOpen={open} />
              ) : null}
              {section === "patterns" ? <CatalogList items={PATTERNS} selected={selected} onOpen={open} /> : null}
              {section === "modules" ? <ModuleTree selected={selected} onOpen={open} /> : null}
              {section === "decisions" ? <DecisionList selected={selected} onOpen={open} /> : null}
            </aside>
          ) : null}

          <div
            role="region"
            aria-label={`${label} content`}
            tabIndex={0}
            className={cn(
              "min-w-0 flex-1 overflow-y-auto p-4 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring @2xl:p-5",
              hasList && !selected ? "hidden @2xl:block" : "block"
            )}
          >
            {hasList && selected ? (
              <Button variant="ghost" size="sm" className="-ml-2 mb-2 @2xl:hidden" onClick={() => open(null)}>
                <ArrowLeftIcon data-icon="inline-start" />
                Back to the list
              </Button>
            ) : null}

            {section === "home" ? <Home headingRef={headingRef} onGo={goTo} /> : null}
            {section === "health" ? <Health headingRef={headingRef} /> : null}
            {hasList && !selected ? (
              <p className="text-sm italic text-muted-foreground">Select an item in the list to see its details.</p>
            ) : null}
            {(section === "components" || section === "patterns" || section === "modules") && selected ? (
              <CatalogDetail
                headingRef={headingRef}
                item={[...COMPONENTS, ...PATTERNS, ...MODULES.flatMap((m) => m.screens.flatMap((sc) => sc.components))].find(
                  (c) => c.id === selected
                )}
              />
            ) : null}
            {section === "decisions" && selected ? (
              <DecisionDetail headingRef={headingRef} decision={DECISIONS.find((d) => d.id === selected)} />
            ) : null}
          </div>
        </div>
      </div>
    </PrototypeFrame>
  )
}

// The pattern's SidebarNavigationItem is an anchor; here a section is a state change, not a
// URL, so it is a button with the same look (an `href="#x"` would read as a skip link).
function NavButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      data-slot="sidebar-navigation-item"
      data-active={active ? "" : undefined}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className="flex min-h-11 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium text-sidebar-foreground outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground @2xl:min-h-0"
    >
      {children}
    </button>
  )
}

type HeadingRef = React.RefObject<HTMLHeadingElement | null>

function Heading({ headingRef, children }: { headingRef: HeadingRef; children: ReactNode }) {
  return (
    <h2 ref={headingRef} tabIndex={-1} className="text-lg font-semibold outline-none">
      {children}
    </h2>
  )
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{children}</h3>
}

function ListRow({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring @2xl:min-h-0",
        active && "bg-muted"
      )}
    >
      {children}
    </button>
  )
}

function CatalogList({
  items,
  selected,
  onOpen,
}: {
  items: readonly CatalogItem[]
  selected: string | null
  onOpen: (id: string) => void
}) {
  return (
    <ul className="flex flex-col">
      {items.map((item) => (
        <li key={item.id}>
          <ListRow active={selected === item.id} onClick={() => onOpen(item.id)}>
            <span className="truncate font-medium">{item.name}</span>
            <StatusBadge tone={STATUS_TONE[item.status]}>{item.status}</StatusBadge>
          </ListRow>
        </li>
      ))}
    </ul>
  )
}

function ModuleTree({ selected, onOpen }: { selected: string | null; onOpen: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      {MODULES.map((mod) =>
        mod.screens.map((screen) => (
          <Collapsible key={`${mod.name}/${screen.name}`} defaultOpen>
            <CollapsibleTrigger className="group flex min-h-11 w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring @2xl:min-h-0">
              <span className="truncate">
                {mod.name} / {screen.name}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {screen.components.length}
                <ChevronDownIcon className="size-3.5 transition-transform group-data-[state=closed]:-rotate-90" aria-hidden />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="flex flex-col">
                {screen.components.map((block) => (
                  <li key={block.id}>
                    <ListRow active={selected === block.id} onClick={() => onOpen(block.id)}>
                      <span className="flex min-w-0 items-center gap-1.5">
                        <ComponentIcon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                        <span className="truncate font-medium">{block.name}</span>
                      </span>
                    </ListRow>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        ))
      )}
    </div>
  )
}

function DecisionList({ selected, onOpen }: { selected: string | null; onOpen: (id: string) => void }) {
  return (
    <ul className="flex flex-col">
      {DECISIONS.map((d) => (
        <li key={d.id}>
          <ListRow active={selected === d.id} onClick={() => onOpen(d.id)}>
            <span className="line-clamp-2 font-medium">
              {d.number}. {d.title}
            </span>
          </ListRow>
        </li>
      ))}
    </ul>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <div className="text-sm">{children}</div>
    </div>
  )
}

function CatalogDetail({ headingRef, item }: { headingRef: HeadingRef; item: CatalogItem | undefined }) {
  if (!item) return null
  const preview = PREVIEWS[item.id]
  return (
    <div className="flex flex-col gap-4">
      <Heading headingRef={headingRef}>{item.name}</Heading>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>{item.builtFrom ? "A simplified composition of this design system's atoms." : "The real component from this portfolio's design system."}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-24 flex-wrap items-center justify-center gap-3 rounded-lg bg-muted/40 p-4">
            {preview ? preview() : <p className="text-sm italic text-muted-foreground">No live preview in this excerpt.</p>}
          </div>
        </CardContent>
      </Card>
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>{item.kind}</CardTitle>
          <CardDescription>Catalog entry: status, documentation and {item.builtFrom ? "what it is built from" : "where it is used"}.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Field label="Status">
            <StatusBadge tone={STATUS_TONE[item.status]}>{item.status}</StatusBadge>
          </Field>
          <Field label="Documentation">{item.hasDocs ? "Has a documentation page" : "Story only, no docs page"}</Field>
          <Separator />
          {item.builtFrom ? (
            <Field label="Built from">{item.builtFrom.join(", ")}</Field>
          ) : (
            <Field label="Used in">
              {item.usedIn === 0 ? (
                <span className="text-muted-foreground">
                  No use found in the code (static import analysis, so it can miss some).
                </span>
              ) : (
                `${item.usedIn} ${item.usedIn === 1 ? "place" : "places"} in the code`
              )}
            </Field>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DecisionDetail({ headingRef, decision }: { headingRef: HeadingRef; decision: Decision | undefined }) {
  if (!decision) return null
  return (
    <div className="flex max-w-xl flex-col gap-3">
      <Heading headingRef={headingRef}>
        Pending decision {decision.number}: {decision.title}
      </Heading>
      <p className="text-sm">
        <strong>Where:</strong> {decision.where}
      </p>
      <p className="text-sm">
        <strong>What:</strong> {decision.what}
      </p>
      <p className="text-sm">
        <strong>Blocked on:</strong> {decision.blockedOn}
      </p>
    </div>
  )
}

function Home({ headingRef, onGo }: { headingRef: HeadingRef; onGo: (s: Section) => void }) {
  const total = SUMMARY.ready + SUMMARY.draft
  const pct = Math.round((SUMMARY.ready / total) * 1000) / 10
  const blockers = FRONTS.reduce((n, f) => n + f.blockers, 0)
  const attention: { key: string; tone: "warning" | "error"; label: string; title: string; detail: string; to: Section; action: string }[] = [
    {
      key: "decisions",
      tone: "warning",
      label: "Attention",
      title: `${DECISIONS.length} design system decisions pending`,
      detail: "They block the items that depend on them",
      to: "decisions",
      action: "See decisions",
    },
    {
      key: "blockers",
      tone: "warning",
      label: "Attention",
      title: `${blockers} open blockers in the health snapshot`,
      detail: "Across the Atoms and Business Rules fronts",
      to: "health",
      action: "See health",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Heading headingRef={headingRef}>Home</Heading>
        <p className="text-sm text-muted-foreground">Operational view of the design system</p>
      </div>

      <section className="flex flex-col gap-2">
        <Eyebrow>Overview</Eyebrow>
        <Card>
          <CardContent className="grid gap-5 @lg:grid-cols-3">
            <Stat label="Components" labelClassName="font-medium" value={`${SUMMARY.ready} ready`} caption={`${SUMMARY.draft} in draft`} />
            <Stat
              label="Business rules"
              labelClassName="font-medium"
              value={`${SUMMARY.rulesImplemented} implemented`}
              caption="with passing tests"
            />
            <Stat
              label="Governance"
              labelClassName="font-medium"
              value={`${DECISIONS.length} pending`}
              caption="design system decisions"
            />
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-2">
        <Eyebrow>Catalog progress</Eyebrow>
        <Card>
          <CardContent className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-medium">Component readiness</span>
              <span className="text-muted-foreground">{total} components in total</span>
            </div>
            <Progress value={pct} aria-label="Components ready" className="h-4" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">{SUMMARY.ready}</strong> ready ·{" "}
              <strong className="text-foreground">{SUMMARY.draft}</strong> draft · {pct}% ready
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="flex flex-col gap-2">
        <Eyebrow>Needs attention</Eyebrow>
        <ul className="flex flex-col gap-2">
          {attention.map((a) => (
            <li key={a.key}>
              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <StatusBadge tone={a.tone}>{a.label}</StatusBadge>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{a.title}</p>
                      <p className="text-sm text-muted-foreground">{a.detail}</p>
                    </div>
                  </div>
                  <Button variant="link" className="text-foreground underline" onClick={() => onGo(a.to)}>
                    {a.action}
                    <ArrowRightIcon data-icon="inline-end" />
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function Health({ headingRef }: { headingRef: HeadingRef }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <Heading headingRef={headingRef}>Health</Heading>
        <p className="text-sm text-muted-foreground">
          One score per front, from the evidence the catalog collects. A reading of {HEALTH_READING_DATE}, not a live one.
        </p>
      </div>
      <ul className="flex flex-col gap-3">
        {FRONTS.map((f) => (
          <li key={f.id}>
            <Card size="sm">
              <CardContent className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium">
                    {f.id} · {f.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{f.items} items</span>
                    <StatusBadge tone={f.blockers > 0 ? "warning" : "success"}>
                      {f.blockers > 0 ? `${f.blockers} ${f.blockers === 1 ? "blocker" : "blockers"}` : "no blockers"}
                    </StatusBadge>
                  </div>
                </div>
                <Progress value={f.health} aria-label={`${f.name} health`} />
                <p className="text-xs text-muted-foreground">
                  Health <strong className="text-foreground">{f.health}</strong> · coverage {f.coverage}%
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
