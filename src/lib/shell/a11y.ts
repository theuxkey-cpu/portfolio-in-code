import type Axe from "axe-core"
import type { AuditIssue, AuditSummary } from "@/lib/shell/protocol"
import type { StoryA11yConfig } from "@/lib/registry/types"

export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] as const

export interface RuleExclusion {
  readonly id: string
  readonly reason: string
}

/**
 * Rules that are correct at document scope but produce structural false
 * positives when axe audits a single rendered component instead of a full
 * page. Verified against node_modules/axe-core/axe.js selectors — `region`
 * and the `landmark-*-is-top-level` rules apply to `body *`, so scoping the
 * run context alone does not exclude them; they have to be disabled.
 *
 * Every entry here is rendered in the a11y panel with its `reason`, so a
 * clean result reads as an honest, scoped pass — not a hidden filter.
 */
export const COMPONENT_SCOPE_EXCLUSIONS: readonly RuleExclusion[] = [
  {
    id: "region",
    reason:
      "Requires every element to belong to a landmark region. A story renders a component outside of page context — there is no landmark to belong to. Checked at the page level, not here.",
  },
  { id: "bypass", reason: "Page-level rule (skip link / landmark navigation). Not a single component's responsibility." },
  { id: "landmark-one-main", reason: "Document structure." },
  { id: "landmark-unique", reason: "Compares landmarks across an entire document." },
  { id: "landmark-no-duplicate-banner", reason: "Document structure." },
  { id: "landmark-no-duplicate-contentinfo", reason: "Document structure." },
  { id: "landmark-no-duplicate-main", reason: "Document structure." },
  {
    id: "landmark-banner-is-top-level",
    reason: "A <header> inside a story is never a direct child of <body> — this would fail by construction.",
  },
  { id: "landmark-contentinfo-is-top-level", reason: "Same reason as banner." },
  { id: "landmark-main-is-top-level", reason: "Same reason as banner." },
  { id: "page-has-heading-one", reason: "A component should not own the page's h1." },
  { id: "html-has-lang", reason: "Document attribute, set once in the root layout." },
  { id: "html-lang-valid", reason: "Document attribute." },
  { id: "html-xml-lang-mismatch", reason: "Document attribute." },
  { id: "document-title", reason: "Document title." },
  { id: "skip-link", reason: "Requires the anchor target to exist in the same document; a story has no page to skip." },
  {
    id: "focus-order-semantics",
    reason: "Flagged experimental by axe-core itself — too many false positives to report as a result.",
  },
] as const

/** Disabled by default in axe-core; opted back in on purpose. */
export const OPT_IN_RULES = ["target-size"] as const

export function buildRunOptions(config?: StoryA11yConfig): Axe.RunOptions {
  const rules: Record<string, { enabled: boolean }> = {}
  for (const rule of COMPONENT_SCOPE_EXCLUSIONS) rules[rule.id] = { enabled: false }
  for (const id of OPT_IN_RULES) rules[id] = { enabled: true }
  for (const id of config?.enableRules ?? []) rules[id] = { enabled: true }
  for (const id of config?.disableRules ?? []) rules[id] = { enabled: false }

  return {
    runOnly: { type: "tag", values: [...AXE_TAGS] },
    rules,
    resultTypes: ["violations", "incomplete"],
    selectors: true,
    ancestry: true,
    elementRef: false,
    reporter: "v2",
  }
}

/**
 * Scope is the whole <body>, not the story's own root element. Base UI's
 * Dialog / Tooltip / Select portal their content straight to document.body,
 * so scoping to the story root would report "0 violations" while auditing
 * an empty wrapper around a portaled dialog.
 */
export function buildAuditContext(): Axe.ContextSpec {
  return {
    include: ["body"],
    exclude: ["[data-preview-chrome]"],
  }
}

let auditInFlight = false

/**
 * Runs axe-core against the current document. MUST be called from inside the
 * preview iframe's own document, not from the parent against
 * `iframe.contentDocument` — axe-core does not support running cross-document
 * (see node_modules/axe-core/README.md, "include the javascript file in each
 * of your iframes"). Dynamically imported so the ~550KB engine never lands in
 * the main site bundle.
 */
export async function runComponentAudit(config?: StoryA11yConfig): Promise<AuditSummary> {
  if (config?.skip) {
    return { ranAt: Date.now(), engine: "skipped", violations: [], incomplete: [], rulesPassed: 0, excluded: [] }
  }
  if (auditInFlight) {
    throw new Error("An accessibility audit is already running.")
  }

  auditInFlight = true
  try {
    const axeModule = await import("axe-core")
    const axe = axeModule.default

    if (typeof document !== "undefined" && document.fonts) {
      await document.fonts.ready
    }
    // Two rAFs so layout/paint settles before color-contrast sampling —
    // without this it's flaky and reports false "serious" violations.
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
    })

    const results = await axe.run(buildAuditContext(), buildRunOptions(config))

    return {
      ranAt: Date.now(),
      engine: `axe-core ${axe.version}`,
      violations: results.violations.map(toAuditIssue),
      incomplete: results.incomplete.map(toAuditIssue),
      rulesPassed: results.passes.length,
      excluded: COMPONENT_SCOPE_EXCLUSIONS.filter((rule) => !(config?.enableRules ?? []).includes(rule.id)),
    }
  } finally {
    auditInFlight = false
  }
}

function toAuditIssue(result: Axe.Result): AuditIssue {
  return {
    id: result.id,
    impact: result.impact ?? null,
    help: result.help,
    helpUrl: result.helpUrl,
    tags: result.tags,
    nodes: result.nodes.map((node) => ({
      target: node.target.map((selector) => (typeof selector === "string" ? selector : JSON.stringify(selector))),
      html: node.html,
      failureSummary: node.failureSummary,
    })),
  }
}
