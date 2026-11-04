import type { Metadata } from "next"

// This group deliberately has no <html>/<body> — it nests inside the root
// layout in src/app/layout.tsx, which is what lets the /preview iframe
// inherit the Geist font and the anti-FOUC theme script for free.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <div data-preview>{children}</div>
}
