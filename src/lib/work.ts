import { STORY_META } from "@/lib/registry/meta"
import type { StoryMeta } from "@/lib/registry/types"

/**
 * Cards for the Home page. The slug, title and outcome mirror the case pages
 * (src/stories/cases and src/stories/work); keep them in step when a case is
 * rewritten. Plain data, so the Home stays a server component.
 */
export interface WorkItem {
  readonly slug: string
  readonly title: string
  readonly kicker: string
  readonly outcome: string
  readonly tags: readonly string[]
  /** Screenshot of the prototype in the light theme, 1006 x 507, in public/work/thumbs. */
  readonly thumb: string
  /** Same screenshot in the dark theme. */
  readonly thumbDark: string
}

export const SELECTED_WORK: readonly WorkItem[] = [
  {
    slug: "cases/help-center",
    title: "Fewer how-to tickets by putting help where the question starts",
    kicker: "Product Design · Support and AI",
    outcome:
      "About 20% fewer tickets overall, estimated from a model (inputs listed in the case). I did not build the assistant; I owned the knowledge it answers from. No user test yet.",
    tags: ["Real work", "Support and AI", "React · TypeScript"],
    thumb: "/work/thumbs/help-center.jpg",
    thumbDark: "/work/thumbs/help-center-dark.jpg",
  },
  {
    slug: "cases/verified-prototypes",
    title: "Prototypes that obey the design system, and say what they could not check",
    kicker: "Design Engineering · AI prototyping",
    outcome:
      "A checker that blocks what it can prove wrong, and a report that lists what it could not check. First version working, pilot not run yet, no adoption data.",
    tags: ["Recreated work", "AI prototyping", "React · TypeScript"],
    thumb: "/work/thumbs/verified-prototypes.jpg",
    thumbDark: "/work/thumbs/verified-prototypes-dark.jpg",
  },
  {
    slug: "cases/ds-dashboard",
    title: "A design system you can read at a glance",
    kicker: "Design Engineering · Governance",
    outcome:
      "I built a health dashboard and two pipelines so analysts and developers work from the same real catalog. It is tested and the team is starting to adopt it; I have no adoption numbers yet.",
    tags: ["Internal tool", "Governance", "React · TypeScript"],
    thumb: "/work/thumbs/ds-dashboard.jpg",
    thumbDark: "/work/thumbs/ds-dashboard-dark.jpg",
  },
  {
    slug: "cases/ads-agent",
    title: "An assistant that shows its work and waits for a yes",
    kicker: "Design Engineering · AI agent interface",
    outcome:
      "A prototype of the interface, not of a model: the replies are scripted and the account is invented. Scanned with axe in both themes at two widths and used by keyboard; not tested with screen readers or with users.",
    tags: ["Self-initiated concept", "AI interface", "React · TypeScript"],
    thumb: "/work/thumbs/ads-agent.jpg",
    thumbDark: "/work/thumbs/ads-agent-dark.jpg",
  },
]

/** Cases kept off the site for now (their files stay in the repo). Empty while only the four selected cases are shown. */
export const MORE_WORK: readonly { readonly slug: string; readonly title: string; readonly note: string }[] = []

/** Outcome lines of the cases that are not on the Home cards. Same wording as on the case page. */
const OTHER_OUTCOMES: Readonly<Record<string, string>> = {}

/** The outcome line of a case, or undefined when its page has none (then use the story summary). */
export function outcomeFor(slug: string): string | undefined {
  return SELECTED_WORK.find((item) => item.slug === slug)?.outcome ?? OTHER_OUTCOMES[slug]
}

/** The sidebar groups that hold work, in the order they are shown. */
export const WORK_GROUPS: readonly string[] = ["Selected work", "Previous Work", "Also built"]

/** True for the stories that are cases (the work groups), not profile pages. */
export function isWorkStory(meta: StoryMeta): boolean {
  return WORK_GROUPS.includes(meta.group)
}

/** The case's own page, e.g. "cases/help-center" -> "/work/help-center". */
export function caseHref(slug: string): string {
  return `/work/${slug.split("/").pop()}`
}

/** The case behind a /work/[slug] URL segment, or undefined when there is none. */
export function caseStoryFor(param: string): StoryMeta | undefined {
  return orderedWorkStories().find((meta) => caseHref(meta.slug) === `/work/${param}`)
}

/** Every case, in the order of the sidebar: by group, then by `order`. */
export function orderedWorkStories(): StoryMeta[] {
  return STORY_META.filter((meta) => WORK_GROUPS.includes(meta.group)).sort(
    (a, b) => WORK_GROUPS.indexOf(a.group) - WORK_GROUPS.indexOf(b.group) || (a.order ?? 100) - (b.order ?? 100)
  )
}
