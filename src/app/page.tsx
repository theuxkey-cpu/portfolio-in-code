import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { ReflowDemo } from "@/components/home/reflow-demo"
import { SiteFooter } from "@/components/site-footer"
import { SELECTED_WORK, caseHref } from "@/lib/work"

export const metadata: Metadata = {
  title: { absolute: "Keythe Rueckert - Product Designer" },
  alternates: { canonical: "/" },
}

const EYEBROW =
  "inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.08em] text-foreground/70 before:block before:h-px before:w-5 before:bg-foreground/50 before:content-['']"

const LINK =
  "text-[14px] font-medium text-[var(--accent-dim)] underline decoration-dotted underline-offset-4 hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-4"

export default function Home() {
  return (
    <>
      <SiteHeader current="home" />
      <div className="mx-auto w-full max-w-[1040px] px-5 md:px-8">

        <main id="main">
          <section aria-labelledby="hero-title" className="grid gap-10 py-12 md:grid-cols-[1fr_1fr] md:items-center md:gap-14 md:py-20">
            <div>
              <p className={`${EYEBROW} mb-5`}>B2B SaaS · Design systems</p>
              <h1
                id="hero-title"
                className="mb-5 text-[clamp(30px,5.2vw,48px)] font-semibold leading-[1.1] tracking-[-0.025em]"
              >
                Product Designer who builds in code.
              </h1>
              <p className="mb-8 max-w-[520px] text-[17px] leading-[1.6] text-foreground/75">
                I design workflows for complex B2B software, then prototype them in React and TypeScript, with AI as a
                development partner.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#work"
                  className="inline-flex h-11 items-center rounded-full bg-foreground px-5 text-[14px] font-medium text-background hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  View selected work
                </a>
                <Link
                  href="/recruiter"
                  className="inline-flex h-11 items-center rounded-full border border-border px-5 text-[14px] font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  30-second summary
                </Link>
                <a href="/Keythe_Resume.pdf" className={`${LINK} px-1`}>Resume</a>
              </div>
            </div>
            <div>
              <ReflowDemo />
            </div>
          </section>

          <section id="work" aria-labelledby="work-title" className="scroll-mt-16 border-t border-border py-12 md:py-16">
            <div className="reveal">
              <p className={`${EYEBROW} mb-3`}>Selected work</p>
              <h2 id="work-title" className="mb-8 text-[clamp(22px,3.4vw,30px)] font-semibold tracking-[-0.02em]">
                Four cases, each with a prototype you can use
              </h2>
            </div>
            <ul className="grid gap-4 md:grid-cols-2">
              {SELECTED_WORK.map((item) => (
                <li key={item.slug} className="flex">
                  <div className="reveal flex w-full">
                    <Link
                      href={caseHref(item.slug)}
                      className="group flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-[var(--card-hover-border)] hover:bg-[var(--card-hover-bg)] focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
                    >
                      {/* Decorative: the title below says what the case is. */}
                      {/* One image per theme. They are lazy, and a lazy image that is display:none is
                       * never fetched, so only the current theme's set is downloaded. Do not add
                       * priority or loading="eager" here. */}
                      <div className="-mx-5 -mt-5 mb-1 border-b border-border">
                        <Image
                          src={item.thumb}
                          alt=""
                          width={1006}
                          height={507}
                          sizes="(min-width: 1040px) 320px, (min-width: 768px) 30vw, 100vw"
                          className="block h-auto w-full dark:hidden"
                        />
                        <Image
                          src={item.thumbDark}
                          alt=""
                          width={1006}
                          height={507}
                          sizes="(min-width: 1040px) 320px, (min-width: 768px) 30vw, 100vw"
                          className="hidden h-auto w-full dark:block"
                        />
                      </div>
                      <span className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">
                        {item.kicker}
                      </span>
                      <span className="text-[18px] font-semibold leading-[1.25] tracking-[-0.015em]">{item.title}</span>
                      <span className="text-[14px] leading-[1.6] text-foreground/75">{item.outcome}</span>
                      <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                        {item.tags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-[var(--tag-border)] bg-[var(--tag-bg)] px-2.5 py-1 text-[11px] font-medium text-foreground/75"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <span className="pt-1 text-[13px] font-medium text-[var(--accent-dim)] group-hover:underline">
                        Read the case and try the prototype →
                      </span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="how-title" className="border-t border-border py-12 md:py-16">
            <div className="reveal">
              <p className={`${EYEBROW} mb-3`}>How I work</p>
              <h2 id="how-title" className="mb-6 text-[clamp(22px,3.4vw,30px)] font-semibold tracking-[-0.02em]">
                Every case says what was measured and what was not
              </h2>
              <p className="max-w-[760px] text-[15px] leading-[1.6] text-foreground/75">
                The help center is real work with the prototype rebuilt in code and sample data; the verified prototypes
                are a recreation with fictional data; the third is an excerpt of an internal tool. Each page lists what was checked (axe-core and keyboard, in Chromium) and where there is
                no user research or adoption data yet.
              </p>
            </div>
          </section>

          <section aria-labelledby="contact-title" className="border-t border-border py-12 md:py-16">
            <div className="reveal">
              <h2 id="contact-title" className="mb-4 text-[clamp(22px,3.4vw,30px)] font-semibold tracking-[-0.02em]">
                Let&apos;s talk
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                <Link href="/contact" className={LINK}>Send a message</Link>
                <a href="mailto:keytherueckert93@gmail.com" className={LINK}>Email</a>
                <a href="https://www.linkedin.com/in/keythee/" className={LINK} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href="https://github.com/theuxkey-cpu" className={LINK} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </div>
          </section>
        </main>

      </div>
      <SiteFooter />
    </>
  )
}
