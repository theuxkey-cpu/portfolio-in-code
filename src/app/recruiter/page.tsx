import type { Metadata } from "next"
import Link from "next/link"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { REPO_URL } from "@/lib/repo"
import { SELECTED_WORK, caseHref } from "@/lib/work"

const DESCRIPTION =
  "Keythe Rueckert in one screen: role, four selected cases with their outcomes, stack and contact."

export const metadata: Metadata = {
  title: "30-second summary",
  description: DESCRIPTION,
  alternates: { canonical: "/recruiter" },
  // Setting these replaces the root layout's values instead of merging, so the
  // site name, type, card and the root opengraph-image are repeated here.
  openGraph: {
    title: "Keythe Rueckert - 30-second summary",
    description: DESCRIPTION,
    url: "/recruiter",
    siteName: "Keythe Rueckert",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keythe Rueckert - 30-second summary",
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
}

const STACK = [
  "React",
  "TypeScript",
  "Next.js",
  "Tailwind CSS",
  "shadcn/ui",
  "TanStack Table",
  "Storybook",
  "Vitest",
  "axe-core",
  "Claude Code",
  "MCP (GitHub, Vercel)",
  "NotebookLM",
  "VS Code",
] as const

const LINK =
  "text-[14px] font-medium text-[var(--accent-dim)] underline decoration-dotted underline-offset-4 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-4"

const LABEL = "mb-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-foreground/70"

/**
 * One scannable page for someone with thirty seconds: what I do, the best
 * work with what was measured, the stack and how to reach me. Static, no
 * animation, and it is set up to print on one page.
 */
export default function RecruiterPage() {
  return (
    <>
      <SiteHeader />
      <div className="mx-auto w-full max-w-[760px] px-5 py-6 md:px-8 md:py-10 print:max-w-none print:px-0 print:py-0 print:[zoom:0.88]">
        <main id="main">
          <header className="border-b border-border pb-8 print:pb-3">
            <p className={LABEL}>30-second summary</p>
            <h1 className="mb-3 text-[clamp(26px,5vw,38px)] font-semibold leading-[1.1] tracking-[-0.02em]">
              Keythe Rueckert, Product Designer
            </h1>
            <p className="text-[17px] leading-[1.6] text-foreground/75">
              Product Designer who builds in code. I design workflows for complex B2B software, then prototype them in
              React and TypeScript.
            </p>
          </header>

          <section aria-labelledby="now-title" className="border-b border-border py-8 print:py-3">
            <h2 id="now-title" className={LABEL}>Experience</h2>
            <ul className="grid gap-3 text-[15px] leading-[1.6]">
              <li>
                <strong className="font-semibold">Design Engineer, Cantu Inc.</strong>{" "}
                <span className="text-foreground/75">(Aug 2026 to present)</span>. Building interfaces between product
                design, design systems and frontend engineering, working directly in code.
              </li>
              <li>
                <strong className="font-semibold">Product Designer, Cantu Inc.</strong>{" "}
                <span className="text-foreground/75">(Nov 2024 to Aug 2026)</span>. Product designer across B2B CRM,
                supply-chain and e-commerce products: research, prototyping in Figma and front-end validation.
              </li>
              <li>
                <span className="text-foreground/75">
                  Earlier: UX/UI Designer at Focus Monk (Sep 2023 to Nov 2024) and Lize (Apr to Aug 2023).
                </span>
              </li>
              <li>
                <strong className="font-semibold">Postgraduate, UX Engineer, PUC Minas</strong>{" "}
                <span className="text-foreground/75">(in progress, Aug 2026 to Dec 2027)</span>.
              </li>
            </ul>
          </section>

          <section aria-labelledby="terms-title" className="border-b border-border py-8 print:py-3">
            <h2 id="terms-title" className={LABEL}>Working with me</h2>
            <dl className="grid gap-4 text-[15px] leading-[1.6] print:gap-2">
              <div className="grid gap-y-0.5 sm:grid-cols-[130px_1fr] sm:gap-x-8">
                <dt className="text-foreground/70">Availability</dt>
                <dd>Open to full-time and contract roles as a Product Designer who builds in code, or as a Design Engineer.</dd>
              </div>
              <div className="grid gap-y-0.5 sm:grid-cols-[130px_1fr] sm:gap-x-8">
                <dt className="text-foreground/70">Location</dt>
                <dd>Brazil (UTC−3), working remotely.</dd>
              </div>
              <div className="grid gap-y-0.5 sm:grid-cols-[130px_1fr] sm:gap-x-8">
                <dt className="text-foreground/70">Languages</dt>
                <dd>English (advanced, professional working proficiency). Portuguese (fluent).</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="work-title" className="border-b border-border py-8 print:py-3">
            <h2 id="work-title" className={LABEL}>Best work</h2>
            <ol className="grid gap-6 print:gap-3">
              {SELECTED_WORK.map((item) => (
                <li key={item.slug}>
                  <p className="text-[16px] font-semibold leading-[1.3]">{item.title}</p>
                  <p className="mt-1 text-[14px] leading-[1.6] text-foreground/75">{item.outcome}</p>
                  <Link href={caseHref(item.slug)} className={`${LINK} mt-1 inline-block`}>
                    Open the case<span className="sr-only">: {item.title}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="how-title" className="border-b border-border py-8 print:py-3">
            <h2 id="how-title" className={LABEL}>How the work is checked</h2>
            <p className="text-[15px] leading-[1.6] text-foreground/75">
              The help center is real work with the prototype rebuilt in code and sample data; the verified prototypes
              are a recreation with fictional data; the third is an excerpt of an internal tool. Each case says what was measured and what was not, including where there is no user research or
              adoption data.
            </p>
          </section>

          <section aria-labelledby="stack-title" className="border-b border-border py-8 print:py-3">
            <h2 id="stack-title" className={LABEL}>Stack</h2>
            <ul className="flex flex-wrap gap-2">
              {STACK.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-[var(--tag-border)] bg-[var(--tag-bg)] px-2.5 py-1 text-[12px] font-medium text-foreground/75"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="contact-title" className="py-8 print:py-3">
            <h2 id="contact-title" className={LABEL}>Contact</h2>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              <li><a href="mailto:keytherueckert93@gmail.com" className={LINK}>keytherueckert93@gmail.com</a></li>
              <li>
                <a href="https://www.linkedin.com/in/keythee/" className={LINK} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://github.com/theuxkey-cpu" className={LINK} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href={REPO_URL} className={LINK} target="_blank" rel="noopener noreferrer">
                  Source of this site
                </a>
              </li>
              <li><a href="/Keythe_Resume.pdf" className={LINK}>Resume (PDF)</a></li>
              <li><Link href="/contact" className={LINK}>Contact form</Link></li>
            </ul>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  )
}
