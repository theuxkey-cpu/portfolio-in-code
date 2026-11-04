"use client"

import dynamic from "next/dynamic"
import type { ComponentType } from "react"
import { decodeArgs } from "@/lib/shell/args"
import type { ControlSchema, StoryDef } from "@/lib/registry/types"
import { LAYOUT_CLASS, StoryErrorBoundary } from "@/components/shell/story-host"

/**
 * A story as a page of its own (/work/[slug], /profile/[slug]). Unlike
 * StoryHost, which loads the story in an effect and renders nothing until the
 * browser has it, these are `next/dynamic` imports that are prerendered, so the
 * case or profile text is already in the HTML the server sends. The /preview
 * iframe still uses StoryHost, because it needs the args bridge.
 *
 * The import() has to sit inside the dynamic() call for Next to preload it, so
 * every page story is listed here; add a slug when a new case or profile page
 * is registered in STORY_META.
 */
// `any` is the same deliberate type-erasure boundary as StoryModule in lib/registry/loaders.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toPage(mod: { readonly story: StoryDef<any> }): ComponentType {
  const { story } = mod
  const args = decodeArgs(undefined, story.controls ?? ({} as ControlSchema))
  const layout = story.layout ?? "centered"
  return function StoryPageContent() {
    return (
      <div className={LAYOUT_CLASS[layout]}>
        <StoryErrorBoundary>{story.render(args)}</StoryErrorBoundary>
      </div>
    )
  }
}

const STORY_PAGES: Readonly<Record<string, ComponentType>> = {
  "cases/help-center": dynamic(() => import("@/stories/cases/help-center.story").then(toPage)),
  "cases/verified-prototypes": dynamic(() => import("@/stories/cases/verified-prototypes.story").then(toPage)),
  "cases/ds-dashboard": dynamic(() => import("@/stories/cases/ds-dashboard.story").then(toPage)),
  "cases/ads-agent": dynamic(() => import("@/stories/cases/ads-agent.story").then(toPage)),
  "foundations/experience": dynamic(() => import("@/stories/foundations/experience.story").then(toPage)),
  "foundations/skills": dynamic(() => import("@/stories/foundations/skills.story").then(toPage)),
  "foundations/education": dynamic(() => import("@/stories/foundations/education.story").then(toPage)),
}

export function StoryPage({ slug }: { readonly slug: string }) {
  const Page = STORY_PAGES[slug]
  return Page ? <Page /> : null
}
