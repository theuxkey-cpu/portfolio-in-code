import Link from "next/link"
import { CommandMenuButton } from "@/components/command-menu/command-menu-button"

const NAV_LINK = "py-2 text-foreground/75 hover:text-foreground aria-[current=page]:font-medium aria-[current=page]:text-foreground"

type Page = "home" | "about" | "contact"

/** Top bar shared by the public pages. Sticky, so the menu is always one click away. */
export function SiteHeader({ current }: { current?: Page }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur print:hidden">
      <div className="mx-auto flex w-full max-w-[1040px] items-center justify-between gap-4 px-5 py-2 md:px-8">
        <Link
          href="/"
          aria-current={current === "home" ? "page" : undefined}
          className="whitespace-nowrap py-2 text-[14px] font-semibold tracking-[-0.01em]"
        >
          Keythe Rueckert
        </Link>
        <div className="flex items-center gap-x-3 sm:gap-x-4 md:gap-x-5">
          <nav aria-label="Main" className="flex items-center gap-x-3 text-[13px] sm:gap-x-4 md:gap-x-5">
            <Link href="/#work" className={NAV_LINK}>Work</Link>
            <Link href="/about" aria-current={current === "about" ? "page" : undefined} className={NAV_LINK}>About</Link>
            <Link href="/contact" aria-current={current === "contact" ? "page" : undefined} className={NAV_LINK}>Contact</Link>
            <a href="/Keythe_Resume.pdf" className={`${NAV_LINK} max-sm:hidden`}>Resume</a>
          </nav>
          <CommandMenuButton />
        </div>
      </div>
    </header>
  )
}
