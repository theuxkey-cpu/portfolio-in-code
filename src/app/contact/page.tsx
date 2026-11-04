import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Keythe Rueckert - Product Designer who builds in code, prototyping product interfaces in React.",
  alternates: { canonical: "/contact" },
}

export default function ContactPage() {
  return (
    <>
      <SiteHeader current="contact" />
      <main id="main" className="mx-auto max-w-[760px] px-6">
        <header className="border-b border-border pb-14 pt-12">
          <p className="mb-6 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.08em] text-muted-foreground before:block before:h-px before:w-5 before:bg-muted-foreground before:content-['']">
            Contact
          </p>
          <h1 className="mb-4 text-[clamp(28px,5vw,44px)] font-semibold leading-[1.15] tracking-[-0.02em]">
            Let&apos;s work together.
          </h1>
          <p className="max-w-[480px] text-[17px] leading-[1.6] text-muted-foreground">
            Open to full-time and contract roles. Tell me what you&apos;re building and I&apos;ll get back to you within 24 hours.
          </p>
        </header>

        <form
          action="https://formspree.io/f/mnjyqelk"
          method="POST"
          className="flex flex-col gap-6 py-14"
        >
          <input type="hidden" name="_subject" value="Portfolio contact — Keythe Rueckert" />

          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Your name"
                className="rounded-lg border border-border bg-[var(--surface-2)] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="your@email.com"
                className="rounded-lg border border-border bg-[var(--surface-2)] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="message" className="text-[12px] font-medium uppercase tracking-[0.06em] text-muted-foreground">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              placeholder="Tell me about your project, team, or what you're looking for..."
              className="resize-none rounded-lg border border-border bg-[var(--surface-2)] px-4 py-3 text-[14px] text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start">
            <p className="text-[12px] text-muted-foreground">
              Or reach me directly at{" "}
              <a
                href="mailto:keytherueckert93@gmail.com"
                className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                keytherueckert93@gmail.com
              </a>
            </p>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent-warm)] px-6 py-3 text-sm font-medium text-[var(--btn-cta-text)] transition-opacity hover:opacity-80"
            >
              Send message
            </button>
          </div>
        </form>
      </main>
      <SiteFooter />
    </>
  )
}
