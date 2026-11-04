"use client"

import dynamic from "next/dynamic"

import type { StoryDef } from "@/lib/registry/types"
import { CaseFrame, type CaseFact, type CaseSection } from "@/components/case/case-frame"
import { Callout, H, Measures, Points, Steps, Sub, T } from "@/components/case/case-copy"
import { PrototypeSkeleton } from "@/components/prototype/prototype-frame"

const HelpCenterPrototype = dynamic(
  () => import("@/prototypes/help-center/prototype").then((m) => m.HelpCenterPrototype),
  { loading: () => <PrototypeSkeleton /> }
)

const FACTS: readonly CaseFact[] = [
  { label: "Role", value: "Product designer. I mapped the flows and wrote the knowledge base the assistant answers from" },
  { label: "Not mine", value: "I did not build the assistant. I owned what it answers from" },
  { label: "Company", value: "A regional parts distributor, unnamed" },
  { label: "Type", value: "Real work, with the prototype rebuilt in code. Names changed, sample data, scripted replies" },
  { label: "Figures", value: "About 20% fewer tickets overall, estimated from a model. No user test yet" },
]

const SECTIONS: readonly CaseSection[] = [
  {
    id: "context",
    label: "Context",
    content: (
      <>
        <H>A ticket is a symptom of a flow nobody explained</H>
        <T>
          Rota is a sales ERP for field sellers at a regional parts distributor. Dani, a seller three weeks into the job,
          is building her first multi-line quote. She hits a discount that asks for approval, and she does not know why.
          She can open a manual in another tab, ask a colleague, or file a ticket. Most people file the ticket.
        </T>
        <T>
          That is the problem the case starts from. The support queue was full of &ldquo;how do I&rdquo; questions, and
          each one was a flow that could not explain itself on the screen where the question began.
        </T>
        <Callout title="What this page is.">
          A rebuild, not a screenshot. The work is real, and the prototype above is rebuilt in code with changed names
          and sample data. I removed everything that belongs to the organization. What I kept is the way of working
          and the decisions.
        </Callout>
      </>
    ),
  },
  {
    id: "role",
    label: "My role",
    content: (
      <>
        <H>What I did, and what I did not</H>
        <T>
          I mapped every flow against the real screen, found where the documentation and the product disagreed, and wrote
          the knowledge base the assistant answers from.
        </T>
        <Points
          items={[
            {
              title: "I mapped the flows",
              body: "About fifty flows in five modules, each checked on the screen against its documentation, using seven different user profiles.",
            },
            {
              title: "I found where docs and product disagreed",
              body: "Around fifteen mismatches per module. Some became interface fixes, some became questions for the business, and some became defects for the product team.",
            },
            {
              title: "I set the method and wrote the content",
              body: "One source feeding three outputs: a manual, a tour and the text the assistant reads. I wrote a dozen guides and rewrote the assistant's files for a seller, in plain words.",
            },
            {
              title: "I audited the help against the tickets",
              body: "A review of past tickets to see which questions the help should answer first.",
            },
          ]}
        />
        <Callout title="What I did not do.">
          I did not build the assistant. I owned the knowledge it answers from. I specified the in-screen tours but did
          not implement them in the real product. The tour and the assistant in the prototype above are my own
          rebuild of the idea.
        </Callout>
      </>
    ),
  },
  {
    id: "discovery",
    label: "Discovery",
    content: (
      <>
        <H>A few flows carry most of the questions</H>
        <T>
          Mapping the flows against the screen showed two things. First, the documentation had drifted: what it said and
          what the product did were different in roughly fifteen places per module. A help system built on that would
          have repeated the errors with more confidence.
        </T>
        <T>
          Second, the questions were not spread evenly. Reading the tickets by flow, a handful of flows gathered most of
          them, and most of those were &ldquo;how do I&rdquo; rather than &ldquo;this is broken&rdquo;.
        </T>
        <Measures
          items={[
            { value: "3 of ~50", label: "flows hold 48% of the tickets" },
            { value: "60%", label: "of those tickets are “how do I” questions" },
          ]}
        />
        <T>
          To find that, I read through several thousand past tickets and grouped them by the flow they came from. The
          coverage map in the prototype shows the same spread, one cell per flow.
        </T>
        <Callout title="Sample values.">
          The shares in the prototype are sample values, not the real ones, which I leave out. They follow the shape of
          the real work: a few flows, mostly how-to questions.
        </Callout>
      </>
    ),
  },
  {
    id: "strategy",
    label: "Strategy",
    content: (
      <>
        <H>Three decisions, each with a cost</H>
        <Points
          items={[
            {
              title: "Cover the three flows that cause the tickets, not all fifty",
              body: "Covering everything is slow, and most of it would sit unused. Covering the few flows that carry the volume gives the largest drop for the least content to keep true. The rest wait.",
            },
            {
              title: "Teach the assistant to say “I don't know”",
              body: "An assistant that always answers will sometimes invent a rule. The knowledge base I wrote marks critical data as “check on the screen” and gives the assistant room to decline, name its source and hand the question to a person. A wrong answer about a price costs more than a refusal.",
            },
            {
              title: "Put the help inside the screen",
              body: "A manual in another tab asks the seller to leave the task and come back. Help placed where the question starts, as a hint, a tour or a question to the assistant, keeps the seller in the flow.",
            },
          ]}
        />
        <T>
          One thing stays open: who keeps the content true when a screen changes. I come back to it in the reflection.
        </T>
      </>
    ),
  },
  {
    id: "process",
    label: "Process",
    content: (
      <>
        <H>One source, three outputs</H>
        <Steps
          steps={[
            { label: "Map the flow on the real screen" },
            { label: "Write one source", highlight: true },
            { label: "Manual" },
            { label: "Tour" },
            { label: "Text for the assistant" },
          ]}
        />
        <T>
          Each flow is written once, after it is checked on the screen, and the three outputs are cut from that one
          source. When the screen changes, one text changes and the three follow.
        </T>
        <Sub>The prototype, piece by piece</Sub>
        <Points
          items={[
            {
              title: "The funnel",
              body: "Move how much of the volume the help covers and how well the assistant resolves it, and watch the tickets change. The arithmetic stays on screen so the headline is never a number to take on trust.",
            },
            {
              title: "Rumo, the assistant",
              body: "It answers from a guide and names it, so the seller can check. When no guide covers the question, it says it cannot answer and does not guess. Either way there is a way to hand the question to a person, with the context attached.",
            },
            {
              title: "The quote screen, without and with help",
              body: "The same screen twice. Without help, a discount over the limit says only “Approval required”. With help, it says why and what to do, and a four-step tour walks through the first quote.",
            },
            {
              title: "The coverage map",
              body: "Every flow as one cell, shaded by its share of tickets, with the three covered ones marked. It shows why a few flows came first.",
            },
          ]}
        />
        <Callout title="Scripted, not a model.">
          Rumo&apos;s replies are written by hand and played back. No model runs behind it, and there is no free-text box,
          because a fake box that answers a handful of sentences would suggest a capability it does not have.
        </Callout>
      </>
    ),
  },
  {
    id: "result",
    label: "Result",
    content: (
      <>
        <H>The funnel, with the arithmetic</H>
        <T>The headline is a product of three numbers, shown rather than asserted.</T>
        <Measures
          items={[
            { value: "0.60 × 0.70 = 42%", label: "fewer tickets inside the covered flows" },
            { value: "0.48 × 0.42 ≈ 20%", label: "fewer tickets overall" },
          ]}
        />
        <Sub>How much rests on one assumption</Sub>
        <T>
          Almost all of the headline rests on one number: how many of the &ldquo;how do I&rdquo; questions the assistant
          resolves. The coverage and the share of how-to tickets come from reading the tickets. The resolution rate is the
          part nobody has measured, so the slider in the prototype lets you move it.
        </T>
        <Measures
          items={[
            { value: "50% resolved", label: "0.48 × 0.60 × 0.50 ≈ 14% fewer tickets overall" },
            { value: "70% resolved", label: "0.48 × 0.60 × 0.70 ≈ 20% fewer tickets overall" },
            { value: "90% resolved", label: "0.48 × 0.60 × 0.90 ≈ 26% fewer tickets overall" },
          ]}
        />
        <Sub>What I would call a pass</Sub>
        <T>
          Before trusting any of this I would set the bar first: with five or more new sellers on a real first quote, at
          least four finish it without asking a person, and the assistant declines, instead of guessing, on every question
          the guides do not cover. If fewer finish, the content is the problem, not the idea.
        </T>
        <Callout title="No user test yet.">
          The sliders in the prototype are a model with sample values, not a measurement. I have not run a test with
          sellers. The only trial I ran was one real question, described in
          the reflection.
        </Callout>
      </>
    ),
  },
  {
    id: "reflection",
    label: "Reflection",
    content: (
      <>
        <H>What went wrong, and what is still open</H>
        <T>The first version of the help was worse than I thought it was.</T>
        <Points
          items={[
            {
              title: "Internal words leaked into the guides",
              body: "The first guides and assistant files carried phrases from my own testing, such as “in the test” and “I did not see the option”, and quoted test prices as if they were rules.",
            },
            {
              title: "No “I don't know” where it mattered",
              body: "The assistant's files had no “check on the screen” on critical data, so nothing told it to stop short of a guess.",
            },
            {
              title: "A sentence from the spec contradicted the screen",
              body: "A line taken from the specification said a reservation is released, and the screen showed otherwise. It had to go.",
            },
            {
              title: "My first test was too small to prove anything",
              body: "I tried the assistant on a single real question and it came back “Partial”. One question cannot show whether a knowledge base holds.",
            },
          ]}
        />
        <T>
          That is why decision two exists, and why I rewrote the guides and the assistant&apos;s files for a seller, without
          jargon.
        </T>
        <Sub>What I would do next</Sub>
        <T>
          Everything I have is weak evidence: it points somewhere, it does not prove it. The next step is to test with five
          or more sellers, with real tasks, before trusting any of the figures above. The open question I would raise with
          the team is the one from the strategy: when a screen changes, who updates the source?
        </T>
      </>
    ),
  },
]

export const story: StoryDef<Record<string, never>> = {
  meta: {
    slug: "cases/help-center",
    title: "Help center",
    group: "Selected work",
    kind: "flow",
    summary: "Help placed inside the screen where the question starts, with an assistant that says when it does not know — with the prototype rebuilt in code.",
    order: 1,
    hideInspector: true,
  },
  layout: "fullscreen",
  render: () => (
    <CaseFrame
      context="Real work — prototype rebuilt in code, with sample data"
      hint="Try it: move a slider, ask Rumo something it can't answer, then compare the quote screen with and without help"
      prototype={<HelpCenterPrototype />}
      sourcePath="src/prototypes/help-center"
      prototypePosition="top"
      tagline="Product Design · Support and AI"
      title="Fewer how-to tickets by putting help where the question starts"
      description="Most support tickets came from a few flows that were hard to follow. I mapped every flow against the real screen, found where the documentation and the product disagreed, and wrote the knowledge base an assistant answers from, so the help sits inside the screen."
      outcome="About 20% fewer tickets overall, estimated from a model (inputs listed in the case). I did not build the assistant; I owned the knowledge it answers from. No user test yet."
      tags={[
        { label: "Support and AI", accent: true },
        { label: "Knowledge base" },
        { label: "React · TypeScript" },
      ]}
      facts={FACTS}
      sections={SECTIONS}
      footer={
        <p className="mt-12 border-t border-border pt-6 text-[12px] leading-[1.6] text-foreground/70">
          The prototype uses changed names and sample data, and does not show any real screen or system. The
          assistant&apos;s replies are written by hand and played back.
        </p>
      }
    />
  ),
}
