import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    // /preview is the chrome-less iframe the shell embeds; it is not a page to index.
    rules: { userAgent: "*", allow: "/", disallow: "/preview" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
