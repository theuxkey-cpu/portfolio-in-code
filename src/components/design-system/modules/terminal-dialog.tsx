"use client"

import * as React from "react"

import { Button } from "@/components/design-system/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/design-system/ui/dialog"
import { Label } from "@/components/design-system/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/design-system/ui/select"
import { Input } from "@/components/ui/input"

export interface Branch {
  code: string
  name: string
}

export interface Terminal {
  id: string
  name: string
  reference: string
  number: string
  branchCode: string
  status: "active" | "inactive"
  createdBy: string
}

type Mode = "view" | "edit"

type Draft = Omit<Terminal, "id" | "createdBy">

function toDraft(terminal: Terminal): Draft {
  return {
    name: terminal.name,
    reference: terminal.reference,
    number: terminal.number,
    branchCode: terminal.branchCode,
    status: terminal.status,
  }
}

export interface TerminalDialogProps {
  terminal: Terminal
  open: boolean
  onOpenChange: (open: boolean) => void
  branches: readonly Branch[]
  /** Numbers already registered; saving a number that is in this list is blocked. */
  existingNumbers: readonly string[]
  initialMode?: Mode
  onSave: (terminal: Terminal) => void
  /** Extra props for the dialog content, which is portaled out of the page. */
  contentProps?: Omit<React.ComponentProps<typeof DialogContent>, "size" | "children"> & Record<`data-${string}`, string>
}

/**
 * Shows a payment terminal's registration read-only first. "Edit" unlocks the
 * fields, and closing without saving, by any route, drops the draft.
 */
export function TerminalDialog({
  terminal,
  open,
  onOpenChange,
  branches,
  existingNumbers,
  initialMode = "view",
  onSave,
  contentProps,
}: TerminalDialogProps) {
  const [mode, setMode] = React.useState<Mode>(initialMode)
  const [draft, setDraft] = React.useState<Draft>(() => toDraft(terminal))
  const [numberError, setNumberError] = React.useState<string | null>(null)

  function reset() {
    setDraft(toDraft(terminal))
    setNumberError(null)
    setMode("view")
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) reset()
  }

  function handleSave() {
    const taken = existingNumbers.filter((number) => number !== terminal.number).includes(draft.number)
    if (taken) {
      setNumberError("A terminal with this number already exists")
      return
    }
    onSave({ ...terminal, ...draft })
    setNumberError(null)
    setMode("view")
  }

  const readOnly = mode === "view"

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="lg" {...contentProps}>
        <DialogHeader>
          <DialogTitle>{terminal.name}</DialogTitle>
          <DialogClose />
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="terminal-name">Terminal name</Label>
            <Input
              id="terminal-name"
              value={draft.name}
              disabled={readOnly}
              onChange={(event) => setDraft((previous) => ({ ...previous, name: event.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="terminal-reference">Reference</Label>
            <Input
              id="terminal-reference"
              value={draft.reference}
              disabled={readOnly}
              onChange={(event) => setDraft((previous) => ({ ...previous, reference: event.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="terminal-number">Terminal number</Label>
            <Input
              id="terminal-number"
              value={draft.number}
              disabled={readOnly}
              aria-invalid={!!numberError}
              aria-describedby={numberError ? "terminal-number-error" : undefined}
              onChange={(event) => setDraft((previous) => ({ ...previous, number: event.target.value }))}
            />
            {numberError ? (
              <p id="terminal-number-error" className="text-xs text-destructive">
                {numberError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="terminal-branch">Billing branch</Label>
            <Select
              value={draft.branchCode}
              disabled={readOnly}
              onValueChange={(value) => setDraft((previous) => ({ ...previous, branchCode: value }))}
            >
              <SelectTrigger id="terminal-branch" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.code} value={branch.code}>
                    {branch.code} — {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="terminal-status">Status</Label>
            <Select
              value={draft.status}
              disabled={readOnly}
              onValueChange={(value) => setDraft((previous) => ({ ...previous, status: value as Terminal["status"] }))}
            >
              <SelectTrigger id="terminal-status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="terminal-created-by">Created by</Label>
            <Input id="terminal-created-by" value={terminal.createdBy} disabled readOnly />
          </div>
        </div>

        <DialogFooter>
          {/* Distinct keys so React remounts the button on the swap instead of animating one into the other. */}
          {readOnly ? (
            <Button key="edit" onClick={() => setMode("edit")}>
              Edit
            </Button>
          ) : (
            <React.Fragment key="editing">
              <Button key="cancel" variant="outline" onClick={reset}>
                Cancel editing
              </Button>
              <Button key="save" onClick={handleSave}>
                Save
              </Button>
            </React.Fragment>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
