"use client"

import { Check } from "lucide-react"
import { useShell } from "./shell-provider"
import type { AuditIssue } from "@/lib/shell/protocol"

const IMPACT_ORDER: Record<string, number> = { critical: 0, serious: 1, moderate: 2, minor: 3 }

export function A11yPanel() {
  const { auditState, requestAudit, args } = useShell()

  const stale = auditState.status === "done" && auditState.argsSnapshot !== args

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={requestAudit}
          disabled={auditState.status === "running"}
          className="rounded-md border border-[var(--shell-line)] px-3 py-1.5 text-sm text-foreground transition-colors hover:bg-[var(--shell-line)] disabled:opacity-50"
        >
          {auditState.status === "running" ? "Running…" : auditState.status === "done" ? "Re-run audit" : "Run audit"}
        </button>
        {stale && <span className="text-[11px] text-[var(--note-warn-accent)]">Results are for the previous props</span>}
      </div>

      {auditState.status === "idle" && (
        <p className="text-sm text-muted-foreground">Runs axe-core against the component currently on stage.</p>
      )}

      {auditState.status === "error" && <p className="text-sm text-destructive">{auditState.message}</p>}

      {auditState.status === "done" && (
        <div className="flex flex-col gap-4">
          <p className="text-[11px] text-muted-foreground">
            {auditState.result.engine} &middot; {auditState.result.rulesPassed} rules passed
          </p>

          {auditState.result.violations.length === 0 && auditState.result.incomplete.length === 0 && (
            <p className="text-sm text-foreground">No violations found in this scope.</p>
          )}

          {auditState.result.violations.length > 0 && (
            <IssueGroup title={`Violations (${auditState.result.violations.length})`} issues={auditState.result.violations} />
          )}

          {auditState.result.incomplete.length > 0 && (
            <IssueGroup title={`Needs review (${auditState.result.incomplete.length})`} issues={auditState.result.incomplete} />
          )}

          <details className="text-[11px] text-muted-foreground">
            <summary className="cursor-pointer select-none">
              Rules excluded in component scope ({auditState.result.excluded.length})
            </summary>
            <ul className="mt-2 flex flex-col gap-2 border-l border-[var(--shell-line)] pl-3">
              {auditState.result.excluded.map((rule) => (
                <li key={rule.id} title={rule.reason} className="flex items-center justify-between gap-2">
                  <span className="font-mono text-foreground">{rule.id}</span>
                  <Check size={12} strokeWidth={2} className="shrink-0 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  )
}

function IssueGroup({ title, issues }: { readonly title: string; readonly issues: readonly AuditIssue[] }) {
  const sorted = [...issues].sort((a, b) => (IMPACT_ORDER[a.impact ?? ""] ?? 9) - (IMPACT_ORDER[b.impact ?? ""] ?? 9))

  return (
    <div className="flex flex-col gap-2">
      <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">{title}</p>
      <ul className="flex flex-col gap-2">
        {sorted.map((issue) => (
          <li key={issue.id} className="rounded-md border border-[var(--shell-line)] bg-[var(--shell-bg)] p-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">{issue.help}</span>
              {issue.impact && (
                <span className="rounded-full border border-[var(--shell-line)] px-2 py-0.5 text-[10px] uppercase text-muted-foreground">
                  {issue.impact}
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {issue.nodes.length} element{issue.nodes.length === 1 ? "" : "s"} &middot;{" "}
              <a href={issue.helpUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-dotted underline-offset-2">
                Learn more
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
