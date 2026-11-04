"use client"

import type { StoryDef } from "@/lib/registry/types"
import { DocProse, TimelineItem } from "./shared"

/** The timeline on its own, reused by the About page. */
export function ExperienceTimeline() {
  return (
    <div className="flex flex-col">
      <TimelineItem
        date="Aug 2026 – Present"
        title="Design Engineer"
        subtitle="Cantu Inc."
        focus={["Design → Code", "Design Systems", "Frontend", "AI-assisted Development"]}
      >
        Building interfaces at the intersection of product design, design systems, and frontend
        engineering. I work directly in code using React, TypeScript, Next.js, Tailwind CSS, and shadcn/ui,
        turning design intent into scalable, accessible interfaces. I use AI as a reasoning and review
        layer throughout the development process, not simply as a code generator.
      </TimelineItem>
      <TimelineItem
        date="Nov 2024 – Aug 2026"
        title="Product Designer"
        subtitle="Cantu Inc."
        focus={["Research", "Interaction Design", "Prototyping", "Design Systems"]}
      >
        Product designer across B2B CRM, supply-chain and e-commerce products, from research and prototype
        through front-end validation with business analysts and engineers. Delivered about 60 UX issues in
        Jira and contributed to a component library built with shadcn, Tailwind, and Ant Design.
      </TimelineItem>
      <TimelineItem date="Sep 2023 – Nov 2024" title="UX/UI Designer" subtitle="Focus Monk" />
      <TimelineItem date="Apr 2023 – Aug 2023" title="UX/UI Designer" subtitle="Lize" />
    </div>
  )
}

export const story: StoryDef<Record<string, never>> = {
  meta: {
    slug: "foundations/experience",
    title: "Experience",
    group: "Profile",
    kind: "doc",
    summary: "Where I work, and what I do there.",
    order: 30,
    hideInspector: true,
  },
  layout: "padded",
  render: () => (
    <DocProse>
      <h1 className="text-xl font-semibold tracking-[-0.01em]">Experience</h1>
      <ExperienceTimeline />
    </DocProse>
  ),
}
