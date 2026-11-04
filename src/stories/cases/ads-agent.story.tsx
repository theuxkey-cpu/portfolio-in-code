"use client"

import dynamic from "next/dynamic"

import type { StoryDef } from "@/lib/registry/types"
import { CaseFrame, type CaseFact, type CaseSection } from "@/components/case/case-frame"
import { Callout, H, Points, Steps, T } from "@/components/case/case-copy"
import { PrototypeSkeleton } from "@/components/prototype/prototype-frame"

const AdsAgentPrototype = dynamic(
  () => import("@/prototypes/ads-agent/prototype").then((m) => m.AdsAgentPrototype),
  { loading: () => <PrototypeSkeleton /> }
)

const FACTS: readonly CaseFact[] = [
  { label: "Role", value: "Designer and developer. I wrote the behavior, the copy and the code" },
  { label: "Type", value: "Self-initiated concept. Fictional account, invented numbers" },
  { label: "Stack", value: "React, TypeScript, Motion, Tailwind" },
  { label: "Replies", value: "Scripted. No model runs behind it" },
  { label: "Evidence", value: "No user research. Checked by me, see Result" },
]

const SECTIONS: readonly CaseSection[] = [
  {
    id: "context",
    label: "Context",
    content: (
      <>
        <H>An assistant that can touch money has to earn the right to</H>
        <T>
          Ad accounts spend real money every hour. An AI assistant that can read the account and change it needs an
          interface that answers three questions the person will ask: what did you look at, how sure are you, and what
          happens if I say yes.
        </T>
        <T>
          This is a scenario I set for myself. The account, the campaigns and every number are invented, and the
          assistant&apos;s replies are written by hand and played back. I did not build a model or connect it to any ad
          platform; I built the interface around one.
        </T>
        <Callout title="What this case is, and isn&apos;t.">
          A concept. I did not interview people who run ad accounts, so the behaviors below are my design decisions, not
          findings. The question I wanted to test is whether an assistant can be fast to read and still be honest about
          what it doesn&apos;t know.
        </Callout>
      </>
    ),
  },
  {
    id: "decisions",
    label: "Decisions",
    content: (
      <>
        <H>Four things the interface refuses to blur</H>
        <Points
          items={[
            {
              title: "Evidence and guess look different",
              body: "Every step it takes is labelled: from the account, my reading, or missing data. A reading is never written in the same voice as a number it read.",
            },
            {
              title: "Nothing reaches the account without a yes",
              body: "A proposal shows both budgets before and after, the expected effect and what it rests on. Apply, Dismiss and Undo are separate, explicit actions, and the page says out loud that nothing has changed yet.",
            },
            {
              title: "Missing data is an answer, not an error",
              body: "When conversions stopped arriving, the assistant says the last nine days are empty (not zero), declines to recommend, and lists what would unblock it. There is no proposal to apply.",
            },
            {
              title: "The person can change the proposal",
              body: "The amount moved can be raised or lowered before approving. The caution about how far the receiving campaign has been seen to hold follows the amount.",
            },
          ]}
        />
        <H>What I left out</H>
        <T>
          There is no free-text box. A fake input that answers three canned sentences would suggest a capability the
          prototype does not have, so the two questions are buttons.
        </T>
      </>
    ),
  },
  {
    id: "solution",
    label: "How it works",
    content: (
      <>
        <H>Ask, watch, decide</H>
        <Steps
          steps={[
            { label: "Ask" },
            { label: "Steps stream in", highlight: true },
            { label: "Answer and proposal" },
            { label: "Approve, change or dismiss", highlight: true },
          ]}
        />
        <Points
          items={[
            {
              title: "Streaming you can stop",
              body: "The steps appear one by one and the answer types out. Stop is always there while it runs, and says that nothing was changed.",
            },
            {
              title: "Reduced motion",
              body: "With prefers-reduced-motion the steps and answer appear complete at once, and the entrances, the bar changes and the spinner are not animated.",
            },
            {
              title: "A record of what changed",
              body: "The account panel keeps a list of every change, including dismissals and undos, so what happened is visible after the conversation scrolls away.",
            },
          ]}
        />
      </>
    ),
  },
  {
    id: "result",
    label: "Result",
    content: (
      <>
        <H>What I checked, and what I haven&apos;t</H>
        <T>
          I ran these checks on the built site in Chrome on 4 November 2026. They test the interface, not whether it
          helps anyone.
        </T>
        <Points
          items={[
            {
              title: "Automated accessibility scan: clean after three fixes",
              body: "axe-core 4.13 (WCAG 2.0 to 2.2, levels A and AA, plus its best-practice rules) on the page in light and dark, at 1280 and 375 px wide, at the start, after each of the two answers, after Apply and after Undo. It found three problems, all fixed: panel headings that skipped a level, the account panel scrolling at 375 px without a way to reach it by keyboard, and focus dropping to the page when a question button turned into Stop. It now reports none in those states.",
            },
            {
              title: "Keyboard only",
              body: "I asked, stopped and approved a change using only Tab and Enter, and Undo is the next stop after Apply. Focus moves to Stop when a run starts, to the messages when it ends, and to the Proposed change heading when its status changes. Apply, Dismiss and the amount buttons are reachable in order.",
            },
            {
              title: "Reduced motion",
              body: "With prefers-reduced-motion on, an answer is complete in about 0.15 seconds. With it off, the same answer takes about 6 seconds to stream.",
            },
            {
              title: "No horizontal scroll at 375 px",
              body: "Measured in both themes, with a conversation and a proposal on screen.",
            },
          ]}
        />
        <T>
          Not checked: a screen reader (I did not run NVDA or VoiceOver), the Dismiss path with axe, and any state in the
          middle of an animation. An automated scan finds only part of what can be wrong, so a clean report is not a
          pass.
        </T>
        <Callout title="What this doesn&apos;t show.">
          There is no user research behind it, and no model. I have not measured whether people trust it more, decide
          faster or make fewer mistakes. It shows that the behaviors can be designed, built and checked, not that they
          work for people who run real accounts.
        </Callout>
      </>
    ),
  },
  {
    id: "reflection",
    label: "Reflection",
    content: (
      <>
        <H>What I would do next</H>
        <T>
          Sit with two or three people who manage ad spend and give them the missing-data case first. I suspect the
          refusal to recommend is the part they would trust most or resent most, and I would rather find out from them
          than guess.
        </T>
      </>
    ),
  },
]

export const story: StoryDef<Record<string, never>> = {
  meta: {
    slug: "cases/ads-agent",
    title: "Ad account assistant",
    group: "Selected work",
    kind: "flow",
    summary: "An AI assistant for an ad account that shows its steps, admits missing data and waits for approval — a concept with fictional data.",
    order: 4,
    hideInspector: true,
  },
  layout: "fullscreen",
  render: () => (
    <CaseFrame
      context="Self-initiated concept — fictional data, scripted replies"
      hint="Try it: ask a question, then approve, change or dismiss the proposal"
      prototype={<AdsAgentPrototype />}
      sourcePath="src/prototypes/ads-agent"
      prototypePosition="top"
      tagline="Design Engineering · AI agent interface"
      title="An assistant that shows its work and waits for a yes"
      description="A self-initiated concept for an AI assistant that reads an ad account, shows what it did, separates what it read from what it guesses, says when it lacks the data, and changes nothing until you approve."
      outcome="A prototype of the interface, not of a model: the replies are scripted and the account is invented. Scanned with axe in both themes at two widths and used by keyboard; not tested with screen readers or with users."
      tags={[
        { label: "Self-initiated concept", accent: true },
        { label: "AI interface" },
        { label: "Motion" },
        { label: "React · TypeScript" },
      ]}
      facts={FACTS}
      sections={SECTIONS}
      footer={
        <p className="mt-12 border-t border-border pt-6 text-[12px] leading-[1.6] text-foreground/70">
          The ad account, campaigns, amounts and replies are fictional and do not depict any real product or system.
        </p>
      }
    />
  ),
}
