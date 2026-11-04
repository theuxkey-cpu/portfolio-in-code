"use client"

import Image from "next/image"
import Link from "next/link"
import type { StoryDef } from "@/lib/registry/types"
import { DocProse, DocLead, DocSection, ExternalLink } from "./shared"

export const story: StoryDef<Record<string, never>> = {
  meta: {
    slug: "foundations/about",
    title: "About",
    group: "Profile",
    kind: "doc",
    summary: "Who's behind this and how a Product Designer works in code.",
    order: 10,
    hideInspector: true,
  },
  layout: "padded",
  render: () => (
    <DocProse>
      <div className="flex flex-col gap-4">
        <Image
          src="/profile.png"
          alt="Keythe Rueckert"
          width={96}
          height={96}
          priority
          className="rounded-full object-cover ring-1 ring-[var(--tag-border)]"
        />
        <h1 className="text-xl font-semibold tracking-[-0.01em]">
          Hi, I&apos;m <span className="text-[var(--accent-dim)]">Keythe</span>.
        </h1>
        <DocLead>
          I&apos;m a Product Designer with 4 years in UX/UI, the last two on B2B SaaS across CRM, supply chain, and
          wholesale operations. I design for mobile and desktop, and I now prototype and build interfaces and
          design systems in React, TypeScript, and Next.js.        </DocLead>
        <DocLead>
          I use AI agents as pair-programmers and reviewers. You can see how in two of the
          cases: a{" "}
          <Link href="/work/verified-prototypes" target="_top" className="underline underline-offset-4 hover:text-foreground">
            checker for AI-made prototypes
          </Link>{" "}
          that says what it could not verify, and a{" "}
          <Link href="/work/help-center" target="_top" className="underline underline-offset-4 hover:text-foreground">
            help center
          </Link>{" "}
          whose assistant knows when to say &ldquo;I don&apos;t know&rdquo;.
        </DocLead>
      </div>

      <DocSection title="Start here">
        {/* target="_top": this story renders inside the shell's preview iframe, so a plain link would load the
         * whole site inside the frame. */}
        <Link
          href="/work/help-center"
          target="_top"
          className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none"
        >
          <span className="text-[15px] font-semibold tracking-[-0.01em]">Help center</span>
          <span className="text-[13px] leading-[1.6] text-muted-foreground">
            Help placed inside the screen where the question starts, with an assistant that says when it does not
            know. Real work, with the prototype rebuilt in code and sample data.
          </span>
          <span className="text-[13px] font-medium text-[var(--accent-dim)] group-hover:underline">
            Read the case and try the prototype →
          </span>
        </Link>
      </DocSection>

      <DocSection title="Elsewhere">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <ExternalLink href="/contact">Let&apos;s talk</ExternalLink>
          <ExternalLink href="/Keythe_Resume.pdf">Resume</ExternalLink>
          <ExternalLink href="mailto:keytherueckert93@gmail.com">Email</ExternalLink>
          <ExternalLink href="https://www.linkedin.com/in/keythee/">LinkedIn</ExternalLink>
          <ExternalLink href="https://github.com/theuxkey-cpu">GitHub</ExternalLink>
        </div>
      </DocSection>
    </DocProse>
  ),
}
