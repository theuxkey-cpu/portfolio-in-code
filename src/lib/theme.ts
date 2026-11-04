/**
 * Pure DOM helpers for the manual (no next-themes) dark-mode implementation.
 * No React here — this is shared by the anti-FOUC script contract, the
 * `useTheme` hook, and (later) the shell's same-origin iframe bridge, which
 * all need to agree on the same storage key and the same "apply" mechanics.
 */

export type Theme = "light" | "dark"

export const THEME_STORAGE_KEY = "theme"
/** Fired on `window` whenever this tab changes the theme, so same-tab
 * subscribers (useSyncExternalStore) can react the same way the "storage"
 * event already lets *other* tabs react — the browser only fires "storage"
 * for tabs other than the one that wrote the value. */
export const THEME_CHANGE_EVENT = "vc-theme-change"

export function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return window.localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light"
}

export function readAppliedTheme(doc: Document = document): Theme {
  return doc.documentElement.classList.contains("dark") ? "dark" : "light"
}

export function applyTheme(theme: Theme, doc: Document = document): void {
  doc.documentElement.classList.toggle("dark", theme === "dark")
}

export function persistTheme(theme: Theme): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function setTheme(theme: Theme, doc: Document = document): void {
  applyTheme(theme, doc)
  persistTheme(theme)
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }
}
