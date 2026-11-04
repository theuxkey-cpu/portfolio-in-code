"use client"

import type { ReactNode } from "react"

/**
 * Shared presentational pieces for the Profile doc stories. Not a
 * *.story.tsx itself (no StoryDef export), so STORY_LOADERS never touches
 * it. Deliberately reuses the exact visual language already established in
 * src/app/page.tsx (eyebrow-with-line, tag pills, the ExpItem timeline
 * grid) rather than inventing a second style for the same kind of content.
 */

export function DocProse({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex max-w-[640px] flex-col gap-9 text-sm leading-[1.7] text-foreground">{children}</div>
}

export function DocLead({ children }: { children: ReactNode }) {
  return <p className="text-[15px] leading-[1.75] text-foreground">{children}</p>
}

export function DocSection({
  title,
  children,
  level = 2,
}: {
  title: string
  children: ReactNode
  /** Heading level, for when the section is nested under another h2 (About). */
  level?: 2 | 3
}) {
  const Heading = level === 3 ? "h3" : "h2"
  return (
    <section className="flex flex-col gap-4">
      <Heading className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground before:block before:h-px before:w-5 before:shrink-0 before:bg-[var(--accent-dim)] before:content-['']">
        {title}
      </Heading>
      {children}
    </section>
  )
}

export function TagRow({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[var(--tag-border)] bg-[var(--tag-bg)] px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  )
}

export function TimelineItem({
  date,
  title,
  subtitle,
  children,
  tools,
  focus,
}: {
  date: string
  title: string
  subtitle?: string
  children?: ReactNode
  tools?: readonly string[]
  /** Labeled "Focus" row — distinct from `tools` (which renders unlabeled,
   * for a course's tool list) because a role's focus areas read as a
   * different kind of fact and need their own heading. */
  focus?: readonly string[]
}) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-6 border-b border-border py-6 last:border-b-0 last:pb-0 max-sm:grid-cols-1 max-sm:gap-1">
      <span className="pt-[3px] text-xs leading-[1.4] text-muted-foreground">{date}</span>
      <div>
        <p className="text-[15px] font-medium text-foreground">{title}</p>
        {subtitle && <p className="text-[13px] text-muted-foreground">{subtitle}</p>}
        {children && <p className="mt-1 text-[13px] leading-[1.5] text-muted-foreground">{children}</p>}
        {tools && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tools.map((tool) => (
              <span key={tool} className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {tool}
              </span>
            ))}
          </div>
        )}
        {focus && (
          <div className="mt-3">
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Focus</p>
            <div className="flex flex-wrap gap-1.5">
              {focus.map((item) => (
                <span key={item} className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[13px] font-medium text-[var(--accent-dim)] underline decoration-dotted underline-offset-4 hover:decoration-solid"
    >
      {children}
    </a>
  )
}
