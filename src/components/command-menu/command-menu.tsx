"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  ArrowUpRight,
  Briefcase,
  FileText,
  GraduationCap,
  Home,
  Mail,
  Moon,
  Sun,
  User,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/design-system/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/design-system/ui/dialog"
import { useTheme } from "@/hooks/use-theme"
import { isMenuShortcut, OPEN_COMMAND_MENU_EVENT, openCommandMenu } from "@/lib/command-menu"
import { profileHref, profileStories } from "@/lib/profile"
import { caseHref, orderedWorkStories } from "@/lib/work"

const PROFILE_ICONS: Readonly<Record<string, LucideIcon>> = {
  "foundations/experience": Briefcase,
  "foundations/skills": Wrench,
  "foundations/education": GraduationCap,
}

const EXTERNAL_LINKS = [
  { label: "Resume (PDF)", href: "/Keythe_Resume.pdf", keywords: ["cv", "curriculum"], icon: FileText },
  { label: "Email", href: "mailto:keytherueckert93@gmail.com", keywords: ["contact", "write"], icon: Mail },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/keythee/", keywords: ["social"], icon: ArrowUpRight },
  { label: "GitHub", href: "https://github.com/theuxkey-cpu", keywords: ["code", "social"], icon: ArrowUpRight },
] as const

/**
 * Command menu (⌘K / Ctrl K). Mounted once in the root layout. Inside the
 * shell's preview iframe it renders nothing and only forwards the shortcut to
 * the parent page, so the menu opens in the right window.
 */
export function CommandMenu() {
  const pathname = usePathname()
  const inPreview = pathname.startsWith("/preview")

  useEffect(() => {
    if (!inPreview) return
    function onKeyDown(event: KeyboardEvent) {
      if (isMenuShortcut(event)) {
        event.preventDefault()
        try {
          openCommandMenu(window.parent)
        } catch {
          // parent is not reachable: nothing to open
        }
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [inPreview])

  if (inPreview) return null
  return <CommandMenuDialog />
}

function CommandMenuDialog() {
  const router = useRouter()
  const { theme, toggle } = useTheme()
  const [open, setOpen] = useState(false)
  // Radix only returns focus to a Trigger, and this menu has none, so the
  // element that had focus when it opened is remembered and refocused on close.
  const openerRef = useRef<HTMLElement | null>(null)
  const openRef = useRef(false)

  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => {
    function show() {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      setOpen(true)
    }
    function onKeyDown(event: KeyboardEvent) {
      if (!isMenuShortcut(event)) return
      event.preventDefault()
      if (openRef.current) setOpen(false)
      else show()
    }
    const onOpen = () => show()
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener(OPEN_COMMAND_MENU_EVENT, onOpen)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener(OPEN_COMMAND_MENU_EVENT, onOpen)
    }
  }, [])

  const run = useCallback((action: () => void) => {
    setOpen(false)
    action()
  }, [])

  const go = useCallback(
    (href: string) =>
      run(() => {
        // The page the opener lives on is about to be replaced: do not hand focus back to it.
        openerRef.current = null
        router.push(href)
      }),
    [run, router]
  )
  const openExternal = useCallback(
    (href: string) =>
      run(() => {
        if (href.startsWith("mailto:") || href.endsWith(".pdf")) window.location.href = href
        else window.open(href, "_blank", "noopener,noreferrer")
      }),
    [run]
  )

  const work = orderedWorkStories()
  const dark = theme === "dark"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        size="lg"
        className="top-[15%] w-[calc(100%-2rem)] translate-y-0 gap-0 overflow-hidden p-0"
        aria-describedby="command-menu-description"
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          openerRef.current?.focus()
        }}
      >
        <DialogTitle className="sr-only">Search pages and links</DialogTitle>
        <DialogDescription id="command-menu-description" className="sr-only">
          Type to filter. Use the arrow keys to move and Enter to open.
        </DialogDescription>
        <Command label="Search pages and links" className="max-h-[70vh]">
          <CommandInput placeholder="Search work, pages and links" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>

            <CommandGroup heading="Work">
              {work.map((meta) => (
                <CommandItem
                  key={meta.slug}
                  value={`${meta.title} ${meta.group}`}
                  keywords={["case", "prototype"]}
                  onSelect={() => go(caseHref(meta.slug))}
                >
                  <Workflow aria-hidden="true" />
                  <span className="truncate">{meta.title}</span>
                  <CommandShortcut className="shrink-0 tracking-normal">{meta.group}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Pages">
              <CommandItem value="Home" keywords={["start", "landing"]} onSelect={() => go("/")}>
                <Home aria-hidden="true" />
                Home
              </CommandItem>
              <CommandItem value="About" keywords={["profile", "bio", "me"]} onSelect={() => go("/about")}>
                <User aria-hidden="true" />
                About
              </CommandItem>
              <CommandItem
                value="30-second summary"
                keywords={["recruiter", "overview", "short", "resume", "tldr"]}
                onSelect={() => go("/recruiter")}
              >
                <FileText aria-hidden="true" />
                30-second summary
              </CommandItem>
              {profileStories().map((meta) => {
                const Icon = PROFILE_ICONS[meta.slug] ?? User
                return (
                  <CommandItem key={meta.slug} value={meta.title} keywords={["profile"]} onSelect={() => go(profileHref(meta.slug))}>
                    <Icon aria-hidden="true" />
                    {meta.title}
                  </CommandItem>
                )
              })}
              <CommandItem value="Contact" keywords={["message", "form", "talk"]} onSelect={() => go("/contact")}>
                <Mail aria-hidden="true" />
                Contact
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Links">
              {EXTERNAL_LINKS.map((link) => (
                <CommandItem
                  key={link.href}
                  value={link.label}
                  keywords={[...link.keywords]}
                  onSelect={() => openExternal(link.href)}
                >
                  <link.icon aria-hidden="true" />
                  {link.label}
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandGroup heading="Preferences">
              <CommandItem
                value={dark ? "Switch to light mode" : "Switch to dark mode"}
                keywords={["theme", "appearance", "dark", "light"]}
                onSelect={() => run(() => toggle())}
              >
                {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                {dark ? "Switch to light mode" : "Switch to dark mode"}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}
