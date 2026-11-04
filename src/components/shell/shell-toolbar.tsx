"use client"

import Link from "next/link"
import { Toolbar } from "@base-ui/react/toolbar"
import { House, Laptop, Menu, Moon, Smartphone, Sun, X } from "lucide-react"
import { CommandMenuButton } from "@/components/command-menu/command-menu-button"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"
import { useShell, type Viewport } from "./shell-provider"

const VIEWPORTS: { readonly value: Viewport; readonly label: string; readonly icon: typeof Laptop }[] = [
  { value: "desktop", label: "Desktop", icon: Laptop },
  { value: "mobile", label: "Mobile", icon: Smartphone },
]

export function ShellToolbar() {
  const { activeMeta, viewport, setViewport, railOpen, setRailOpen } = useShell()
  const { theme, toggle } = useTheme()
  const dark = theme === "dark"

  return (
    <Toolbar.Root
      aria-label="Story toolbar"
      className="flex h-[var(--shell-toolbar-h)] items-center gap-3 border-b border-[var(--shell-line)] bg-[var(--shell-panel)] px-3"
    >
      <Toolbar.Button
        onClick={() => setRailOpen(!railOpen)}
        aria-label={railOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={railOpen}
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--shell-line)] hover:text-foreground md:hidden"
      >
        {railOpen ? <X size={15} strokeWidth={1.75} /> : <Menu size={15} strokeWidth={1.75} />}
      </Toolbar.Button>

      <Link
        href="/"
        aria-label="Back to the home page"
        className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--shell-line)] hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <House size={15} strokeWidth={1.75} />
      </Link>

      <p className="min-w-0 flex-1 truncate text-[13px] text-muted-foreground">
        {activeMeta ? (
          <>
            <span className="text-muted-foreground">{activeMeta.group}</span>
            <span className="mx-1.5 text-muted-foreground/40">/</span>
            <span className="font-medium text-foreground">{activeMeta.title}</span>
          </>
        ) : (
          "System"
        )}
      </p>

      {/* Simulating a 375px viewport inside a phone screen already ~390px
       * wide is meaningless — desktop-only. */}
      <Toolbar.Group className="hidden items-center gap-0.5 rounded-md border border-[var(--shell-line)] p-0.5 md:flex">
        {VIEWPORTS.map(({ value, label, icon: Icon }) => (
          <Toolbar.Button
            key={value}
            aria-pressed={viewport === value}
            onClick={() => setViewport(value)}
            className={cn(
              "flex size-6 items-center justify-center rounded-[calc(var(--radius-sm)-1px)] text-muted-foreground transition-colors hover:text-foreground",
              viewport === value && "bg-[var(--shell-line)] text-foreground"
            )}
          >
            <Icon size={13} strokeWidth={1.75} />
            <span className="sr-only">{label}</span>
          </Toolbar.Button>
        ))}
      </Toolbar.Group>

      <Toolbar.Separator className="hidden h-4 w-px bg-[var(--shell-line)] md:block" />

      <CommandMenuButton compact />

      <Toolbar.Button
        onClick={toggle}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-[var(--shell-line)] hover:text-foreground"
      >
        {dark ? <Sun size={14} strokeWidth={1.75} /> : <Moon size={14} strokeWidth={1.75} />}
      </Toolbar.Button>
    </Toolbar.Root>
  )
}
