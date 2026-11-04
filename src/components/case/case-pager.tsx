import Link from "next/link"
import { caseHref, orderedWorkStories } from "@/lib/work"

const LINK =
  "inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-[13px] text-foreground/75 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"

/**
 * Strip above a case on its own page: back to the Home, and the previous and
 * next case, so a reader can move through the work without going back first.
 * The cases wrap around, in the order of the Home.
 */
export function CasePager({ slug }: { slug: string }) {
  const cases = orderedWorkStories()
  const index = cases.findIndex((meta) => meta.slug === slug)
  if (index === -1) return null
  const previous = cases[(index - 1 + cases.length) % cases.length]
  const next = cases[(index + 1) % cases.length]

  return (
    <nav
      aria-label="Case navigation"
      className="mx-auto flex w-full max-w-[1152px] flex-wrap items-center justify-between gap-x-4 px-3 pt-3 md:px-6 print:hidden"
    >
      <Link href="/" className={LINK}>
        <span aria-hidden="true">←</span> Home
      </Link>
      <div className="flex items-center gap-1">
        <Link href={caseHref(previous.slug)} className={LINK}>
          <span aria-hidden="true">←</span>
          <span className="sr-only sm:not-sr-only">Previous: {previous.title}</span>
          <span className="sm:sr-only">Previous</span>
        </Link>
        <Link href={caseHref(next.slug)} className={LINK}>
          <span className="sr-only sm:not-sr-only">Next: {next.title}</span>
          <span className="sm:sr-only">Next</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </nav>
  )
}
