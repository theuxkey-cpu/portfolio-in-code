import { ImageResponse } from "next/og"
import { allStorySlugs, getStoryMeta } from "@/lib/registry/meta"
import { outcomeFor } from "@/lib/work"

const SIZE = { width: 1200, height: 630 }

// A route handler, not an opengraph-image file: Next adds a hash segment after
// an opengraph-image route, and a catch-all like /system/[...slug] cannot be
// followed by anything. Pages point here from generateMetadata.
// Only the stories in the registry get an image; anything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return allStorySlugs().map((slug) => ({ slug }))
}

/** One image per story: the group, the title and the outcome line (or the summary). */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params
  const meta = getStoryMeta(slug.join("/"))
  const title = meta?.title ?? "Keythe Rueckert"
  const kicker = meta?.group ?? "Portfolio"
  const text = (meta ? (outcomeFor(meta.slug) ?? meta.summary) : undefined) ?? "Product Designer"

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 96px",
          background: "#1a1510",
          color: "#f5efe6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#b8ab98" }}>
          Keythe Rueckert · Product Designer
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 2, textTransform: "uppercase", color: "#c9a876" }}>
            {kicker}
          </div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 600, letterSpacing: -2, lineHeight: 1.05 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontSize: 30, lineHeight: 1.35, color: "#d8cdbb", maxWidth: 980 }}>
            {text}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#b8ab98" }}>keyportfolio.vercel.app</div>
      </div>
    ),
    { ...SIZE }
  )
}
