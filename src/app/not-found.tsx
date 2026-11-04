import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[760px] px-6 py-20">
        <h1 className="mb-4 text-[clamp(28px,5vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em]">
          This page does not exist.
        </h1>
        <p className="mb-6 max-w-[480px] text-[17px] leading-[1.6] text-foreground/75">
          The link may be old. The cases are on the home page, and the 30-second summary has the short version.
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-3 text-[14px] font-medium text-[var(--accent-dim)]">
          <Link href="/#work" className="underline decoration-dotted underline-offset-4 hover:decoration-solid">
            See the work
          </Link>
          <Link href="/recruiter" className="underline decoration-dotted underline-offset-4 hover:decoration-solid">
            30-second summary
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
