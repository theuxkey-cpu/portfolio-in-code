import { buildStoryTree } from "@/lib/registry/meta"
import { ShellProvider } from "@/components/shell/shell-provider"
import { ShellChrome } from "@/components/shell/shell-chrome"

// No `metadata` export here anymore — this is the public portfolio now, so
// it inherits the root layout's indexable defaults instead of overriding
// them with `robots: noindex`. (The /preview iframe route keeps its own
// noindex — that's the internal one.)

// Server component: buildStoryTree() runs here (pure, registry/meta.ts is
// server-safe) and the tree is handed down as a prop — the client chrome
// underneath never needs to import the registry itself.
export default function ShellLayout({ children }: { children: React.ReactNode }) {
  const tree = buildStoryTree()
  // Computed server-side and passed down rather than called inside the
  // client ShellChrome — new Date() during a client component's render
  // risks a year-boundary hydration mismatch between server and client.
  const year = new Date().getFullYear()

  return (
    <div data-shell className="fixed inset-0 flex flex-col bg-[var(--shell-bg)] text-foreground">
      <ShellProvider>
        <ShellChrome tree={tree} year={year}>{children}</ShellChrome>
      </ShellProvider>
    </div>
  )
}
