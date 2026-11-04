import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { allStorySlugs, getStoryMeta } from "@/lib/registry/meta"
import { StoryHost } from "@/components/shell/story-host"

// Only the registered stories exist; any other slug is a static 404.
export const dynamicParams = false

export function generateStaticParams() {
  return allStorySlugs().map((slug) => ({ slug }))
}

export async function generateMetadata(props: PageProps<"/preview/[...slug]">): Promise<Metadata> {
  const { slug } = await props.params
  const meta = getStoryMeta(slug.join("/"))
  return {
    title: meta ? `${meta.title} - Preview` : "Preview",
    description: meta?.summary,
  }
}

export default async function PreviewPage(props: PageProps<"/preview/[...slug]">) {
  const { slug } = await props.params
  const path = slug.join("/")

  if (!getStoryMeta(path)) notFound()

  return <StoryHost slug={path} />
}
