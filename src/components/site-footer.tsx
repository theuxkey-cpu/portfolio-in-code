import Link from "next/link"
import { profileHref, profileStories } from "@/lib/profile"

/** Footer shared by the public pages: the profile pages and the résumé, so no page ends in a dead end. */
export function SiteFooter() {
  return (
    <footer className="mx-auto flex w-full max-w-[1040px] flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-6 text-[12px] text-foreground/70 md:px-8 print:hidden">
      <span>© {new Date().getFullYear()} Keythe Rueckert</span>
      <nav aria-label="Profile" className="flex flex-wrap gap-x-5 gap-y-1">
        {profileStories().map((meta) => (
          <Link key={meta.slug} href={profileHref(meta.slug)} className="hover:text-foreground">
            {meta.title}
          </Link>
        ))}
        <Link href="/recruiter" className="hover:text-foreground">30-second summary</Link>
        <a href="/Keythe_Resume.pdf" className="hover:text-foreground">Resume</a>
      </nav>
    </footer>
  )
}
