"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import type { StoryTreeNode } from "@/lib/registry/types"
import { getStoryMeta } from "@/lib/registry/meta"
import { cn } from "@/lib/utils"
import { ShellToolbar } from "./shell-toolbar"
import { StoryTree } from "./story-tree"
import { Stage } from "./stage"
import { Inspector } from "./inspector"
import { useShell } from "./shell-provider"

interface ShellChromeProps {
  readonly tree: readonly StoryTreeNode[]
  readonly year: number
  /** The route's page content — just an invisible <StorySync>, never
   * anything visual. The Stage (iframe) is chrome, not per-route content,
   * so it lives here rather than in the page. */
  readonly children: ReactNode
}

export function ShellChrome({ tree, year, children }: ShellChromeProps) {
  const { railOpen, setRailOpen } = useShell()
  // Derived from the URL, not from ShellProvider's activeMeta: that only
  // fills in after a client effect, which would flash the Inspector first.
  const pathname = usePathname()
  const slug = pathname.startsWith("/system/") ? pathname.slice("/system/".length) : ""
  const showInspector = !getStoryMeta(slug)?.hideInspector

  return (
    <>
      <header className="shrink-0">
        <ShellToolbar />
      </header>
      {/* Below md: the rail is an overlay drawer (absolute + translate,
       * opened from the toolbar's menu button) and the Inspector — a
       * design-system tool, not visitor content — is hidden outright. At
       * md: and up both revert to the original static three-column layout,
       * regardless of `railOpen`. */}
      <div className="relative flex min-h-0 flex-1">
        {railOpen && (
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setRailOpen(false)}
            className="absolute inset-0 z-10 bg-black/30 md:hidden"
          />
        )}
        <div
          className={cn(
            "absolute inset-y-0 left-0 z-20 w-[var(--shell-rail-w)] overflow-y-auto border-r border-[var(--shell-line)] bg-[var(--shell-panel)] transition-transform duration-200 md:static md:z-auto md:w-[var(--shell-rail-w)] md:shrink-0 md:translate-x-0",
            railOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <StoryTree tree={tree} />
        </div>
        <main className="min-w-0 flex-1">
          <Stage />
        </main>
        {showInspector ? (
          <aside
            aria-label="Inspector"
            className="hidden w-[var(--shell-inspector-w)] shrink-0 overflow-hidden border-l border-[var(--shell-line)] bg-[var(--shell-panel)] md:block"
          >
            <Inspector />
          </aside>
        ) : null}
      </div>
      <footer className="shrink-0 border-t border-[var(--shell-line)] bg-[var(--shell-panel)] px-3 py-1.5 text-center text-[11px] text-muted-foreground">
        © {year} Keythe Rueckert
      </footer>
      {children}
    </>
  )
}
