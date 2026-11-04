"use client"

import { Toaster } from "sonner"
import { useTheme } from "@/hooks/use-theme"

/**
 * sonner's <Toaster> took a hardcoded theme="light" before, so a toast fired
 * in dark mode rendered as a light card — visible on /lab/cenarios and would
 * be visible on any future toast story. Wires it to the same theme source of
 * truth as the rest of the site instead.
 */
export function ThemeToaster() {
  const { theme } = useTheme()
  return <Toaster theme={theme} position="bottom-right" />
}
