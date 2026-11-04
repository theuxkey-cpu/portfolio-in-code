"use client"

import { useEffect } from "react"
import { STORY_LOADERS } from "@/lib/registry/loaders"
import { decodeArgs } from "@/lib/shell/args"
import type { ControlSchema, StoryMeta } from "@/lib/registry/types"
import { useShell } from "./shell-provider"

interface StorySyncProps {
  readonly meta: StoryMeta
}

/**
 * Renders nothing — it's how the (server) story page tells the (client)
 * ShellProvider which story is active. The server page only knows
 * StoryMeta (registry/meta.ts is server-safe); the control schema lives in
 * the story's own "use client" module, so this resolves it the same way
 * StoryHost does, client-side, via STORY_LOADERS.
 *
 * The shell's own `?a=` is read here, in the browser, so reloading
 * /system/... restores the last configured args. It is not read on the server:
 * that would make every story page dynamic (Cache-Control: no-store, no CDN
 * cache, no back/forward cache) for a query string that only the browser
 * ever sets.
 */
export function StorySync({ meta }: StorySyncProps) {
  const { registerActiveStory } = useShell()

  useEffect(() => {
    let cancelled = false
    const loader = STORY_LOADERS[meta.slug]
    const load = loader ? loader() : Promise.resolve(null)

    load.then((mod) => {
      if (cancelled) return
      const controls = mod?.story.controls as ControlSchema | undefined
      const initialArgsParam = new URLSearchParams(window.location.search).get("a") ?? undefined
      const initialArgs = controls ? decodeArgs(initialArgsParam, controls) : undefined
      registerActiveStory(meta, controls, mod?.story.source, initialArgs)
    })

    return () => {
      cancelled = true
    }
  }, [meta, registerActiveStory])

  return null
}
