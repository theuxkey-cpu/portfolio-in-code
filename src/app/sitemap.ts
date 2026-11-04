import type { MetadataRoute } from "next"
import { STORY_META } from "@/lib/registry/meta"
import { SITE_URL } from "@/lib/site"
import { profileHref, profileStories } from "@/lib/profile"
import { caseHref, isWorkStory } from "@/lib/work"

export default function sitemap(): MetadataRoute.Sitemap {
  const cases = STORY_META.filter(isWorkStory).map((meta) => ({
    url: `${SITE_URL}${caseHref(meta.slug)}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))
  const profile = profileStories().map((meta) => ({
    url: `${SITE_URL}${profileHref(meta.slug)}`,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }))

  return [
    { url: SITE_URL, changeFrequency: "monthly" as const, priority: 1 },
    { url: `${SITE_URL}/recruiter`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly" as const, priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly" as const, priority: 0.4 },
    ...cases,
    ...profile,
  ]
}
