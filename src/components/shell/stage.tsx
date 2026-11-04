"use client"

import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { encodeArgs } from "@/lib/shell/args"
import { isPreviewToShell, isTrustedShellMessage, SHELL_CHANNEL, type ShellToPreview } from "@/lib/shell/protocol"
import { useShell, type Viewport } from "./shell-provider"

const SYSTEM_PREFIX = "/system/"

const VIEWPORT_WIDTH: Record<Viewport, string> = {
  mobile: "375px",
  desktop: "1280px",
}

/**
 * Owns the preview iframe. Derives the target slug straight from
 * usePathname() rather than from ShellProvider's activeMeta — that state is
 * only populated after StorySync's client effect resolves the story module,
 * which would otherwise leave the iframe without a src for a render or two.
 * usePathname() is available on the very first client render, no flash.
 */
export function Stage() {
  const pathname = usePathname()
  const { viewport, reloadToken, args, activeControls, activeMeta, iframeRef, resolveAudit } = useShell()
  // The src this "ready" applies to, not a bare boolean — deriving
  // `ready = readySrc === src` means a src change is automatically "not
  // ready" with no separate effect needed to reset it.
  const [readySrc, setReadySrc] = useState<string | null>(null)

  const slug = useMemo(() => {
    if (!pathname.startsWith(SYSTEM_PREFIX)) return null
    return pathname.slice(SYSTEM_PREFIX.length)
  }, [pathname])

  const src = useMemo(() => {
    if (!slug) return undefined
    // Setting an iframe's src to the same string is a no-op in browsers —
    // the reload token forces a distinct URL so the toolbar's reload button
    // actually reloads the document instead of doing nothing.
    return reloadToken > 0 ? `/preview/${slug}?_r=${reloadToken}` : `/preview/${slug}`
  }, [slug, reloadToken])

  const ready = readySrc === src

  // Readiness is driven by the "preview:ready" handshake, not the iframe's
  // native onLoad — onLoad fires once the HTML document has loaded, before
  // the story module has finished its own dynamic import and mounted.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (!isTrustedShellMessage(event, iframeRef.current?.contentWindow ?? null)) return
      const data: unknown = event.data
      if (!isPreviewToShell(data)) return
      if (data.type === "preview:ready") setReadySrc(src ?? null)
      if (data.type === "preview:error") {
        console.error(`[system] story "${data.message}" crashed while rendering.`)
      }
      if (data.type === "audit:result") resolveAudit(data.requestId, { result: data.result })
      if (data.type === "audit:error") resolveAudit(data.requestId, { error: data.message })
    }

    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [src, iframeRef, resolveAudit])

  // Push arg changes into the iframe once it's confirmed ready. The iframe's
  // src carries no `?a=`: the args reach it here, after "preview:ready".
  useEffect(() => {
    if (!ready) return
    const contentWindow = iframeRef.current?.contentWindow
    if (!contentWindow) return
    const message: ShellToPreview = { channel: SHELL_CHANNEL, type: "args:set", args }
    contentWindow.postMessage(message, window.location.origin)
  }, [ready, args, iframeRef])

  // Mirror args into the shell's own address bar (not the iframe's) so
  // reloading /system/... — or copying its URL — restores the same
  // configuration, via history.replaceState rather than the router so it
  // never triggers a navigation/re-render of the page underneath.
  useEffect(() => {
    // Only once the story that owns these controls is the one in the URL: right
    // after a navigation the old story's args would otherwise be written under
    // the new slug and then decoded against the new story's schema.
    if (!activeControls || !slug || activeMeta?.slug !== slug) return
    const url = `${SYSTEM_PREFIX}${slug}?a=${encodeArgs(args)}`
    window.history.replaceState(null, "", url)
  }, [activeControls, args, slug, activeMeta])

  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Select a story from the list.
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-auto bg-[var(--stage-bg)] p-0 md:p-6">
      {/* Below md: full-bleed, ignoring the desktop/mobile viewport toggle
       * (its control is hidden there too — see ShellToolbar). Above md: the
       * toggle's chosen width, via a CSS var so one class list covers both. */}
      <div
        className="relative h-full max-h-full w-full shadow-[0_0_0_1px_var(--shell-line)] transition-[width] duration-150 md:w-[var(--stage-w)]"
        style={{ "--stage-w": VIEWPORT_WIDTH[viewport] } as CSSProperties}
      >
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        )}
        <iframe
          ref={iframeRef}
          title="Story preview"
          src={src}
          className={cn(
            "h-full w-full border-0 bg-[var(--stage-bg)] transition-opacity",
            ready ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </div>
  )
}
