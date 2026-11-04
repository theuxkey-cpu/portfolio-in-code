"use client"

import type { ReactNode } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/design-system/ui/tabs"
import { sourceUrl } from "@/lib/repo"
import { CaseNav } from "./case-nav"

/** The four fixed tabs of every case page, in this order. */
const TABS = [
  { value: "problem", label: "Problem" },
  { value: "pain", label: "Pain" },
  { value: "solution", label: "Solution" },
  { value: "result", label: "Result" },
] as const

type TabValue = (typeof TABS)[number]["value"]

/** One labelled fact in the strip under the title, e.g. { label: "Role", value: "Design Engineer" }. */
interface CaseFact {
  label: string
  value: ReactNode
}

/** One section of a stacked case page. `id` becomes the anchor. */
interface CaseSection {
  id: string
  label: string
  content: ReactNode
}

interface CaseFrameProps {
  /** Thin strip above the prototype, e.g. "Self-initiated concept — fictional data". */
  context: string
  /** Right side of the strip: a hint on how to use the prototype. */
  hint?: string
  /** The interactive prototype (already wrapped in its own frame). */
  prototype: ReactNode
  /** Small note under the prototype. Defaults to the "still in development"
   * line; pass `null` to hide it (earlier-work cases are finished). */
  prototypeNote?: ReactNode | null
  /** "top" (default): prototype above the text. "bottom": the case text first,
   * then the prototype below it — for cases that read as a story first. With
   * `sections`, "top" puts it right under the title block, before the section nav. */
  prototypePosition?: "top" | "bottom"
  /** Heading above the prototype. Only shown when the prototype is at the bottom. */
  prototypeTitle?: string
  tagline: string
  title: string
  description: string
  tags: readonly { label: string; accent?: boolean }[]
  /** One panel per fixed tab. Ignored when `sections` is given. */
  panels?: Record<TabValue, ReactNode>
  /** Stacked sections with an anchor nav, shown instead of the four tabs so a
   * reader can scan the whole case without clicking. */
  sections?: readonly CaseSection[]
  /** Role, timeline, team, stack and status, shown right under the title. */
  facts?: readonly CaseFact[]
  /** One sentence with the outcome, shown under the description. Say what was
   * measured and what was not. */
  outcome?: string
  footer?: ReactNode
  /** Folder of this case's prototype in the public repo, e.g. "src/prototypes/help-center".
   * Adds a "View source" link under the tags. */
  sourcePath?: string
}

/**
 * Layout of a case page: a ~1152 px card with the prototype on top, four fixed
 * tabs (Problem, Pain, Solution, Result), then tagline, title, description and
 * tags, then the selected tab's content. With `prototypePosition="bottom"` the
 * order is title, tabs and their content, then the prototype. It knows nothing about any specific
 * case or prototype — each case only hands in content.
 */
function CaseFrame({
  context,
  hint,
  prototype,
  prototypeNote = "This prototype is still in development.",
  prototypePosition = "top",
  prototypeTitle,
  tagline,
  title,
  description,
  tags,
  panels,
  sections,
  facts,
  outcome,
  footer,
  sourcePath,
}: CaseFrameProps) {
  const prototypeBlock = (
    <div
      id="prototype"
      className={`scroll-mt-[calc(var(--site-header-h,0px)+3.5rem)] flex flex-col items-center bg-muted/30 p-3 md:px-12 md:py-8 ${
        prototypePosition === "bottom" ? "border-t border-border" : ""
      }`}
    >
      {prototypePosition === "bottom" && prototypeTitle ? (
        <h2 className="mb-4 w-full max-w-[1056px] text-lg font-semibold tracking-[-0.01em]">{prototypeTitle}</h2>
      ) : null}
      {prototype}
      {prototypeNote ? (
        <p className="mt-2 w-full max-w-[1056px] text-right text-[11px] text-foreground/70">{prototypeNote}</p>
      ) : null}
    </div>
  )

  const header = (
    <header className="mb-12 max-w-[720px]">
      <p className="mb-4 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.08em] text-foreground/70 before:block before:h-px before:w-5 before:bg-foreground/50">
        {tagline}
      </p>
      <h1 className="mb-4 text-[clamp(28px,4.5vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em]">{title}</h1>
      <p className="mb-5 text-[17px] leading-[1.6] text-foreground/75">{description}</p>
      {outcome ? (
        <p className="mb-7 border-l-2 border-[var(--accent-dim)] pl-3 text-[15px] leading-[1.55] font-medium text-foreground">
          {outcome}
        </p>
      ) : null}
      {sections && prototypePosition === "bottom" ? (
        <a
          href="#prototype"
          className="mb-7 inline-flex h-11 items-center rounded-full border border-border px-5 text-[14px] font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Try the prototype ↓
        </a>
      ) : null}
      <ul className="flex flex-wrap gap-2.5">
        {tags.map((tag) => (
          <li
            key={tag.label}
            className={`rounded-full border px-3 py-[5px] text-[12px] font-medium tracking-[0.02em] ${
              tag.accent
                ? "border-[var(--badge-warm-border)] bg-[var(--badge-warm-bg)] text-[var(--accent-dim)]"
                : "border-[var(--tag-border)] bg-[var(--tag-bg)] text-foreground/75"
            }`}
          >
            {tag.label}
          </li>
        ))}
      </ul>
      {sourcePath ? (
        <p className="mt-5">
          <a
            href={sourceUrl(sourcePath)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[14px] font-medium text-[var(--accent-dim)] underline decoration-dotted underline-offset-4 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            View source<span className="sr-only"> (opens GitHub in a new tab)</span> ↗
          </a>
        </p>
      ) : null}
      {facts?.length ? (
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 md:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">{fact.label}</dt>
              <dd className="mt-1 text-[14px] leading-[1.5] text-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  )

  const tabStrip = (
    <div className="overflow-x-auto border-y border-border px-4 md:px-12">
      <TabsList variant="line" aria-label="Case sections" className="w-auto justify-start gap-1 p-0 md:gap-2 group-data-[orientation=horizontal]/tabs:h-11">
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="h-full flex-none px-3 text-[14px] group-data-[orientation=horizontal]/tabs:after:bottom-0"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </div>
  )

  const panelList = TABS.map((tab) => (
    <TabsContent key={tab.value} value={tab.value} className="max-w-[720px] text-[15px]">
      {panels?.[tab.value]}
    </TabsContent>
  ))

  const sectionNav = sections ? (
    <nav
      aria-label="Case sections"
      className="sticky top-[var(--site-header-h,0px)] z-10 overflow-x-auto border-y border-border bg-card px-4 md:px-12"
    >
      <ul className="flex h-11 items-center gap-1 md:gap-2">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="inline-flex h-11 items-center px-3 text-[14px] text-foreground/75 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  ) : null

  const sectionList = sections ? (
    <div className="max-w-[720px] space-y-14 text-[15px]">
      {sections.map((section) => (
        <section key={section.id} id={section.id} aria-label={section.label} className="scroll-mt-[calc(var(--site-header-h,0px)+4rem)]">
          {section.content}
        </section>
      ))}
    </div>
  ) : null

  const contextStrip = (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border px-4 py-2 text-[11px] text-foreground/70 md:px-6">
      <span className="font-medium text-foreground">{context}</span>
      {hint ? <span>{hint}</span> : null}
    </div>
  )

  if (sections) {
    return (
      <main id="main" className="mx-auto w-full max-w-[1152px] px-3 py-6 md:px-6 md:py-10">
        <article className="overflow-clip rounded-2xl border border-border bg-card">
          {contextStrip}
          <div className="px-4 pt-10 md:px-12 md:pt-14">{header}</div>
          {prototypePosition === "top" ? prototypeBlock : null}
          {sectionNav}
          <div className="px-4 py-10 md:px-12 md:py-12">{sectionList}</div>
          {prototypePosition === "bottom" ? prototypeBlock : null}
          {footer ? <div className="max-w-[720px] px-4 pb-10 md:px-12 md:pb-14">{footer}</div> : null}
          <CaseNav />
        </article>
      </main>
    )
  }

  if (prototypePosition === "bottom") {
    return (
      <main id="main" className="mx-auto w-full max-w-[1152px] px-3 py-6 md:px-6 md:py-10">
        <article className="overflow-hidden rounded-2xl border border-border bg-card">
          {contextStrip}
          <div className="px-4 pt-10 md:px-12 md:pt-14">{header}</div>
          <Tabs defaultValue="problem" className="gap-0">
            {tabStrip}
            <div className="px-4 py-10 md:px-12 md:py-12">{panelList}</div>
          </Tabs>
          {prototypeBlock}
          {footer ? <div className="max-w-[720px] px-4 pb-10 md:px-12 md:pb-14">{footer}</div> : null}
          <CaseNav />
        </article>
      </main>
    )
  }

  return (
    <main id="main" className="mx-auto w-full max-w-[1152px] px-3 py-6 md:px-6 md:py-10">
      <article className="overflow-hidden rounded-2xl border border-border bg-card">
        {contextStrip}
        {prototypeBlock}
        <Tabs defaultValue="problem" className="gap-0">
          {tabStrip}
          <div className="px-4 py-10 md:px-12 md:py-14">
            {header}
            {panelList}
            {footer ? <div className="max-w-[720px]">{footer}</div> : null}
          </div>
        </Tabs>
        <CaseNav />
      </article>
    </main>
  )
}

export { CaseFrame }
export type { CaseFact, CaseFrameProps, CaseSection }
