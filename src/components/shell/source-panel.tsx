"use client"

import { useState } from "react"
import { useShell } from "./shell-provider"

export function SourcePanel() {
  const { activeSource, args } = useShell()
  const [copied, setCopied] = useState(false)

  if (!activeSource) {
    return <p className="p-4 text-sm text-muted-foreground">No source available for this story.</p>
  }

  const code = activeSource(args)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <button
        type="button"
        onClick={handleCopy}
        className="self-end rounded-md border border-[var(--shell-line)] bg-[var(--shell-panel)] px-2 py-1 text-[11px] text-muted-foreground hover:text-foreground"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-auto rounded-md border border-[var(--shell-line)] bg-[var(--shell-bg)] p-3 text-[12px] leading-[1.6] text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  )
}
