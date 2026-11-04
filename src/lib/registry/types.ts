import type { ReactNode } from "react"

/**
 * Contracts for the story registry. This file has no runtime React import
 * (only `import type`), so it stays safe to import from server components —
 * the sidebar tree and `generateStaticParams` read `meta.ts` (which imports
 * this file) without pulling any client code into the server bundle.
 */

export type StoryKind = "doc" | "tokens" | "component" | "flow"
export type StoryStatus = "stable" | "wip" | "deprecated"

export interface StoryMeta {
  /** Path after /system or /preview, e.g. "ui/button". No leading/trailing slash. */
  readonly slug: string
  readonly title: string
  /** First level of the sidebar tree, e.g. "Profile", "Components". */
  readonly group: string
  /** Optional second level, e.g. "UI". */
  readonly subgroup?: string
  readonly kind: StoryKind
  readonly status?: StoryStatus
  /** Shown in generateMetadata and as a tree-item tooltip. */
  readonly summary?: string
  /** Ordering within its group/subgroup; lower first. Default 100. */
  readonly order?: number
  /**
   * Hides the right-hand Inspector (Controls / A11y / Source) for this story.
   * Case pages set it: their content is for visitors, not a component to inspect.
   */
  readonly hideInspector?: boolean
}

interface ControlBase {
  readonly label?: string
  readonly hint?: string
}

export interface ControlOption {
  readonly value: string
  readonly label?: string
}

export type ControlDef =
  | (ControlBase & { readonly type: "text"; readonly default: string; readonly placeholder?: string })
  | (ControlBase & { readonly type: "boolean"; readonly default: boolean })
  | (ControlBase & {
      readonly type: "number"
      readonly default: number
      readonly min?: number
      readonly max?: number
      readonly step?: number
    })
  | (ControlBase & { readonly type: "select"; readonly default: string; readonly options: readonly ControlOption[] })
  | (ControlBase & { readonly type: "radio"; readonly default: string; readonly options: readonly ControlOption[] })

export type ControlSchema = Readonly<Record<string, ControlDef>>

export type ArgValue = string | number | boolean
export type Args = Readonly<Record<string, ArgValue>>

/** Derives the typed args shape from a control schema's `default` values. */
export type ArgsOf<S extends ControlSchema> = { readonly [K in keyof S]: S[K]["default"] }

export interface StoryA11yConfig {
  readonly disableRules?: readonly string[]
  readonly enableRules?: readonly string[]
  readonly skip?: boolean
}

/** Reserved for Fase 2+ (design-quality checklist). Frozen now so the panel
 * that will eventually render this doesn't force a schema change later. */
export interface StoryCriterion {
  readonly id: string
  readonly label: string
  readonly detail?: string
}

export type StoryLayout = "centered" | "padded" | "fullscreen"

export interface StoryDef<S extends ControlSchema = ControlSchema> {
  readonly meta: StoryMeta
  readonly controls?: S
  readonly render: (args: ArgsOf<S>) => ReactNode
  /** Function of args, not a fixed string — otherwise the displayed code
   * lies the moment a control changes. */
  readonly source?: (args: ArgsOf<S>) => string
  readonly layout?: StoryLayout
  readonly a11y?: StoryA11yConfig
  readonly criteria?: readonly StoryCriterion[]
}

export type StoryTreeNode =
  | { readonly type: "group"; readonly id: string; readonly label: string; readonly children: readonly StoryTreeNode[] }
  | { readonly type: "story"; readonly id: string; readonly meta: StoryMeta }
