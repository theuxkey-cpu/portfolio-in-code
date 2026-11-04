"use client"

import type * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/design-system/ui/input-group"

export interface QuantityFieldProps {
  value: number
  /** No max means no ceiling. */
  max?: number
  onChange: (value: number) => void
  "aria-label": string
  disabled?: boolean
}

/**
 * A quantity stepper: a numeric field with a minus and a plus button. It uses
 * `inputMode="numeric"` rather than `type="number"` so the browser's own spinner
 * doesn't duplicate the buttons.
 */
export function QuantityField({ value, max, onChange, "aria-label": ariaLabel, disabled }: QuantityFieldProps) {
  function clamp(next: number): number {
    const atLeastZero = Math.max(0, next)
    return max !== undefined ? Math.min(max, atLeastZero) : atLeastZero
  }

  function onType(event: React.ChangeEvent<HTMLInputElement>) {
    const typed = event.target.value.replace(/\D/g, "")
    onChange(clamp(typed === "" ? 0 : Number(typed)))
  }

  return (
    // has-disabled:* in InputGroup fires when any child is disabled; here only one of the two
    // buttons is at its limit while the input stays active, so that dimming is switched off.
    <InputGroup className="w-28 has-disabled:bg-transparent has-disabled:opacity-100 dark:has-disabled:bg-transparent">
      <InputGroupAddon align="inline-start">
        <InputGroupButton
          aria-label={`Decrease ${ariaLabel.toLowerCase()}`}
          onClick={() => onChange(clamp(value - 1))}
          disabled={disabled || value <= 0}
        >
          <MinusIcon />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupInput aria-label={ariaLabel} inputMode="numeric" value={value} onChange={onType} disabled={disabled} />
      <InputGroupAddon align="inline-end">
        <InputGroupButton
          aria-label={`Increase ${ariaLabel.toLowerCase()}`}
          onClick={() => onChange(clamp(value + 1))}
          disabled={disabled || (max !== undefined && value >= max)}
        >
          <PlusIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
