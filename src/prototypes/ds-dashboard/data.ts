/**
 * A small excerpt of the design-system governance dashboard: enough items to
 * give each section context, not the full catalog. Names and statuses come
 * from the real system; file paths and the rest of the catalog are left out
 * on purpose.
 */

export type Section = "home" | "health" | "components" | "patterns" | "modules" | "decisions"
export type Tone = "success" | "warning" | "error" | "neutral" | "info"

export interface CatalogItem {
  id: string
  name: string
  kind: "Component" | "Pattern" | "Module component"
  status: "ready" | "draft"
  hasDocs: boolean
  /** How many places in the codebase import it, by static analysis. Null for module components, which nothing imports. */
  usedIn: number | null
  /** Atoms a module component is composed of. */
  builtFrom?: readonly string[]
}

export const COMPONENTS: readonly CatalogItem[] = [
  { id: "alert", name: "Alert", kind: "Component", status: "ready", hasDocs: true, usedIn: 8 },
  { id: "button", name: "Button", kind: "Component", status: "ready", hasDocs: true, usedIn: 21 },
  { id: "chip", name: "Chip", kind: "Component", status: "ready", hasDocs: true, usedIn: 12 },
  { id: "dialog", name: "Dialog", kind: "Component", status: "ready", hasDocs: false, usedIn: 7 },
  { id: "input", name: "Input", kind: "Component", status: "ready", hasDocs: true, usedIn: 5 },
  { id: "select", name: "Select", kind: "Component", status: "ready", hasDocs: true, usedIn: 4 },
  { id: "stat", name: "Stat", kind: "Component", status: "ready", hasDocs: true, usedIn: 2 },
  { id: "status-badge", name: "StatusBadge", kind: "Component", status: "ready", hasDocs: true, usedIn: 3 },
  { id: "tabs", name: "Tabs", kind: "Component", status: "ready", hasDocs: true, usedIn: 1 },
  { id: "progress", name: "Progress", kind: "Component", status: "draft", hasDocs: false, usedIn: 3 },
]

export const PATTERNS: readonly CatalogItem[] = [
  { id: "page-header", name: "PageHeader", kind: "Pattern", status: "ready", hasDocs: true, usedIn: 3 },
  { id: "sidebar-navigation", name: "SidebarNavigation", kind: "Pattern", status: "ready", hasDocs: true, usedIn: 0 },
]

export interface Screen {
  name: string
  components: readonly CatalogItem[]
}

export interface Module {
  name: string
  screens: readonly Screen[]
}

/** Module components are all in draft, as in the real catalog. */
export const MODULES: readonly Module[] = [
  {
    name: "Opportunities",
    screens: [
      {
        name: "Creation",
        components: [
          { id: "approver-chain", name: "ApproverChain", kind: "Module component", status: "draft", hasDocs: false, usedIn: null, builtFrom: ["Stepper", "StatusBadge"] },
          { id: "quantity-field", name: "QuantityField", kind: "Module component", status: "draft", hasDocs: false, usedIn: null, builtFrom: ["Input", "Button"] },
          { id: "opportunity-details", name: "OpportunityDetails", kind: "Module component", status: "draft", hasDocs: false, usedIn: null, builtFrom: ["SummaryList", "Typography"] },
        ],
      },
    ],
  },
]

export interface Decision {
  id: string
  number: number
  title: string
  where: string
  what: string
  blockedOn: string
}

export const DECISIONS: readonly Decision[] = [
  {
    id: "1",
    number: 1,
    title: "A generic wrapper for popovers with their own size?",
    where: "FilterPopover, DateFilterPopover and HistoryPopover.",
    what: "Three popovers each compose the base PopoverContent and set their own width and padding, because none fit the limit of the shared wrapper.",
    blockedOn: "A fourth consumer with the same need, or an explicit request to consolidate. Three samples with different widths don't yet say what the wrapper's API should be.",
  },
  {
    id: "2",
    number: 2,
    title: "Footer variant for DataTable",
    where: "The generic DataTable footer.",
    what: "A real screen shows a result count and “Configure columns” before “Show N”, in a different order from the current footer.",
    blockedOn: "Checking other listing screens in the same design file, to see if the pattern holds across the product.",
  },
  {
    id: "3",
    number: 3,
    title: "A border token with no mapped use",
    where: "The border-light token in the global styles.",
    what: "The token exists, but no component built so far uses it.",
    blockedOn: "A real need in a component. No speculative use.",
  },
  {
    id: "4",
    number: 4,
    title: "A clickable item with an active state: shared atom?",
    where: "FilterTabItem, ContextualTopTabItem and SidebarNavigationItem.",
    what: "Three components play the same visual role but differ in ARIA semantics and in how the active state is drawn.",
    blockedOn: "A second real consumer that needs the same behavior from two of them. Merging now would generalize an API from three different samples.",
  },
]

export interface Front {
  id: string
  name: string
  items: number
  /** 0–100, the health score of the front. */
  health: number
  coverage: number
  blockers: number
}

/** The date of the reading behind FRONTS. Shown in the prototype and in the case's "Before" block. */
export const HEALTH_READING_DATE = "2026-11-04"

/** When the same reading is scheduled to be taken again, for the "Before" block in the case. */
export const HEALTH_NEXT_READING_DATE = "2027-02-04"

/**
 * Health by front, rounded from the real catalog's reading of 2026-11-04.
 * Blockers are critical + major + minor. F6 (Governance & Architecture) is not
 * part of the dashboard excerpt.
 */
export const FRONTS: readonly Front[] = [
  { id: "F1", name: "Foundations", items: 4, health: 43, coverage: 49, blockers: 0 },
  { id: "F2", name: "Atoms", items: 55, health: 67, coverage: 62, blockers: 8 },
  { id: "F3", name: "Patterns & Compositions", items: 34, health: 69, coverage: 56, blockers: 0 },
  { id: "F4", name: "Business Rules", items: 23, health: 36, coverage: 58, blockers: 21 },
  { id: "F5", name: "Distribution", items: 12, health: 85, coverage: 71, blockers: 0 },
]

export const SUMMARY = {
  ready: 42,
  draft: 34,
  rulesImplemented: 22,
} as const
