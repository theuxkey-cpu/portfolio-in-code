"use client"

import { useSyncExternalStore } from "react"
import { Search } from "lucide-react"
import { isApplePlatform, openCommandMenu } from "@/lib/command-menu"
import { cn } from "@/lib/utils"

function subscribe() {
  return () => {}
}

function getShortcutLabel() {
  return isApplePlatform() ? "⌘K" : "Ctrl K"
}

/**
 * Visible way in to the command menu, so it does not depend on knowing the
 * shortcut (and works on a phone). The shortcut hint only shows from md up.
 */
export function CommandMenuButton({ className, compact = false }: { className?: string; compact?: boolean }) {
  const shortcut = useSyncExternalStore(subscribe, getShortcutLabel, () => "Ctrl K")

  return (
    <button
      type="button"
      onClick={() => openCommandMenu()}
      aria-label="Search pages and links"
      aria-keyshortcuts="Control+K Meta+K"
      className={cn(
        "inline-flex items-center gap-2 rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
        compact ? "size-7 justify-center hover:bg-[var(--shell-line)]" : "h-9 min-w-9 justify-center border border-border px-2.5 text-[13px] hover:bg-muted",
        className
      )}
    >
      <Search size={compact ? 15 : 14} strokeWidth={1.75} aria-hidden="true" />
      {compact ? null : (
        <>
          <span className="sr-only sm:not-sr-only">Search</span>
          <kbd className="hidden rounded border border-border px-1.5 py-0.5 text-[11px] font-medium md:inline" aria-hidden="true">
            {shortcut}
          </kbd>
        </>
      )}
    </button>
  )
}
