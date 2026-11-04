"use client"

import { useCallback, useSyncExternalStore, type MouseEvent } from "react"
import { flushSync } from "react-dom"
import {
  applyTheme,
  readAppliedTheme,
  setTheme as commitTheme,
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme"

/**
 * Single source of truth for reading/writing the dark-mode class + localStorage
 * key that the anti-FOUC script in the root layout also reads. Any UI that
 * needs to know or change the theme (the floating toggle, the shell toolbar,
 * the preview iframe bridge) should go through this hook instead of touching
 * `document.documentElement.classList` / `localStorage` directly.
 *
 * Built on useSyncExternalStore rather than useState+useEffect: the theme is
 * genuinely external state (DOM class + localStorage, mutated by an inline
 * script before hydration even runs), which is exactly what this API is for
 * — it also sidesteps the "setState synchronously in an effect" pitfall a
 * naive read-on-mount effect would hit.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeToThemeChanges, readAppliedTheme, getServerTheme)

  const set = useCallback((next: Theme) => {
    commitTheme(next)
  }, [])

  /** Pass the click event so the new theme reveals as a circle growing from the button. */
  const toggle = useCallback((event?: MouseEvent<HTMLElement>) => {
    const next: Theme = readAppliedTheme() === "dark" ? "light" : "dark"
    const rect = event?.currentTarget.getBoundingClientRect()
    commitThemeAnimated(next, rect && { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }, [])

  return { theme, set, toggle }
}

function getServerTheme(): Theme {
  return "light"
}

function subscribeToThemeChanges(onChange: () => void): () => void {
  function onStorage(event: StorageEvent) {
    if (event.key === THEME_STORAGE_KEY) onChange()
  }

  window.addEventListener(THEME_CHANGE_EVENT, onChange)
  window.addEventListener("storage", onStorage)
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange)
    window.removeEventListener("storage", onStorage)
  }
}

const THEME_REVEAL_MS = 400

/**
 * Circle-reveal theme change (View Transitions API, as in Magic UI's Animated
 * Theme Toggler). Falls back to an instant change without startViewTransition
 * or under prefers-reduced-motion. Same-origin iframes (the shell's Stage) are
 * themed inside the transition callback: their own "storage" listener would
 * land a frame too late for the new-state snapshot.
 */
function commitThemeAnimated(next: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement
  const commit = () => {
    commitTheme(next)
    for (const frame of document.querySelectorAll("iframe")) {
      try {
        if (frame.contentDocument) applyTheme(next, frame.contentDocument)
      } catch {
        // cross-origin frame: nothing to sync
      }
    }
  }

  if (
    !origin ||
    typeof document.startViewTransition !== "function" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    root.dataset.themeVt === "active"
  ) {
    commit()
    return
  }

  // innerWidth/innerHeight, not visualViewport: percentages resolve against the
  // snapshot box, which includes classic scrollbars.
  const { innerWidth: w, innerHeight: h } = window
  const radius = Math.hypot(Math.max(origin.x, w - origin.x), Math.max(origin.y, h - origin.y))
  const at = `${(origin.x / w) * 100}% ${(origin.y / h) * 100}%`
  const from = `circle(0% at ${at})`
  const to = `circle(${(radius / (Math.hypot(w, h) / Math.SQRT2)) * 100}% at ${at})`

  root.dataset.themeVt = "active"
  root.style.setProperty("--theme-vt-clip-from", from)
  const cleanup = () => {
    delete root.dataset.themeVt
    root.style.removeProperty("--theme-vt-clip-from")
  }

  const transition = document.startViewTransition(() => flushSync(commit))
  transition.finished.then(cleanup, cleanup)
  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [from, to] },
        { duration: THEME_REVEAL_MS, easing: "ease-in-out", fill: "forwards", pseudoElement: "::view-transition-new(root)" }
      )
    })
    .catch(() => {})
}
