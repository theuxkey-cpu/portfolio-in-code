"use client"

import type { StoryDef } from "@/lib/registry/types"
import { DocProse, DocLead, DocSection, Tag, TagRow } from "./shared"

/** The skill groups on their own, reused by the About page (nested under its h2). */
export function SkillGroups({ level = 2 }: { level?: 2 | 3 }) {
  return (
    <>
      <DocSection level={level} title="Product Design">
        <TagRow>
          <Tag>UX Research</Tag>
          <Tag>Usability Testing</Tag>
          <Tag>Interaction Design</Tag>
          <Tag>Information Architecture</Tag>
          <Tag>High-Fidelity UI</Tag>
          <Tag>Interactive Prototyping</Tag>
          <Tag>Design QA &amp; Handoff</Tag>
        </TagRow>
      </DocSection>

      <DocSection level={level} title="Design Engineering">
        <TagRow>
          <Tag>Design Engineering</Tag>
          <Tag>Design Systems</Tag>
          <Tag>React · TypeScript</Tag>
          <Tag>Component APIs</Tag>
          <Tag>Design Tokens</Tag>
          <Tag>Container Queries</Tag>
        </TagRow>
      </DocSection>

      <DocSection level={level} title="Interaction & Flows">
        <TagRow>
          <Tag>Responsive Design</Tag>
          <Tag>Complex Data Tables</Tag>
          <Tag>Live Calculation</Tag>
          <Tag>Multi-step Flow</Tag>
        </TagRow>
      </DocSection>

      <DocSection level={level} title="Quality">
        <TagRow>
          <Tag>Accessibility</Tag>
          <Tag>Automated a11y (axe)</Tag>
          <Tag>Reduced Motion</Tag>
        </TagRow>
      </DocSection>

      <DocSection level={level} title="AI & Workflow">
        <TagRow>
          <Tag>Claude Code</Tag>
          <Tag>MCP</Tag>
          <Tag>Claude</Tag>
          <Tag>ChatGPT</Tag>
          <Tag>Gemini</Tag>
          <Tag>Perplexity</Tag>
          <Tag>NotebookLM</Tag>
          <Tag>Lovable</Tag>
          <Tag>Figma Make</Tag>
        </TagRow>
      </DocSection>

      <DocSection level={level} title="Engineering">
        <TagRow>
          <Tag>Next.js</Tag>
          <Tag>React</Tag>
          <Tag>TypeScript</Tag>
          <Tag>Tailwind CSS</Tag>
          <Tag>shadcn/ui</Tag>
          <Tag>Base UI</Tag>
          <Tag>Radix UI</Tag>
          <Tag>Storybook</Tag>
          <Tag>VS Code</Tag>
          <Tag>GitHub</Tag>
          <Tag>Supabase</Tag>
          <Tag>Vercel</Tag>
        </TagRow>
      </DocSection>

      <DocSection level={level} title="Design">
        <TagRow>
          <Tag>Figma</Tag>
        </TagRow>
      </DocSection>
    </>
  )
}

export const story: StoryDef<Record<string, never>> = {
  meta: {
    slug: "foundations/skills",
    title: "Skills & Tools",
    group: "Profile",
    kind: "doc",
    summary: "What I do across product design and design engineering, and what I use to do it.",
    order: 20,
    hideInspector: true,
  },
  layout: "padded",
  render: () => (
    <DocProse>
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold tracking-[-0.01em]">Skills &amp; Tools</h1>
        <DocLead>
          Product design is where I started and design engineering is where I work now. The design skills, research
          and usability testing included, come from my work as a UX/UI designer on B2B products; the cases on this
          site are prototypes, not research studies. The engineering skills are the ones I put into those prototypes.
          The tools are what actually gets used, not a badge wall.
        </DocLead>
      </div>

      <SkillGroups />
    </DocProse>
  ),
}
