/**
 * Everything the fictional prototype-checker prototype knows and says. The
 * design system (Tessera), the tool (Plumb), the company, the people and every
 * figure are invented. The drafts and the corrections are written by hand and
 * played back; no model and no real checker run behind it. Every number here
 * is illustrative.
 */

/** Label for the seal that goes on every figure. */
export const ILLUSTRATIVE = "Illustrative figures"
/** Label for the prototype itself, so it is never taken for the real tool. */
export const SIMULATION = "Simulation, not the real tool"
export const SCRIPTED_NOTE = "Briefings and outputs are scripted."

/* ----------------------------------------------------------------- rules */

export type RuleId = "class" | "token" | "component" | "text" | "icon"

export interface Rule {
  id: RuleId
  /** What the rule checks, as the report prints it. */
  label: string
}

/** The five level-1 rules. A failing one blocks delivery. */
export const RULES: readonly Rule[] = [
  { id: "class", label: "Every class exists in the compiled CSS" },
  { id: "token", label: "Every token exists in Tessera" },
  { id: "component", label: "Every component is in the catalog" },
  { id: "text", label: "Titles and actions trace to the brief" },
  { id: "icon", label: "Every icon is from the closed set" },
]

/** What a level-1 run never looks at. Always printed, even on a green run. */
export const NOT_VERIFIED: readonly string[] = [
  "Text contrast on every surface",
  "Overlap and broken layout",
  "Whether each component is used the way its guidance says",
  "Anything the page builds with a script",
]

/* --------------------------------------------------------------- defects */

export type Severity = "block" | "warn" | "blind"
export type Target = "heading" | "status" | "primary" | "secondary" | "list"

/**
 * One thing wrong (or unprovable) in the generated page. `block` stops
 * delivery, `warn` is reported and delivered, `blind` is something the check
 * passes without being able to tell: it only shows up in "Not verified".
 */
export interface Defect {
  id: string
  rule: RuleId | "mock" | "declared"
  severity: Severity
  target: Target
  /** What the checker prints. */
  found: string
  /** What the model wrote and the correction dropped. */
  dropped?: string
  /** What the correction kept or wrote instead. */
  kept?: string
}

export type PlantId = "token" | "declared" | "mock"

export interface Plant {
  id: PlantId
  label: string
  defect: Defect
}

/** The three defects a reader can plant after a green run. */
export const PLANTS: readonly Plant[] = [
  {
    id: "token",
    label: "Invented token",
    defect: {
      id: "plant-token",
      rule: "token",
      severity: "block",
      target: "primary",
      found: "Token --tessera-accent-9 does not exist",
      dropped: "--tessera-accent-9",
      kept: "--tessera-accent",
    },
  },
  {
    id: "declared",
    label: "Styled div",
    defect: {
      id: "plant-declared",
      rule: "declared",
      severity: "blind",
      target: "secondary",
      found: "“Reject” is a div declared as Button",
    },
  },
  {
    id: "mock",
    label: "Sample data",
    defect: {
      id: "plant-mock",
      rule: "mock",
      severity: "warn",
      target: "list",
      found: "Amounts are sample data (marked data-mock)",
    },
  },
]

/* ------------------------------------------------------------- briefings */

export interface ScreenRow {
  a: string
  b: string
  c: string
}

/** The page Plumb "generated" for a briefing, once corrected. */
export interface Screen {
  heading: string
  /** The heading the model wrote first, before the text rule rejected it. */
  invented: string
  columns: readonly [string, string, string]
  rows: readonly ScreenRow[]
  primary: string
  secondary: string
  /** A component Tessera does not have yet, kept and marked "Proposal". */
  proposal: { name: string; label: string }
}

export interface Briefing {
  id: string
  label: string
  text: string
  screen: Screen
  /** What the first draft got wrong. */
  draft: readonly Defect[]
}

const mock = (id: string): Defect => ({
  id,
  rule: "mock",
  severity: "warn",
  target: "list",
  found: "Customer names are sample data (marked data-mock)",
})

export const BRIEFINGS: readonly Briefing[] = [
  {
    id: "orders",
    label: "Order approvals",
    text: "A manager approves or rejects orders above their limit. Show customer, order total and how long it has waited. Approve and reject actions, and a way to approve several at once.",
    screen: {
      heading: "Order approvals",
      invented: "Smart approvals",
      columns: ["Customer", "Total", "Waiting"],
      rows: [
        { a: "Alder Garage", b: "$1,240.00", c: "2 days" },
        { a: "Birch Motors", b: "$860.50", c: "1 day" },
        { a: "Cedar Hardware", b: "$2,310.00", c: "5 hours" },
      ],
      primary: "Approve",
      secondary: "Reject",
      proposal: { name: "BulkBar", label: "Approve selected" },
    },
    draft: [
      { id: "o1", rule: "token", severity: "block", target: "primary", found: "Token --tessera-accent-7 does not exist", dropped: "--tessera-accent-7", kept: "--tessera-accent" },
      { id: "o2", rule: "class", severity: "block", target: "status", found: "Class bg-brand-soft is not in the compiled CSS", dropped: "bg-brand-soft", kept: "the neutral status badge" },
      { id: "o3", rule: "text", severity: "block", target: "heading", found: "Heading “Smart approvals” is not in the brief", dropped: "“Smart approvals”", kept: "“Order approvals”" },
      mock("o4"),
    ],
  },
  {
    id: "credit",
    label: "Credit limit requests",
    text: "Show requests to raise a customer's credit limit: customer, current limit and requested limit. A manager approves a request or sends it back.",
    screen: {
      heading: "Credit limit requests",
      invented: "Unlock your credit potential",
      columns: ["Customer", "Current", "Requested"],
      rows: [
        { a: "Dune Supply", b: "$20,000", c: "$35,000" },
        { a: "Elm Fleet", b: "$8,000", c: "$12,000" },
        { a: "Fir Logistics", b: "$50,000", c: "$60,000" },
      ],
      primary: "Approve",
      secondary: "Send back",
      proposal: { name: "LimitMeter", label: "Usage against the limit" },
    },
    draft: [
      { id: "c1", rule: "token", severity: "block", target: "list", found: "Token --tessera-gap-13 does not exist", dropped: "--tessera-gap-13", kept: "--tessera-gap-4" },
      { id: "c2", rule: "component", severity: "block", target: "status", found: "Component StatusPill is not in the catalog", dropped: "StatusPill", kept: "Badge" },
      { id: "c3", rule: "text", severity: "block", target: "heading", found: "Heading “Unlock your credit potential” is not in the brief", dropped: "“Unlock your credit potential”", kept: "“Credit limit requests”" },
      mock("c4"),
    ],
  },
  {
    id: "delivery",
    label: "Late deliveries",
    text: "List deliveries that missed their slot: order, planned date and new date. A dispatcher reassigns or cancels each one.",
    screen: {
      heading: "Late deliveries",
      invented: "Never miss a delivery",
      columns: ["Order", "Planned", "New date"],
      rows: [
        { a: "#1042", b: "Mon 12", c: "Wed 14" },
        { a: "#1047", b: "Mon 12", c: "Thu 15" },
        { a: "#1051", b: "Tue 13", c: "Fri 16" },
      ],
      primary: "Reassign",
      secondary: "Cancel",
      proposal: { name: "TimelineRail", label: "Route timeline" },
    },
    draft: [
      { id: "d1", rule: "class", severity: "block", target: "heading", found: "Class text-brand-xl is not in the compiled CSS", dropped: "text-brand-xl", kept: "the heading style" },
      { id: "d2", rule: "token", severity: "block", target: "status", found: "Token --tessera-warn-ink does not exist", dropped: "--tessera-warn-ink", kept: "--tessera-warning" },
      { id: "d3", rule: "component", severity: "block", target: "list", found: "Component RouteChip is not in the catalog", dropped: "RouteChip", kept: "Chip" },
      { id: "d4", rule: "text", severity: "block", target: "heading", found: "Heading “Never miss a delivery” is not in the brief", dropped: "“Never miss a delivery”", kept: "“Late deliveries”" },
      mock("d5"),
    ],
  },
]

export const briefingOf = (id: string | null) => BRIEFINGS.find((b) => b.id === id)

/* --------------------------------------------------------------- funnel */

/** Defects found in 20 audited prototypes before the checker existed. */
export const DEFECTS_BEFORE = 100
/** Share of those in the layer level 1 can see (class, token, component, text, icon). */
export const CHECKED_POINTS = 72
export const UNCHECKED_POINTS = DEFECTS_BEFORE - CHECKED_POINTS
/** Audited points per prototype that were right before and after, by layer. */
export const CHECKED_RIGHT = { before: 39, after: 69 } as const
export const UNCHECKED_RIGHT = { before: 15, after: 15 } as const

export const checkedShare = (right: number) => right / CHECKED_POINTS
export const totalRight = (checked: number, unchecked: number) => checked + unchecked

export const REVIEW_ROUNDS = { before: 3.1, after: 1.2 } as const
export const reviewDrop = () => (REVIEW_ROUNDS.before - REVIEW_ROUNDS.after) / REVIEW_ROUNDS.before

export const ANALYSTS = { before: 2, after: 8, of: 9 } as const

export const TIME = {
  before: "2.5 days",
  beforeParts: "2 days in a designer's queue + half a day of building",
  after: "35 min",
  afterParts: "35 minutes of active time",
} as const

/* ------------------------------------------------------------- decisions */

export interface DesignDecision {
  id: string
  title: string
  chose: string
  discarded: string
  why: string
}

export const DECISIONS: readonly DesignDecision[] = [
  {
    id: "verdict",
    title: "What the report says",
    chose: "Verified, not verified, or blocked, written by the script and never “validated” on its own.",
    discarded: "A score from 0 to 100, written by the model.",
    why: "A score reads as proof. A list of what was and was not checked tells a person where to look.",
  },
  {
    id: "block",
    title: "Block or warn",
    chose: "Block on a missing token, class or component and on text that is not in the brief. Warn on sample data and missing states.",
    discarded: "Block on everything.",
    why: "Sample data is unavoidable and missing states need judgment. Blocking on them teaches people to ignore the check.",
  },
  {
    id: "proposal",
    title: "A component Tessera does not have",
    chose: "Allow it, with a visible “Proposal” mark on the page.",
    discarded: "Refuse it, or allow it unmarked.",
    why: "Refusing stops the analyst. Unmarked, engineering assumes the component exists.",
  },
]
