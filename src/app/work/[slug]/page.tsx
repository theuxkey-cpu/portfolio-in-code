import type { CSSProperties } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CasePager } from "@/components/case/case-pager"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StoryPage } from "@/components/shell/story-page"
import { caseStoryFor, orderedWorkStories, outcomeFor } from "@/lib/work"

// Only the registered cases exist; any other slug is a static 404.
export const dynamicParams = false

export function generateStaticParams() {
  return orderedWorkStories().map((meta) => ({ slug: meta.slug.split("/").pop() as string }))
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const meta = caseStoryFor(slug)
  if (!meta) return { title: "Not Found" }
  const description = outcomeFor(meta.slug) ?? meta.summary
  return {
    title: meta.title,
    description: meta.summary,
    alternates: { canonical: `/work/${slug}` },
    // Link previews: the case's own title and outcome line. The image is drawn by the /og route.
    openGraph: {
      title: `${meta.title} - Keythe Rueckert`,
      description,
      url: `/work/${slug}`,
      siteName: "Keythe Rueckert",
      type: "website",
      images: [{ url: `/og/${meta.slug}`, width: 1200, height: 630, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.title} - Keythe Rueckert`,
      description,
      images: [`/og/${meta.slug}`],
    },
  }
}

/**
 * One case on its own page, under the shared top menu. The case itself is the
 * same story the shell used to show in an iframe; here it is the page, so there
 * is no sidebar and no scroll inside a scroll.
 */
export default async function WorkPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params
  const meta = caseStoryFor(slug)

  if (!meta) notFound()

  // data-preview carries the prototype's brand purple; --site-header-h is the
  // height of the sticky menu, so the case's own sticky nav sits right under it.
  return (
    <>
      <SiteHeader />
      <CasePager slug={meta.slug} />
      <div data-preview style={{ "--site-header-h": "55px" } as CSSProperties}>
        <StoryPage slug={meta.slug} />
      </div>
      <SiteFooter />
    </>
  )
}
