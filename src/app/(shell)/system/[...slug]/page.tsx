import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { allStorySlugs, getStoryMeta } from "@/lib/registry/meta"
import { outcomeFor } from "@/lib/work"
import { StorySync } from "@/components/shell/story-sync"

// Only the registered stories exist; any other slug is a static 404.
export const dynamicParams = false

export function generateStaticParams() {
  return allStorySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata(props: PageProps<"/system/[...slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const path = slug.join("/")
  const meta = getStoryMeta(path)
  return {
    title: meta?.title ?? "Not Found",
    description: meta?.summary,
    // Canonical without the `?a=` query string: Stage mirrors live control
    // args into the URL (stage.tsx's history.replaceState), so the same
    // story can be reached through many arg combinations — this keeps
    // search engines pointed at one URL per story instead of indexing each
    // variation separately.
    alternates: { canonical: `/system/${path}` },
    // Link previews: the story's own title and outcome line instead of the
    // site-wide card. The image is drawn by the /og route.
    openGraph: meta
      ? {
          title: `${meta.title} - Keythe Rueckert`,
          description: outcomeFor(meta.slug) ?? meta.summary,
          url: `/system/${path}`,
          siteName: "Keythe Rueckert",
          type: "website",
          images: [{ url: `/og/${path}`, width: 1200, height: 630, alt: meta.title }],
        }
      : undefined,
    twitter: meta
      ? {
          card: "summary_large_image",
          title: `${meta.title} - Keythe Rueckert`,
          description: outcomeFor(meta.slug) ?? meta.summary,
          images: [`/og/${path}`],
        }
      : undefined,
  }
}

// Renders no visible UI of its own — the Stage (iframe) and Inspector live
// in the persistent (shell)/layout.tsx chrome. This page's only job is to
// tell the client-side ShellProvider which story is now active. It does not
// read searchParams, so it is prerendered; StorySync reads `?a=` in the browser.
export default async function SystemStoryPage(props: PageProps<"/system/[...slug]">) {
  const { slug } = await props.params
  const meta = getStoryMeta(slug.join("/"))

  if (!meta) notFound()

  return <StorySync meta={meta} />
}
