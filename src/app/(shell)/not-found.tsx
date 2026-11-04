import Link from "next/link"
import { LANDING_SLUG } from "@/lib/registry/meta"

// Renders as the (shell) layout's `children` slot alongside the persistent
// chrome (sidebar, toolbar, Stage) — see ShellChrome's note on that slot
// normally being invisible. A `fixed inset-0` overlay is the simplest way to
// take over the whole screen here without teaching ShellChrome a second,
// content-bearing children mode.
export default function ShellNotFound() {
  return (
    <div className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[var(--shell-bg)] px-6 text-center">
      <p className="text-sm font-medium text-foreground">This page doesn&apos;t exist.</p>
      <Link
        href={`/system/${LANDING_SLUG}`}
        className="text-sm text-[var(--accent-dim)] underline decoration-dotted underline-offset-4 hover:decoration-solid"
      >
        Back to About
      </Link>
    </div>
  )
}
