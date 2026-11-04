"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from "react"
import type { Args, ControlSchema, StoryMeta } from "@/lib/registry/types"
import { defaultArgs } from "@/lib/shell/args"
import { SHELL_CHANNEL, type AuditSummary, type ShellToPreview } from "@/lib/shell/protocol"

export type Viewport = "mobile" | "desktop"
export type InspectorTab = "controls" | "a11y" | "source"
export type SourceFn = (args: Args) => string

export type AuditState =
  | { readonly status: "idle" }
  | { readonly status: "running"; readonly requestId: string }
  | { readonly status: "done"; readonly result: AuditSummary; readonly argsSnapshot: Args }
  | { readonly status: "error"; readonly message: string }

interface ShellContextValue {
  readonly activeMeta: StoryMeta | null
  readonly activeControls: ControlSchema | null
  readonly activeSource: SourceFn | null
  readonly args: Args
  readonly setArg: (key: string, value: Args[string]) => void
  readonly resetArgs: () => void
  readonly viewport: Viewport
  readonly setViewport: (viewport: Viewport) => void
  readonly inspectorTab: InspectorTab
  readonly setInspectorTab: (tab: InspectorTab) => void
  /** Below the `md:` breakpoint the story rail becomes an overlay drawer
   * instead of a static column — this is its open/closed state. Unused
   * (and harmless) at `md:` and up, where the rail is always visible via
   * CSS regardless of this flag. */
  readonly railOpen: boolean
  readonly setRailOpen: (open: boolean) => void
  /** Called by <StorySync> once it has resolved the active route's story
   * module client-side (server pages only know StoryMeta, not the schema).
   * `initialArgs`, when given, comes from decoding the shell URL's own `?a=`
   * (so reloading /system/... restores whatever was last configured)
   * instead of the story's bare defaults. */
  readonly registerActiveStory: (
    meta: StoryMeta,
    controls: ControlSchema | undefined,
    source: SourceFn | undefined,
    initialArgs: Args | undefined
  ) => void
  /** Bumped by the toolbar's reload button; <Stage> appends it to the
   * iframe src to force a real reload (setting the same src twice is a
   * browser no-op). Decoupled from Stage owning the iframe ref directly. */
  readonly reloadToken: number
  readonly reload: () => void
  /** Shared with <Stage>, which owns the actual <iframe> element — living
   * here instead of local to Stage lets <A11yPanel>, three levels away in
   * the tree, send it a message without prop-drilling or a second listener. */
  readonly iframeRef: RefObject<HTMLIFrameElement | null>
  readonly auditState: AuditState
  readonly requestAudit: () => void
  /** Called by <Stage>'s message listener when an audit:result/error comes
   * back — the only place that validates the message's origin/source. */
  readonly resolveAudit: (requestId: string, outcome: { result: AuditSummary } | { error: string }) => void
}

const ShellContext = createContext<ShellContextValue | null>(null)

let auditRequestCounter = 0

export function ShellProvider({ children }: { children: ReactNode }) {
  const [activeMeta, setActiveMeta] = useState<StoryMeta | null>(null)
  const [activeControls, setActiveControls] = useState<ControlSchema | null>(null)
  const [activeSource, setActiveSource] = useState<SourceFn | null>(null)
  const [args, setArgsState] = useState<Args>({})
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>("controls")
  const [railOpen, setRailOpen] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const [auditState, setAuditState] = useState<AuditState>({ status: "idle" })
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  const registerActiveStory = useCallback(
    (meta: StoryMeta, controls: ControlSchema | undefined, source: SourceFn | undefined, initialArgs: Args | undefined) => {
      setActiveMeta(meta)
      setActiveControls(controls ?? null)
      // setState treats a bare function argument as an updater — wrap it so
      // the SourceFn itself is stored as state, not invoked as one.
      setActiveSource(() => source ?? null)
      setArgsState(initialArgs ?? (controls ? defaultArgs(controls) : {}))
      setAuditState({ status: "idle" })
    },
    []
  )

  const setArg = useCallback((key: string, value: Args[string]) => {
    setArgsState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetArgs = useCallback(() => {
    setArgsState(activeControls ? defaultArgs(activeControls) : {})
  }, [activeControls])

  // requestAudit/resolveAudit are stable callbacks (empty deps) but
  // resolveAudit needs the *current* args at completion time to snapshot
  // for staleness — a ref sidesteps re-creating the callback on every arg
  // change, which would otherwise force Stage's message-listener effect to
  // re-subscribe constantly. Written in an effect, never during render.
  const currentArgsRef = useRef<Args>(args)
  useEffect(() => {
    currentArgsRef.current = args
  }, [args])

  const requestAudit = useCallback(() => {
    const contentWindow = iframeRef.current?.contentWindow
    if (!contentWindow) return
    auditRequestCounter += 1
    const requestId = `audit-${auditRequestCounter}`
    setAuditState({ status: "running", requestId })
    const message: ShellToPreview = { channel: SHELL_CHANNEL, type: "audit:run", requestId }
    contentWindow.postMessage(message, window.location.origin)
  }, [])

  const resolveAudit = useCallback((requestId: string, outcome: { result: AuditSummary } | { error: string }) => {
    setAuditState((current) => {
      if (current.status !== "running" || current.requestId !== requestId) return current
      if ("error" in outcome) return { status: "error", message: outcome.error }
      return { status: "done", result: outcome.result, argsSnapshot: currentArgsRef.current }
    })
  }, [])

  const value = useMemo<ShellContextValue>(
    () => ({
      activeMeta,
      activeControls,
      activeSource,
      args,
      setArg,
      resetArgs,
      viewport,
      setViewport,
      inspectorTab,
      setInspectorTab,
      railOpen,
      setRailOpen,
      registerActiveStory,
      reloadToken,
      reload,
      iframeRef,
      auditState,
      requestAudit,
      resolveAudit,
    }),
    [
      activeMeta,
      activeControls,
      activeSource,
      args,
      setArg,
      resetArgs,
      viewport,
      inspectorTab,
      railOpen,
      registerActiveStory,
      reloadToken,
      reload,
      auditState,
      requestAudit,
      resolveAudit,
    ]
  )

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
}

export function useShell(): ShellContextValue {
  const ctx = useContext(ShellContext)
  if (!ctx) throw new Error("useShell must be used within a ShellProvider")
  return ctx
}
