import { STORY_META } from "@/lib/registry/meta"
import type { StoryMeta } from "@/lib/registry/types"

/** The About story is the standalone /about page, so it is not listed here. */
const ABOUT_SLUG = "foundations/about"

/** The profile stories that have their own page: experience, skills, education. */
export function profileStories(): StoryMeta[] {
  return STORY_META.filter((meta) => meta.group === "Profile" && meta.slug !== ABOUT_SLUG).sort(
    (a, b) => (a.order ?? 100) - (b.order ?? 100)
  )
}

/** The page of a profile story, e.g. "foundations/skills" -> "/profile/skills". */
export function profileHref(slug: string): string {
  return `/profile/${slug.split("/").pop()}`
}

/** The profile story behind a /profile/[slug] URL segment, or undefined when there is none. */
export function profileStoryFor(param: string): StoryMeta | undefined {
  return profileStories().find((meta) => profileHref(meta.slug) === `/profile/${param}`)
}
