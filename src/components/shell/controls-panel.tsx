"use client"

import type { ControlDef } from "@/lib/registry/types"
import { useShell } from "./shell-provider"

/**
 * Generic schema -> input renderer. Args live in ShellProvider today; the
 * Passo 6 bridge will push changes here into the preview iframe over
 * postMessage without this component needing to change.
 */
export function ControlsPanel() {
  const { activeControls, args, setArg, resetArgs } = useShell()

  if (!activeControls) {
    return <p className="p-4 text-sm text-muted-foreground">This story has no configurable props.</p>
  }

  const entries = Object.entries(activeControls)

  return (
    <div className="flex flex-col gap-4 p-4">
      {entries.map(([key, def]) => (
        <ControlRow key={key} name={key} def={def} value={args[key]} onChange={(value) => setArg(key, value)} />
      ))}
      <button
        type="button"
        onClick={resetArgs}
        className="self-start text-xs text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
      >
        Reset to defaults
      </button>
    </div>
  )
}

function ControlRow({
  name,
  def,
  value,
  onChange,
}: {
  readonly name: string
  readonly def: ControlDef
  readonly value: unknown
  readonly onChange: (value: string | number | boolean) => void
}) {
  const label = def.label ?? name
  const inputId = `control-${name}`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-[11px] font-medium uppercase tracking-[0.05em] text-muted-foreground">
        {label}
      </label>
      <ControlInput id={inputId} def={def} value={value} onChange={onChange} />
      {def.hint && <p className="text-[11px] text-muted-foreground">{def.hint}</p>}
    </div>
  )
}

function ControlInput({
  id,
  def,
  value,
  onChange,
}: {
  readonly id: string
  readonly def: ControlDef
  readonly value: unknown
  readonly onChange: (value: string | number | boolean) => void
}) {
  switch (def.type) {
    case "boolean":
      return (
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 accent-[var(--accent-dim)]"
        />
      )
    case "number":
      return (
        <input
          id={id}
          type="number"
          value={typeof value === "number" ? value : def.default}
          min={def.min}
          max={def.max}
          step={def.step}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-8 rounded-md border border-[var(--shell-line)] bg-[var(--shell-panel)] px-2 text-sm text-foreground"
        />
      )
    case "select":
    case "radio":
      return (
        <select
          id={id}
          value={typeof value === "string" ? value : def.default}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 rounded-md border border-[var(--shell-line)] bg-[var(--shell-panel)] px-2 text-sm text-foreground"
        >
          {def.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label ?? option.value}
            </option>
          ))}
        </select>
      )
    case "text":
      return (
        <input
          id={id}
          type="text"
          value={typeof value === "string" ? value : def.default}
          placeholder={def.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="h-8 rounded-md border border-[var(--shell-line)] bg-[var(--shell-panel)] px-2 text-sm text-foreground"
        />
      )
  }
}
