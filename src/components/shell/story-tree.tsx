"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Collapsible } from "@base-ui/react/collapsible"
import {
  Briefcase,
  Component,
  FileText,
  Folder,
  FolderOpen,
  GraduationCap,
  Palette,
  User,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { caseHref, isWorkStory } from "@/lib/work"
import type { StoryMeta, StoryTreeNode } from "@/lib/registry/types"
import { useShell } from "./shell-provider"

/** Top-level groups that start expanded: what a visitor should see without clicking. */
const OPEN_BY_DEFAULT = ["Selected work", "Previous Work", "Profile"]

/** Per-page icons for the Profile docs; every other story falls back to an icon by kind. */
const SLUG_ICONS: Record<string, LucideIcon> = {
  "foundations/about": User,
  "foundations/skills": Wrench,
  "foundations/experience": Briefcase,
  "foundations/education": GraduationCap,
}

const KIND_ICONS: Record<StoryMeta["kind"], LucideIcon> = {
  doc: FileText,
  flow: Workflow,
  component: Component,
  tokens: Palette,
}

/**
 * Looks like a file explorer (folder and file icons, indent guides — after
 * Magic UI's File Tree) but stays plain <nav>/<ul>-shaped navigation rather than a hand-rolled ARIA "tree"
 * widget (role="tree"/"treeitem" with roving tabindex and arrow-key
 * navigation). A real tree widget done wrong is worse than a link list done
 * right — native <a>/<button> elements are Tab-reachable and
 * Enter/Space-activatable for free, with no custom keyboard handling to get
 * subtly wrong. The shell's own a11y is manual-verified in Fase 1 (Passo 8);
 * this trades a fancier-looking widget for one that's actually correct.
 */
export function StoryTree({ tree }: { tree: readonly StoryTreeNode[] }) {
  return (
    <nav aria-label="Stories" className="flex flex-col gap-0.5 overflow-y-auto px-2 py-3">
      <ul className="flex flex-col gap-0.5">
        {tree.map((node) => (
          <TreeNode key={node.id} node={node} depth={0} />
        ))}
      </ul>
    </nav>
  )
}

function TreeNode({ node, depth }: { node: StoryTreeNode; depth: number }) {
  const pathname = usePathname()
  const { setRailOpen } = useShell()

  if (node.type === "story") {
    const href = isWorkStory(node.meta) ? caseHref(node.meta.slug) : `/system/${node.meta.slug}`
    const active = pathname === href
    const Icon = SLUG_ICONS[node.meta.slug] ?? KIND_ICONS[node.meta.kind]
    return (
      <li>
        <Link
          href={href}
          onClick={() => setRailOpen(false)}
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
            active
              ? "bg-[var(--shell-line)] font-medium text-foreground"
              : "text-muted-foreground hover:bg-[var(--shell-line)]/60 hover:text-foreground"
          )}
        >
          <Icon size={14} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{node.meta.title}</span>
        </Link>
      </li>
    )
  }

  return (
    <li>
      <Collapsible.Root defaultOpen={depth > 0 || OPEN_BY_DEFAULT.includes(node.label)}>
        <Collapsible.Trigger className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] font-medium text-foreground/80 transition-colors hover:bg-[var(--shell-line)]/60 hover:text-foreground">
          <Folder size={14} aria-hidden="true" className="shrink-0 group-data-[panel-open]:hidden" />
          <FolderOpen size={14} aria-hidden="true" className="hidden shrink-0 group-data-[panel-open]:block" />
          <span className="truncate">{node.label}</span>
        </Collapsible.Trigger>
        <Collapsible.Panel>
          <ul className="ml-[15px] flex flex-col gap-0.5 border-l border-[var(--shell-line)] pl-1.5">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </ul>
        </Collapsible.Panel>
      </Collapsible.Root>
    </li>
  )
}
