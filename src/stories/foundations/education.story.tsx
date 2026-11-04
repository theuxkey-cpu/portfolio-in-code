"use client"

import type { StoryDef } from "@/lib/registry/types"
import { DocProse, TimelineItem } from "./shared"

/** The timeline on its own, reused by the About page. */
export function EducationTimeline() {
  return (
    <div className="flex flex-col">
      <TimelineItem date="Aug 2026 – Dec 2027" title="Postgraduate Degree, UX Engineer" subtitle="PUC Minas">
        Postgraduate specialization bridging product design and software engineering: UX Engineering, Design
        Systems, Front-End Architecture, React, HTML, CSS, JavaScript, Node.js, APIs and Web Services, DevOps,
        software quality and testing, Agile project management, and emerging technologies in digital
        experiences.
      </TimelineItem>
      <TimelineItem
        date="2025 – Present"
        title="AI for Product Design (ongoing)"
        tools={["ChatGPT", "Claude", "Perplexity", "NotebookLM", "Gemini", "VS Code", "GitHub", "Supabase", "Lovable", "Figma Make"]}
      >
        Leveraging AI across discovery, research, UX strategy, documentation, prototyping, and product
        delivery. Building workflows that transform complexity into faster and more confident product
        decisions.
      </TimelineItem>
      <TimelineItem
        date="2023 – 2024"
        title="MBA, UX Research, Research Ops & Design Leadership"
        subtitle="UNIFATEC"
      >
        Innovation, AI, and UX with emphasis on research, usability, and data-driven product design.
      </TimelineItem>
      <TimelineItem date="2015 – 2018" title="Bachelor, Advertising & Marketing">
        Strategy, consumer behavior and digital communication.
      </TimelineItem>
    </div>
  )
}

export const story: StoryDef<Record<string, never>> = {
  meta: {
    slug: "foundations/education",
    title: "Education & Courses",
    group: "Profile",
    kind: "doc",
    summary: "Formal education plus the ongoing, self-directed tracks.",
    order: 40,
    hideInspector: true,
  },
  layout: "padded",
  render: () => (
    <DocProse>
      <h1 className="text-xl font-semibold tracking-[-0.01em]">Education &amp; Courses</h1>
      <EducationTimeline />
    </DocProse>
  ),
}
