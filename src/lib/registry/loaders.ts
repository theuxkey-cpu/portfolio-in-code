import type { StoryDef } from "./types"

interface StoryModule {
  // Each *.story.tsx file authors itself with a concrete, narrow
  // StoryDef<typeof controls> so its own render/source/args stay typed.
  // Storing that in a shared map necessarily erases the schema type here —
  // TS's strict function-parameter contravariance rejects assigning a
  // StoryDef<NarrowSchema> into a StoryDef<ControlSchema> slot, since a
  // narrower `render` isn't safely substitutable for a wider one. `any` is
  // the deliberate type-erasure boundary; StoryHost only ever calls
  // `story.render(args)` with the args it just decoded from that same
  // story's own schema, so the erased type never leaks into a real mismatch.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly story: StoryDef<any>
}

/**
 * One dynamic import() literal per story — the bundler can't resolve a
 * templated path, and a single monolithic stories module would drag the
 * entire design system into one chunk. Every slug in STORY_META must have a
 * matching entry here (Fase 3 could grow this list; not enforced here yet).
 */
export const STORY_LOADERS: Readonly<Record<string, () => Promise<StoryModule>>> = {
  "foundations/about": () => import("@/stories/foundations/about.story"),
  "foundations/skills": () => import("@/stories/foundations/skills.story"),
  "foundations/experience": () => import("@/stories/foundations/experience.story"),
  "foundations/education": () => import("@/stories/foundations/education.story"),
  "cases/ds-dashboard": () => import("@/stories/cases/ds-dashboard.story"),
  "cases/help-center": () => import("@/stories/cases/help-center.story"),
  "cases/verified-prototypes": () => import("@/stories/cases/verified-prototypes.story"),
  "cases/ads-agent": () => import("@/stories/cases/ads-agent.story"),
}

export function hasStoryLoader(slug: string): boolean {
  return slug in STORY_LOADERS
}
