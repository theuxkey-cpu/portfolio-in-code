/** Window event that opens the command menu. Buttons dispatch it, so they never import the menu itself. */
export const OPEN_COMMAND_MENU_EVENT = "command-menu:open"

export function openCommandMenu(target: Window = window) {
  target.dispatchEvent(new CustomEvent(OPEN_COMMAND_MENU_EVENT))
}

export function isApplePlatform(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  return /Mac|iPhone|iPad/.test(nav.userAgentData?.platform ?? navigator.platform)
}

/**
 * ⌘K on Apple devices, Ctrl+K elsewhere. Only the platform's own modifier
 * counts: Ctrl+K on a Mac is "delete to end of line" in a text field, and
 * that must keep working. Held keys and extra modifiers are ignored. Whether
 * something else already handled the event is not checked: cmdk uses Ctrl+K
 * to move the selection, and the shortcut still has to close the menu.
 */
export function isMenuShortcut(event: KeyboardEvent): boolean {
  if (event.key.toLowerCase() !== "k" || event.repeat) return false
  if (event.shiftKey || event.altKey) return false
  return isApplePlatform() ? event.metaKey && !event.ctrlKey : event.ctrlKey && !event.metaKey
}
