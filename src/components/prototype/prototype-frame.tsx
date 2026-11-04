"use client"

import { useId, type ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PrototypeFrameProps {
  /** Short product context, shown at the left of the header (e.g. "‹Case name› · ‹what this screen is›"). */
  title: string
  /** Accessible name of the whole region. */
  label: string
  /** Text at the right of the header. Every prototype is labelled as fictional. */
  notice?: string
  /** Strip pinned at the bottom (controls, readouts). */
  controls?: ReactNode
  /** Polite announcements for assistive tech, e.g. "3 orders selected". */
  announcement?: string
  className?: string
  children: ReactNode
}

/**
 * Shared shell for every interactive case prototype. It owns the parts that
 * must be identical across cases — a skip link, a labelled region, the fixed
 * 1056 x 507 stage, a fictional-data notice and a live region — and nothing
 * about the prototype's own content, so a prototype can later be mounted in
 * any case page unchanged.
 */
function PrototypeFrame({
  title,
  label,
  notice = "Concept — fictional data",
  controls,
  announcement,
  className,
  children,
}: PrototypeFrameProps) {
  const skipId = useId()

  return (
    <>
      <a
        href={`#${skipId}`}
        className="sr-only rounded bg-foreground px-3 py-1.5 text-xs text-background focus:not-sr-only focus:absolute focus:z-10"
      >
        Skip the prototype
      </a>
      <section
        aria-label={label}
        data-slot="prototype-frame"
        className={cn(
          "@container relative flex h-[507px] w-full max-w-[1056px] flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
          className
        )}
      >
        <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-2 text-[11px] text-foreground/70">
          <span className="min-w-0 truncate">{title}</span>
          <span className="shrink-0">{notice}</span>
        </header>
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        {controls ? <div className="border-t border-border bg-muted/40">{controls}</div> : null}
        <p role="status" className="sr-only">
          {announcement}
        </p>
      </section>
      <div id={skipId} />
    </>
  )
}

/** Same footprint as the loaded frame, so nothing shifts when it arrives. */
function PrototypeSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="h-[507px] w-full max-w-[1056px] animate-pulse rounded-xl border border-border bg-muted/40 motion-reduce:animate-none"
    />
  )
}

export { PrototypeFrame, PrototypeSkeleton }
