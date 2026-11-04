"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { caseHref, orderedWorkStories } from "@/lib/work"

/**
 * Bottom of a case page: the next case, and a way back to the list. The case
 * is the page itself at /work/[slug]; it can also still render inside the
 * shell's iframe (/preview/...), where links use target="_top" to change the
 * whole window instead of loading the site inside the frame.
 */
export function CaseNav() {
  const pathname = usePathname()
  const last = pathname.split("/").filter(Boolean).pop() ?? ""
  const cases = orderedWorkStories()
  const index = cases.findIndex((meta) => meta.slug.split("/").pop() === last)
  if (index === -1) return null
  const previous = cases[(index - 1 + cases.length) % cases.length]
  const next = cases[(index + 1) % cases.length]

  return (
    <nav
      aria-label="More cases"
      className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-border px-4 py-5 md:px-12"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
        <Link
          href={caseHref(previous.slug)}
          target="_top"
          prefetch={false}
          className="inline-flex min-h-11 flex-col justify-center focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">Previous case</span>
          <span className="text-[15px] font-semibold text-[var(--accent-dim)] hover:underline">← {previous.title}</span>
        </Link>
        <Link
          href="/#work"
          target="_top"
          prefetch={false}
          className="inline-flex min-h-11 items-center text-[14px] text-foreground/75 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          All selected work
        </Link>
      </div>
      <Link
        href={caseHref(next.slug)}
        target="_top"
        prefetch={false}
        className="inline-flex min-h-11 flex-col justify-center text-right focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">Next case</span>
        <span className="text-[15px] font-semibold text-[var(--accent-dim)] hover:underline">{next.title} →</span>
      </Link>
    </nav>
  )
}
