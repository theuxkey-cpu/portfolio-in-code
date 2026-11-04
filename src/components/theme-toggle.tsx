"use client"

import { Moon, Sun } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTheme } from "@/hooks/use-theme"

export function ThemeToggle() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const dark = theme === "dark"

  // The /system shell has its own toggle in the header, and /preview renders
  // inside the shell's stage iframe — the floating button would duplicate
  // the header one there.
  if (pathname.startsWith("/system") || pathname.startsWith("/preview")) return null

  return (
    <button
      onClick={toggle}
      data-theme-toggle
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-5 right-5 z-50 flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm transition-colors hover:text-foreground"
    >
      {dark ? <Sun size={15} strokeWidth={1.75} /> : <Moon size={15} strokeWidth={1.75} />}
    </button>
  )
}
