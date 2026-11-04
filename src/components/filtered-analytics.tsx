"use client"

import { Analytics } from "@vercel/analytics/next"

/**
 * The /preview route shares the root layout (on purpose — see
 * src/app/(preview)/layout.tsx) so the iframe inherits the site's font and
 * theme script for free. That means <Analytics /> would otherwise fire a
 * pageview for every story a visitor opens inside the shell's canvas,
 * polluting Vercel Analytics with per-component noise that isn't a real
 * page visit.
 */
export function FilteredAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => (event.url.includes("/preview/") ? null : event)}
    />
  )
}
