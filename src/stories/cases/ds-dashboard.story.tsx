"use client"

import dynamic from "next/dynamic"

import type { StoryDef } from "@/lib/registry/types"
import { CaseFrame, type CaseFact, type CaseSection } from "@/components/case/case-frame"
import { Callout, H, Measures, Points, Steps, T } from "@/components/case/case-copy"
import { PrototypeSkeleton } from "@/components/prototype/prototype-frame"
import { HEALTH_NEXT_READING_DATE, HEALTH_READING_DATE } from "@/prototypes/ds-dashboard/data"

const DsDashboardPrototype = dynamic(
  () => import("@/prototypes/ds-dashboard/prototype").then((m) => m.DsDashboardPrototype),
  { loading: () => <PrototypeSkeleton /> }
)

const FACTS: readonly CaseFact[] = [
  { label: "Role", value: "Design Engineer. I built the dashboard and the two pipelines" },
  { label: "Timeline", value: "About one month for the dashboard, on top of an ongoing design system" },
  { label: "Team", value: "Front-end developers and business analysts, the intended readers and users" },
  { label: "Stack", value: "React, TypeScript, Next.js, Tailwind, Storybook, Vitest, axe, GitHub Actions" },
  { label: "Evidence", value: "A 14-module audit, a fidelity check on generated prototypes, a working run with more than one analyst, a dated health reading of the catalog. No adoption data yet" },
  { label: "Status", value: "Dashboard working and tested, still in development. Team adoption is starting" },
]

const SECTIONS: readonly CaseSection[] = [
  {
    id: "context",
    label: "Context",
    content: (
      <>
        <H>A design system nobody could read at a glance</H>
        <T>
          Start with one question. A business analyst planning a screen asks: is the date filter ready to use, or still a
          draft? The honest answer was to ask a developer, or to open the component&apos;s story and guess. The same
          question came up for every component, every rule and every open decision.
        </T>
        <T>
          I work as a Design Engineer on an enterprise platform with a growing component library. It had a catalog of
          components, patterns and screens, business rules tied to some of them, and a list of open design decisions.
          Each lived in a different place: stories in Storybook, rules in spec files, decisions in a document.
        </T>
        <T>
          Nobody could answer, in one place, what was ready, what was still a draft, which rules had passing tests and
          what was waiting on a decision. Business analysts had also started prototyping in HTML with AI tools, with no guarantee
          that the result used the real components.
        </T>
        <Callout title="This is a preview, not the full dashboard.">
          The complete dashboard is an internal tool. What you can try below is a small excerpt of it, with no sensitive
          data. The names and statuses are real, only a small part of the catalog is included, and file
          paths and the rest of the data are left out. It is read-only, and nothing in it talks to a server.
        </Callout>
      </>
    ),
  },
  {
    id: "role",
    label: "My role",
    content: (
      <>
        <H>What I owned</H>
        <T>
          I was the only person building this. I decided what to measure, wrote the collectors that read the code and
          the specs, built the dashboard and wrote the documentation that the tools and the people share. The front-end
          team and the business analysts are the readers and users.
        </T>
      </>
    ),
  },
  {
    id: "discovery",
    label: "Discovery",
    content: (
      <>
        <H>Where status goes missing</H>
        <T>
          Before building anything I audited the system the other way round: I ran an accessibility, interaction and
          visual-regression pipeline over the real screens and compared them with the design system.
        </T>
        <Measures
          items={[
            { value: "14", label: "Modules of the real product audited, one at a time" },
            { value: "31", label: "Inconsistencies found. I checked 28 against the real code and all 28 were confirmed, each with a root cause" },
            { value: "2", label: "Bugs found this way before they became tickets" },
          ]}
        />
        <Points
          items={[
            {
              title: "Not knowing what is ready",
              body: "A component could be finished, half documented or abandoned, and the only way to tell was to open its story.",
            },
            {
              title: "Rules with no visible coverage",
              body: "A business rule could exist without a test or a structured spec, and nothing showed the gap until someone went looking.",
            },
            {
              title: "Decisions with no owner or blocker",
              body: "Open questions sat in a document, with no trace of what each one was waiting for.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "decisions",
    label: "Decisions",
    content: (
      <>
        <H>Choices I made, and what I gave up</H>
        <Points
          items={[
            {
              title: "A health score from evidence, not from opinion",
              body: "Each front of the system (foundations, atoms, patterns, business rules, distribution) is scored from collected evidence, and the pieces are linked only by JSON files. That keeps the dashboard dumb: it shows what the collectors found and cannot invent a status.",
            },
            {
              title: "A dashboard route, not a separate tool",
              body: "The dashboard is a route inside the same Next app and embeds Storybook without depending on the visual-testing service's login, which would have put the catalog behind another account.",
            },
            {
              title: "Find, prove and equip, not fix",
              body: "I scoped my role to finding problems, proving them with evidence and equipping the people who fix them. The fixes in the product code stay with the front-end team, so the catalog and the tools are where my effort goes.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "solution",
    label: "Solution",
    content: (
      <>
        <H>One place that answers the question, and two pipelines that use it</H>
        <T>
          The dashboard opens on the counts that matter (ready and draft components, rules implemented, decisions
          pending) and a short list of what needs attention. From there, each section lists its items with a detail panel
          and a live preview, and every open decision shows what it is blocked on.
        </T>
        <Steps
          steps={[
            { label: "Home" },
            { label: "Section", highlight: true },
            { label: "List" },
            { label: "Item detail", highlight: true },
          ]}
        />
        <H>For business analysts: prototypes made from the real components</H>
        <T>
          Two skills turn a Notion spec into an HTML prototype built only from the design system. The first reads the
          spec into a structured flow file. The second builds the prototype and runs a validator that checks component
          names and tokens before handing it back.
        </T>
        <Measures
          items={[
            { value: "~94%", label: "Of its elements sat inside a design system component" },
            { value: "87.7%", label: "Of its CSS classes existed in the real component code" },
          ]}
        />
        <T>
          I measured this once, by hand, on one flow (three states, 374 elements, 37 components). It is a spot check,
          not a benchmark, and the validator does not check props or internal structure.
        </T>
        <H>For front-end developers: check the catalog before building</H>
        <T>
          A developer pastes a task and the AI looks up the catalog through the Storybook MCP before writing anything:
          what already exists and which props it really has. It then builds from the design tokens and conventions,
          writes the story, and runs accessibility and interaction tests. Moving the finished component into the
          production repo is still done by hand.
        </T>
      </>
    ),
  },
  {
    id: "result",
    label: "Result",
    content: (
      <>
        <H>What exists, and what I can&apos;t claim yet</H>
        <T>
          In August 2026 I audited the design system for accessibility and fed the result back into the library. These
          numbers come from my own weekly reports, not from a measured outcome.
        </T>
        <Measures
          items={[
            { value: "28", label: "Components audited for accessibility" },
            { value: "6", label: "Fixes applied, including the empty state, the date filter and tab and keyboard navigation" },
            { value: "6", label: "Components added: Card, Combobox, Input Group, Textarea, Toggle and Tooltip" },
            { value: "9", label: "Gaps in the system recorded and prioritized" },
          ]}
        />
        <T>
          I then used the updated components in two real product modules. Building them showed which of the recorded
          gaps mattered in practice.
        </T>
        <T>
          What exists now: a dashboard with six sections, navigable by mouse and keyboard, and two pipelines, one for
          analysts and one for developers, both built on the same catalog.
        </T>
        <T>
          The people who saw the dashboard said it will help a lot with governance and organization, and called it
          excellent and useful. That is feedback, not a measure.
        </T>
        <H>Before: where the catalog stands on {HEALTH_READING_DATE}</H>
        <T>
          This is a starting point, not a result. I took the health score the catalog computes for itself, and I plan to
          read it again on {HEALTH_NEXT_READING_DATE} and add the second reading next to this one.
        </T>
        <Measures
          items={[
            { value: "36.4", label: "Health of Business Rules, the lowest of six fronts (scale 0 to 100)" },
            { value: "21", label: "Major blockers open on Business Rules" },
            { value: "84.8", label: "Health of Distribution, the highest of six fronts" },
            { value: "0 of 139", label: "Items rated mature or production-ready. Most are still in progress" },
          ]}
        />
        <Points
          items={[
            {
              title: "What the score measures",
              body: "For each front of the system, it reads tests, documentation, business rule coverage and how the components are distributed. It reads the catalog, not the people using it.",
            },
            {
              title: "What it does not measure",
              body: "Adoption, time saved, fewer questions or fewer inconsistencies in the product. A higher score later would show that the catalog improved, not that anyone used the dashboard.",
            },
            {
              title: "How the second reading will be compared",
              body: "Same source, the catalog's automatic daily series. If the catalog or the scoring rules change in between, I will say so before comparing anything.",
            },
          ]}
        />
        <Callout title="What this doesn&apos;t show.">
          The dashboard works and has been tested, and the team is starting to adopt it, but it is too early for numbers
          on time saved, fewer questions or fewer inconsistencies. The prototype pipeline has run with more than one business
          analyst and worked, but I did not record how long it saved them, and there is no user research behind any of
          it.
        </Callout>
      </>
    ),
  },
  {
    id: "reflection",
    label: "Reflection",
    content: (
      <>
        <H>What I would change</H>
        <T>
          I built the dashboard before a team had committed to using it, so how far adoption goes is the open question today. If I
          started again I would ask one team for one decision first, then build the dashboard around that decision.
        </T>
        <T>
          What I was missing was a before and after. The before is now on this page, dated {HEALTH_READING_DATE}. The
          after is a second reading on {HEALTH_NEXT_READING_DATE}. Until then, the dashboard describes the system but
          cannot show that it changed.
        </T>
      </>
    ),
  },
]

export const story: StoryDef<Record<string, never>> = {
  meta: {
    slug: "cases/ds-dashboard",
    title: "Design system governance",
    group: "Selected work",
    kind: "flow",
    summary: "A design system health dashboard, plus the pipelines that let analysts and developers build from the real catalog.",
    order: 3,
    hideInspector: true,
  },
  layout: "fullscreen",
  render: () => (
    <CaseFrame
      context="Excerpt of an internal tool — no sensitive data shown"
      hint="Try it: open a section, then an item in its list"
      prototype={<DsDashboardPrototype />}
      sourcePath="src/prototypes/ds-dashboard"
      prototypePosition="top"
      tagline="Design Engineering · Design system governance"
      title="A design system you can read at a glance"
      description="A health and governance dashboard for a design system, and two pipelines that let business analysts prototype and developers build from the same real catalog."
      tags={[
        { label: "Internal tool", accent: true },
        { label: "Design Systems" },
        { label: "Governance" },
        { label: "React · TypeScript" },
      ]}
      facts={FACTS}
      outcome="I built a health dashboard and two pipelines so analysts and developers work from the same real catalog. It is tested and the team is starting to adopt it; I have no adoption numbers yet."
      sections={SECTIONS}
      footer={
        <p className="mt-12 border-t border-border pt-6 text-[12px] leading-[1.6] text-foreground/70">
          This is an excerpt of an internal tool. Only a small part of its catalog is included, and the data here does
          not depict the full system.
        </p>
      }
    />
  ),
}
