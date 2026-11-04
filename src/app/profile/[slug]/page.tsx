import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StoryPage } from "@/components/shell/story-page"
import { profileStoryFor, profileStories } from "@/lib/profile"

// Only the registered profile pages exist; any other slug is a static 404.
export const dynamicParams = false

export function generateStaticParams() {
  return profileStories().map((meta) => ({ slug: meta.slug.split("/").pop() as string }))
}

export async function generateMetadata(props: PageProps<"/profile/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const meta = profileStoryFor(slug)
  if (!meta) return { title: "Not Found" }
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: `/profile/${slug}` },
  }
}

/**
 * A profile page (experience, skills, education) on its own, under the shared
 * top menu. The content is the same story the shell used to show; the heading
 * is raised to match the About page.
 */
export default async function ProfilePage(props: PageProps<"/profile/[slug]">) {
  const { slug } = await props.params
  const meta = profileStoryFor(slug)

  if (!meta) notFound()

  return (
    <>
      <SiteHeader />
      <main id="main" className="[&_h1]:text-[clamp(28px,5vw,40px)] [&_h1]:leading-[1.15] [&_h1]:tracking-[-0.02em]">
        <StoryPage slug={meta.slug} />
      </main>
      <SiteFooter />
    </>
  )
}
