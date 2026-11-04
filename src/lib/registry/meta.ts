import type { StoryMeta, StoryTreeNode } from "./types"

/**
 * Pure story metadata, `as const` — same shape convention as
 * src/lib/scenarios.ts ("content separated from the component"). This file
 * imports nothing from React and is safe for server components: it feeds
 * both the sidebar tree and `generateStaticParams`.
 *
 * Real components/tokens/flows are Fase 2+; the Profile group is
 * content authored from the existing portfolio (bio, case tags, experience,
 * education) rather than a smoke test.
 */
export const STORY_META: readonly StoryMeta[] = [
  {
    slug: "cases/ds-dashboard",
    title: "Design system governance",
    group: "Selected work",
    kind: "flow",
    summary: "A design system health dashboard, plus the pipelines that let analysts and developers build from the real catalog.",
    order: 3,
    hideInspector: true,
  },
  {
    slug: "cases/help-center",
    title: "Help center",
    group: "Selected work",
    kind: "flow",
    summary: "Help placed inside the screen where the question starts, with an assistant that says when it does not know, with the prototype rebuilt in code.",
    order: 1,
    hideInspector: true,
  },
  {
    slug: "cases/verified-prototypes",
    title: "Verified prototypes",
    group: "Selected work",
    kind: "flow",
    summary: "AI-made prototypes checked against a design system by a report that says what it could not check, recreated with fictional data.",
    order: 2,
    hideInspector: true,
  },
  {
    slug: "cases/ads-agent",
    title: "Ad account assistant",
    group: "Selected work",
    kind: "flow",
    summary: "An AI assistant for an ad account that shows its steps, admits missing data and waits for approval, a concept with fictional data.",
    order: 4,
    hideInspector: true,
  },
  {
    slug: "foundations/about",
    title: "About",
    group: "Profile",
    kind: "doc",
    summary: "Who's behind this and how a Product Designer works in code.",
    order: 10,
    hideInspector: true,
  },
  {
    slug: "foundations/skills",
    title: "Skills & Tools",
    group: "Profile",
    kind: "doc",
    summary: "What I do across product design and design engineering, and what I use to do it.",
    order: 20,
    hideInspector: true,
  },
  {
    slug: "foundations/experience",
    title: "Experience",
    group: "Profile",
    kind: "doc",
    summary: "Where I work, and what I do there.",
    order: 30,
    hideInspector: true,
  },
  {
    slug: "foundations/education",
    title: "Education & Courses",
    group: "Profile",
    kind: "doc",
    summary: "Formal education plus the ongoing, self-directed tracks.",
    order: 40,
    hideInspector: true,
  },
] as const

/** The story that opens when a visitor lands on "/" or bare "/system" — typed
 * off STORY_META so renaming the About slug fails the build instead of
 * redirecting into a silent notFound() at runtime. */
export const LANDING_SLUG: (typeof STORY_META)[number]["slug"] = "foundations/about"

export function getStoryMeta(slug: string): StoryMeta | undefined {
  return STORY_META.find((meta) => meta.slug === slug)
}

/** Already in the shape generateStaticParams expects: one string[] per route. */
export function allStorySlugs(): string[][] {
  return STORY_META.map((meta) => meta.slug.split("/"))
}

export function buildStoryTree(): StoryTreeNode[] {
  const groupOrder: string[] = []
  const groups = new Map<string, Map<string, StoryMeta[]>>()

  for (const meta of STORY_META) {
    const subKey = meta.subgroup ?? ""
    if (!groups.has(meta.group)) {
      groups.set(meta.group, new Map())
      groupOrder.push(meta.group)
    }
    const subgroups = groups.get(meta.group) as Map<string, StoryMeta[]>
    if (!subgroups.has(subKey)) subgroups.set(subKey, [])
    ;(subgroups.get(subKey) as StoryMeta[]).push(meta)
  }

  const byOrder = (a: StoryMeta, b: StoryMeta) => (a.order ?? 100) - (b.order ?? 100)

  return groupOrder.map((group) => {
    const subgroups = groups.get(group) as Map<string, StoryMeta[]>
    const children: StoryTreeNode[] = []

    for (const [subKey, metas] of subgroups) {
      const storyNodes: StoryTreeNode[] = [...metas]
        .sort(byOrder)
        .map((meta) => ({ type: "story" as const, id: meta.slug, meta }))

      if (subKey === "") {
        children.push(...storyNodes)
      } else {
        children.push({ type: "group", id: `${group}/${subKey}`, label: subKey, children: storyNodes })
      }
    }

    return { type: "group", id: group, label: group, children }
  })
}
