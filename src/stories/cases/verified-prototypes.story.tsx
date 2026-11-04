"use client"

import dynamic from "next/dynamic"
import Link from "next/link"

import type { StoryDef } from "@/lib/registry/types"
import { CaseFrame, type CaseFact, type CaseSection } from "@/components/case/case-frame"
import { Callout, H, Measures, Points, Steps, Sub, T } from "@/components/case/case-copy"
import { PrototypeSkeleton } from "@/components/prototype/prototype-frame"

const VerifiedPrototypesPrototype = dynamic(
  () => import("@/prototypes/verified-prototypes/prototype").then((m) => m.VerifiedPrototypesPrototype),
  { loading: () => <PrototypeSkeleton /> }
)

const FACTS: readonly CaseFact[] = [
  {
    label: "Role",
    value: "I designed the verification rules, the report contract and the scope cuts, and built it with Claude Code under my direction",
  },
  { label: "Not mine", value: "The design system itself, which is a separate case" },
  { label: "Company", value: "A mid-size enterprise software company, unnamed" },
  { label: "Type", value: "Work recreated in code. Fictional design system and tool, invented data" },
  { label: "Status", value: "First version working, pilot not run yet. No adoption data" },
  { label: "Figures", value: "Illustrative figures. No pilot has run" },
]

const SECTIONS: readonly CaseSection[] = [
  {
    id: "context",
    label: "Context",
    content: (
      <>
        <H>A prototype that looks right and is not</H>
        <T>
          Business analysts at a mid-size enterprise software company had started to prototype screens with an AI
          tool, to show engineering what they meant before asking for it. The pages looked convincing. Many used colors,
          components and wording that the design system does not have, and engineering found out in review.
        </T>
        <T>
          Take Marina, an analyst two months into the job, who needs to show an order-approval screen. She can write
          the brief. She cannot tell whether the page the tool gives back is made of the real design system, and nor
          can the tool.
        </T>
        <Callout title="This is a recreation, not the real tool.">
          The design system (Tessera), the checker (Plumb), the briefings and every figure are invented. The prototype
          above plays back scripted drafts and corrections; no model and no real checker run behind it.
        </Callout>
      </>
    ),
  },
  {
    id: "role",
    label: "My role",
    content: (
      <>
        <H>What I owned, and what I did not</H>
        <T>
          I ran the decisions: what the tool should check, what it should block and what it should only warn about,
          what its report may claim, and what to leave out of the first version. I wrote the specification, split it
          into tickets and did the reading that the rules rest on.
        </T>
        <T>
          I built it with Claude Code under my direction, so I do not claim every line. I also did not run the pilot:
          no one but me has used it yet, and the case says so.
        </T>
      </>
    ),
  },
  {
    id: "discovery",
    label: "Discovery",
    content: (
      <>
        <H>What I found reading the field</H>
        <T>
          Before choosing rules I read how others check AI-generated interfaces against a design system. These are
          findings from that reading, not measurements of mine.
        </T>
        <Points
          items={[
            {
              title: "A simple validator only reaches the shallow layer",
              body: "It catches a name or a token that does not exist. It does not see whether a component is used the way it should be, or anything a script builds after the page loads.",
            },
            {
              title: "A class with no CSS raises no error",
              body: "The build stays green and the element simply has no style. The only reliable check is against the compiled CSS, not the source.",
            },
            {
              title: "An agent can optimize for the validator",
              body: "If it can read or change the check, it may learn to pass it instead of fixing the page.",
            },
            {
              title: "A separate verifier helps, but is not enough",
              body: "Splitting the check from the agent closes some holes. It does not close the validator's own blind spots, which is why the report has to name them.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "strategy",
    label: "Strategy",
    content: (
      <>
        <H>The thesis, and three decisions that follow from it</H>
        <T>
          I started from the idea that automatic checking beats human review. The reading and my own first runs
          argued against it. The check is cheap and fast, but it cannot see most of what makes a page right. So the
          thesis became: the checker does not replace the reviewer, it says what it checked and what it did not, and
          leaves the reviewer only what it cannot cover.
        </T>
        <Points
          items={[
            {
              title: "The report says what it checked and what it did not, never just “validated”",
              body: "Each finding is verified, not verified or blocked. The report is written by the script from what the checks found, not by the model. I dropped a 0 to 100 score: a number reads as proof, and a list tells a person where to look.",
            },
            {
              title: "Block on some things, warn on others",
              body: "A missing token, class or component and text that is not in the brief block delivery. Sample data and missing states only warn, because they need judgment. Blocking on everything would teach people to ignore the check.",
            },
            {
              title: "A component the system does not have is allowed, with a visible mark",
              body: "Refusing it would stop the analyst. Allowing it unmarked would let engineering assume it exists. A “Proposal” mark says: this one still has to be built.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "process",
    label: "Process",
    content: (
      <>
        <H>From briefing to a report that admits its limits</H>
        <Steps
          steps={[
            { label: "Briefing" },
            { label: "Summary and component list, approved" },
            { label: "Page drafted" },
            { label: "Level 1 check", highlight: true },
            { label: "Fix and re-check" },
            { label: "Report with “Not verified”", highlight: true },
          ]}
        />
        <T>
          The person approves a summary and the list of components before any page exists, so a component that is not
          in the system is caught before it is drawn. Level 1 is static: it reads the page and the brief. Level 2 is
          optional and runs on the rendered page for accessibility problems. Both are in the design; only part of
          level 1 is built.
        </T>
        <Callout title="What exists today.">
          The prototype above shows the full idea. The working first version has one rule, classes missing from the
          compiled CSS, and a block that stops the conversation from finishing while the page fails it. The other
          rules, the catalog and the pilot are still to do.
        </Callout>
        <T>
          Try the workbench: generate a page, watch it blocked and corrected, then plant a styled div. It passes, and
          the report says it could not tell. That is the behavior I care about most.
        </T>
      </>
    ),
  },
  {
    id: "result",
    label: "Result",
    content: (
      <>
        <H>What the illustrative figures say, with the arithmetic</H>
        <Measures
          items={[
            { value: "−61%", label: "Review rounds with engineering, 3.1 to 1.2" },
            { value: "96%", label: "Conformity on the rules the checker covers, 54% before" },
            { value: "84%", label: "Conformity counting everything, 54% before" },
            { value: "8 of 9", label: "Analysts who finish alone, 2 of 9 before" },
          ]}
        />
        <T>
          All of these are illustrative figures for the recreated tool, not a measured result: no pilot has run. The two conformity numbers
          are the point: of the 16 points still wrong out of 100, 13 are in the layer no check reaches. The checker
          fixes what it can see and a person still has to review the rest.
        </T>
        <T>
          The time falls from 2.5 days to 35 minutes only because one is calendar time (days in a designer&apos;s queue)
          and the other is active time. Read it as a direction, not a like-for-like comparison.
        </T>
        <Sub>What would count as a pass</Sub>
        <T>
          I set the bar before running the pilot, so the result cannot be bent to fit. With a few analysts and a set of
          planted defects: the report must list every planted defect as blocked or as not verified, never as fine; and
          most analysts must finish a page on their own. If a planted defect comes back clean, the checker is the problem
          and the figures above mean nothing.
        </T>
      </>
    ),
  },
  {
    id: "reflection",
    label: "Reflection",
    content: (
      <>
        <H>The failure that shaped the report</H>
        <T>
          Early on, the setup command told people they could go ahead while it had not managed to run a single check.
          A reassuring message about nothing verified. Around the same time, the template that ships with the tool used
          a class its own checker would have rejected. Both were the same mistake: sounding sure without having checked.
        </T>
        <T>
          That is why the report always carries a “Not verified” block, even when everything passes. A report that does
          not say what it left out is worse than no report.
        </T>
        <Points
          items={[
            {
              title: "Still open: the agent may learn to pass the checker",
              body: "Running the verifier in a separate process, with the agent unable to change its rules, is designed and not built.",
            },
            {
              title: "Still open: no one has used it yet",
              body: "A pilot with a few analysts and a set of planted defects, to confirm the checker misses none of them, is the next step.",
            },
          ]}
        />
        <p className="mt-8 text-[14px] leading-[1.65] text-foreground/75">
          Related: the{" "}
          <Link href="/work/ds-dashboard" className="underline underline-offset-2 hover:text-foreground">
            design system governance case
          </Link>{" "}
          shows the state of the catalog this checker reads from.
        </p>
      </>
    ),
  },
]

export const story: StoryDef<Record<string, never>> = {
  meta: {
    slug: "cases/verified-prototypes",
    title: "Verified prototypes",
    group: "Selected work",
    kind: "flow",
    summary: "AI-made prototypes checked against a design system by a report that says what it could not check — recreated with fictional data.",
    order: 2,
    hideInspector: true,
  },
  layout: "fullscreen",
  render: () => (
    <CaseFrame
      context="Work recreated in code — fictional design system, illustrative figures"
      hint="Try it: generate a page, watch it get blocked and corrected, then plant a styled div and read the report"
      prototype={<VerifiedPrototypesPrototype />}
      sourcePath="src/prototypes/verified-prototypes"
      prototypePosition="top"
      tagline="Design Engineering · AI prototyping"
      title="Prototypes that obey the design system, and say what they could not check"
      description="Analysts were prototyping with AI and getting pages that looked right but did not use the real design system. I designed a checker that blocks what it can prove wrong, and a report that always lists what it could not check."
      outcome="A checker that blocks what it can prove wrong, and a report that lists what it could not check. First version working, pilot not run yet, no adoption data."
      tags={[
        { label: "Illustrative figures", accent: true },
        { label: "AI prototyping" },
        { label: "Design system" },
        { label: "React · TypeScript" },
      ]}
      facts={FACTS}
      sections={SECTIONS}
      footer={
        <p className="mt-12 border-t border-border pt-6 text-[12px] leading-[1.6] text-foreground/70">
          The design system, the checker, the company, the people and every figure are fictional and do not depict any
          real product or system. The briefings, drafts and corrections are written by hand and played back; no model
          runs behind it.
        </p>
      }
    />
  ),
}
