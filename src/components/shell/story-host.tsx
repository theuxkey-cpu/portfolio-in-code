"use client"

import { Component, useEffect, useState, type ReactNode } from "react"
import { STORY_LOADERS } from "@/lib/registry/loaders"
import { decodeArgs } from "@/lib/shell/args"
import { applyTheme, readStoredTheme, THEME_STORAGE_KEY } from "@/lib/theme"
import { runComponentAudit } from "@/lib/shell/a11y"
import { isShellToPreview, isTrustedShellMessage, SHELL_CHANNEL, type PreviewToShell } from "@/lib/shell/protocol"
import type { Args, ControlSchema, StoryDef, StoryLayout } from "@/lib/registry/types"

interface StoryHostProps {
  readonly slug: string
}

type LoadState =
  | { readonly status: "loading" }
  | { readonly status: "error"; readonly message: string }
  | { readonly status: "ready"; readonly story: StoryDef }

export const LAYOUT_CLASS: Record<StoryLayout, string> = {
  centered: "flex min-h-dvh w-full items-center justify-center p-10",
  padded: "min-h-dvh w-full p-10",
  fullscreen: "min-h-dvh w-full",
}

/**
 * Runs inside the /preview iframe (same-origin). Owns loading the story
 * module, decoding its initial args, and rendering it — this is also where
 * the a11y audit will run in Passo 7, since axe-core must execute in the
 * same document it's auditing (see src/lib/shell/a11y.ts).
 */
export function StoryHost({ slug }: StoryHostProps) {
  const [state, setState] = useState<LoadState>({ status: "loading" })
  const [args, setArgs] = useState<Args | null>(null)

  useEffect(() => {
    let cancelled = false
    const loader = STORY_LOADERS[slug]
    // Routed through the same .then/.catch path as a real load failure —
    // setState only ever happens inside a promise callback, never
    // synchronously in the effect body.
    const load = loader ? loader() : Promise.reject(new Error(`No story registered for "${slug}".`))

    load
      .then((mod) => {
        if (cancelled) return
        setState({ status: "ready", story: mod.story })
        // The `?a=` query value is read once here, in the browser, so the page
        // itself stays static. Live updates after that come over postMessage
        // from the shell (see the effect below).
        const initialArgsParam = new URLSearchParams(window.location.search).get("a") ?? undefined
        setArgs(decodeArgs(initialArgsParam, mod.story.controls ?? ({} as ControlSchema)))
      })
      .catch((error: unknown) => {
        if (cancelled) return
        setState({ status: "error", message: error instanceof Error ? error.message : "Failed to load story." })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  // Theme sync: the shell's <html class="dark"> lives in a different
  // document (this iframe's own), so toggling it there doesn't touch this
  // document. But same-origin windows DO receive a native "storage" event
  // when another one of them writes localStorage — including an iframe of
  // the window that wrote it. No postMessage needed for this one signal.
  useEffect(() => {
    applyTheme(readStoredTheme())
    function onStorage(event: StorageEvent) {
      if (event.key === THEME_STORAGE_KEY) applyTheme(readStoredTheme())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  // The args bridge: announce readiness once the story has actually
  // mounted with its initial args, then accept live arg updates from the
  // shell for as long as this document lives. The listener is registered
  // in the same synchronous effect tick as the "ready" post, so there's no
  // window where the shell could send a message before anyone is listening.
  useEffect(() => {
    if (state.status !== "ready" || args === null) return
    if (window.parent === window) return // standalone tab, no shell to talk to
    // Narrowing `state.status === "ready"` doesn't survive into the nested
    // onMessage closure below (TS can't prove `state` isn't reassigned by
    // the time it runs), so capture the one field it needs directly.
    const a11yConfig = state.story.a11y

    function onMessage(event: MessageEvent) {
      if (!isTrustedShellMessage(event, window.parent)) return
      const data: unknown = event.data
      if (!isShellToPreview(data)) return
      if (data.type === "args:set") setArgs(data.args)
      if (data.type === "audit:run") {
        const { requestId } = data
        runComponentAudit(a11yConfig)
          .then((result) => {
            const message: PreviewToShell = { channel: SHELL_CHANNEL, type: "audit:result", requestId, result }
            window.parent.postMessage(message, window.location.origin)
          })
          .catch((error: unknown) => {
            const message: PreviewToShell = {
              channel: SHELL_CHANNEL,
              type: "audit:error",
              requestId,
              message: error instanceof Error ? error.message : "Audit failed.",
            }
            window.parent.postMessage(message, window.location.origin)
          })
      }
    }

    window.addEventListener("message", onMessage)
    const ready: PreviewToShell = { channel: SHELL_CHANNEL, type: "preview:ready", slug, height: document.documentElement.scrollHeight }
    window.parent.postMessage(ready, window.location.origin)

    return () => window.removeEventListener("message", onMessage)
    // Only re-announce readiness when the story identity actually changes —
    // args changing afterward must NOT re-trigger this (that would re-fire
    // "ready" on every keystroke in a control).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status, slug])

  if (state.status === "loading") return null

  if (state.status === "error") {
    return (
      <div className="flex min-h-dvh items-center justify-center p-10">
        <p className="max-w-[420px] text-center text-sm text-destructive">{state.message}</p>
      </div>
    )
  }

  if (args === null) return null

  const layout = state.story.layout ?? "centered"

  return (
    <div className={LAYOUT_CLASS[layout]}>
      <StoryErrorBoundary>{state.story.render(args)}</StoryErrorBoundary>
    </div>
  )
}

interface ErrorBoundaryState {
  readonly error: Error | null
}

export class StoryErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error) {
    if (window.parent === window) return
    const message: PreviewToShell = { channel: SHELL_CHANNEL, type: "preview:error", message: error.message }
    window.parent.postMessage(message, window.location.origin)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="max-w-[480px] p-6 text-sm text-destructive">
          <p className="font-medium">This story crashed while rendering.</p>
          <pre className="mt-2 overflow-auto whitespace-pre-wrap text-xs">{this.state.error.message}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
