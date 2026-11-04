import type { Args } from "@/lib/registry/types"

/** Namespaced so a stray postMessage from an extension or another frame
 * can't be mistaken for shell traffic just by having the right `type`. */
export const SHELL_CHANNEL = "vc-system" as const

export interface AuditNode {
  readonly target: readonly string[]
  readonly html: string
  readonly failureSummary?: string
}

export interface AuditIssue {
  readonly id: string
  readonly impact: "minor" | "moderate" | "serious" | "critical" | null
  readonly help: string
  readonly helpUrl: string
  readonly tags: readonly string[]
  readonly nodes: readonly AuditNode[]
}

export interface AuditExclusion {
  readonly id: string
  readonly reason: string
}

export interface AuditSummary {
  readonly ranAt: number
  /** e.g. "axe-core 4.12.0" — rendered next to the results so the panel
   * reads as a real audit, not a canned checklist. */
  readonly engine: string
  readonly violations: readonly AuditIssue[]
  readonly incomplete: readonly AuditIssue[]
  /** Count of rules that ran and passed (results.passes.length). */
  readonly rulesPassed: number
  readonly excluded: readonly AuditExclusion[]
}

export type ShellToPreview =
  | { readonly channel: typeof SHELL_CHANNEL; readonly type: "args:set"; readonly args: Args }
  | { readonly channel: typeof SHELL_CHANNEL; readonly type: "theme:set"; readonly theme: "light" | "dark" }
  | { readonly channel: typeof SHELL_CHANNEL; readonly type: "audit:run"; readonly requestId: string }

export type PreviewToShell =
  | { readonly channel: typeof SHELL_CHANNEL; readonly type: "preview:ready"; readonly slug: string; readonly height: number }
  | { readonly channel: typeof SHELL_CHANNEL; readonly type: "preview:height"; readonly height: number }
  | { readonly channel: typeof SHELL_CHANNEL; readonly type: "preview:error"; readonly message: string }
  | {
      readonly channel: typeof SHELL_CHANNEL
      readonly type: "preview:key"
      readonly key: string
      readonly meta: boolean
      readonly ctrl: boolean
      readonly shift: boolean
      readonly alt: boolean
    }
  | { readonly channel: typeof SHELL_CHANNEL; readonly type: "audit:result"; readonly requestId: string; readonly result: AuditSummary }
  | { readonly channel: typeof SHELL_CHANNEL; readonly type: "audit:error"; readonly requestId: string; readonly message: string }

const SHELL_TO_PREVIEW_TYPES = new Set<ShellToPreview["type"]>(["args:set", "theme:set", "audit:run"])
const PREVIEW_TO_SHELL_TYPES = new Set<PreviewToShell["type"]>([
  "preview:ready",
  "preview:height",
  "preview:error",
  "preview:key",
  "audit:result",
  "audit:error",
])

function isChannelMessage(data: unknown): data is { channel: string; type: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { channel?: unknown }).channel === SHELL_CHANNEL &&
    typeof (data as { type?: unknown }).type === "string"
  )
}

export function isShellToPreview(data: unknown): data is ShellToPreview {
  return isChannelMessage(data) && SHELL_TO_PREVIEW_TYPES.has(data.type as ShellToPreview["type"])
}

export function isPreviewToShell(data: unknown): data is PreviewToShell {
  return isChannelMessage(data) && PREVIEW_TO_SHELL_TYPES.has(data.type as PreviewToShell["type"])
}

/**
 * Every postMessage listener on either side of the bridge MUST run its event
 * through this before trusting the payload. Same-origin is necessary but not
 * sufficient — `expectedSource` pins it to the exact window the shell/preview
 * pair is actually talking to, so another same-origin frame or tab can't
 * inject state.
 */
export function isTrustedShellMessage(event: MessageEvent, expectedSource: Window | null): boolean {
  if (typeof window === "undefined") return false
  if (expectedSource === null) return false
  if (event.origin !== window.location.origin) return false
  return event.source === expectedSource
}
