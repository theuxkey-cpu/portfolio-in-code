"use client"

import { useId } from "react"
import { AlertTriangle } from "lucide-react"
import type { ReactNode } from "react"

interface FormFieldProps {
  label: string
  required?: boolean
  children: ReactNode
  hint?: ReactNode
  error?: string
  labelSuffix?: ReactNode
}

export function FormField({ label, required, children, hint, error, labelSuffix }: FormFieldProps) {
  const msgId = useId()

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1">
        <label className="text-sm font-normal text-foreground">
          {label.replace(/\s*\(.*?\)/, "")}
          {/\(.*?\)/.test(label) && (
            <span className="ml-1 text-muted-foreground">{label.match(/\(.*?\)/)?.[0]}</span>
          )}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
        {labelSuffix}
      </div>
      {children}
      {error ? (
        <div id={msgId} role="alert" className="flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle className="size-3 shrink-0" />
          {error}
        </div>
      ) : hint ? (
        <div id={msgId} className="text-xs text-muted-foreground">{hint}</div>
      ) : null}
    </div>
  )
}
