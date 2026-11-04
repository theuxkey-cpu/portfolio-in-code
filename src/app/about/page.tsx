import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { AboutTabs } from "@/components/about-tabs"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { profileHref, profileStories } from "@/lib/profile"

export const metadata: Metadata = {
  title: "About",
  description:
    "Keythe Rueckert - Product Designer who builds in code, prototyping product interfaces in React, TypeScript and Next.js.",
  alternates: { canonical: "/about" },
}

const SECTION_TITLE = "text-[13px] font-semibold uppercase tracking-[0.08em] text-foreground/70"

// Experience, education and skills now live on this page, so they drop out of the link list.
const ELSEWHERE_SKIP = new Set(["foundations/experience", "foundations/education", "foundations/skills"])

const LINK =
  "text-[14px] font-medium text-[var(--accent-dim)] underline decoration-dotted underline-offset-4 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-4"

export default function AboutPage() {
  return (
    <>
      <SiteHeader current="about" />
      <div className="mx-auto max-w-[760px] px-6">
        <main id="main" className="flex flex-col gap-10 py-12">
          <header className="flex flex-col gap-5">
            <Image
              src="/profile.png"
              alt="Keythe Rueckert"
              quality={95}
              width={96}
              height={96}
              priority
              className="rounded-full object-cover ring-1 ring-[var(--tag-border)]"
            />
            <h1 className="text-[clamp(28px,5vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em]">
              Hi, I&apos;m <span className="text-[var(--accent-dim)]">Keythe</span>.
            </h1>
            <p className="max-w-[600px] text-[17px] leading-[1.6] text-foreground/75">
              I&apos;m a Product Designer with 4 years in UX/UI, the last two on B2B SaaS across CRM, supply chain, and
              wholesale operations. I design for mobile and desktop, and I now prototype and build interfaces and
              design systems in React, TypeScript, and Next.js.            </p>
            <p className="max-w-[600px] text-[17px] leading-[1.6] text-foreground/75">
              I use AI agents as pair-programmers and reviewers. You can see how in two of the
              cases: a{" "}
              <Link href="/work/verified-prototypes" className="underline underline-offset-4 hover:text-foreground">
                checker for AI-made prototypes
              </Link>{" "}
              that says what it could not verify, and a{" "}
              <Link href="/work/help-center" className="underline underline-offset-4 hover:text-foreground">
                help center
              </Link>{" "}
              whose assistant knows when to say &ldquo;I don&apos;t know&rdquo;.
            </p>
          </header>

          <AboutTabs />

          <section aria-labelledby="ai-title" className="flex flex-col gap-4 border-t border-border pt-8">
            <h2 id="ai-title" className={SECTION_TITLE}>
              How I build with AI
            </h2>
            <p className="max-w-[600px] text-[15px] leading-[1.65] text-foreground/75">
              I work with Claude Code in VS Code, with MCP servers for GitHub and Vercel, and I use NotebookLM to
              synthesize research. The agent writes code. I decide what it is allowed to touch and I check what it
              hands back.
            </p>
            <ul className="flex max-w-[600px] flex-col gap-3 text-[15px] leading-[1.65] text-foreground/75">
              <li>
                <strong className="font-semibold text-foreground">Scope first.</strong> On a UI task the agent does
                not touch endpoints, models or business rules. If data is missing, it gets a mock or a TODO, not a
                guess.
              </li>
              <li>
                <strong className="font-semibold text-foreground">No rule without a source.</strong> I do not let it
                implement a calculation, status or validation until the document that defines it is in front of it.
              </li>
              <li>
                <strong className="font-semibold text-foreground">Verified before done.</strong> Typecheck, lint,
                build, then a real click-through in the browser. Accessibility is checked with axe, not assumed.
              </li>
              <li>
                <strong className="font-semibold text-foreground">What I reject.</strong> Workarounds that bypass the
                design system&apos;s tokens, new components that ignore an existing pattern, and any commit or push I
                did not ask for.
              </li>
              <li>
                <strong className="font-semibold text-foreground">Corrections become rules.</strong> When the agent
                gets something wrong, I write the rule into its instructions, or into a hook when a script can check
                it, so the same mistake does not come back.
              </li>
            </ul>
            <p className="max-w-[600px] text-[15px] leading-[1.65] text-foreground/75">
              Two real failures of this kind are documented in the{" "}
              <Link
                href="/work/verified-prototypes"
                className="underline underline-offset-4 hover:text-foreground"
              >
                checker case
              </Link>
              : a setup command that said &ldquo;you can go ahead&rdquo; without having run a single check, and a
              template that used a class its own checker would reject.
            </p>
          </section>

          <section aria-labelledby="elsewhere-title" className="border-t border-border pt-8">
            <h2 id="elsewhere-title" className={`mb-4 ${SECTION_TITLE}`}>
              Elsewhere
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {profileStories()
                .filter((meta) => !ELSEWHERE_SKIP.has(meta.slug))
                .map((meta) => (
                <Link key={meta.slug} href={profileHref(meta.slug)} className={LINK}>
                  {meta.title}
                </Link>
              ))}
              <Link href="/contact" className={LINK}>Let&apos;s talk</Link>
              <a href="/Keythe_Resume.pdf" className={LINK}>Resume</a>
              <a href="mailto:keytherueckert93@gmail.com" className={LINK}>Email</a>
              <a href="https://www.linkedin.com/in/keythee/" className={LINK} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              <a href="https://github.com/theuxkey-cpu" className={LINK} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>
          </section>
        </main>
      </div>
      <SiteFooter />
    </>
  )
}
