"use client"

import { Info, AlertTriangle, XCircle } from "lucide-react"

type AlertVariant = "info" | "warning" | "error"

interface AccountAlertProps {
  variant: AlertVariant
  title: string
  description: string
}

const styles: Record<AlertVariant, { container: string; icon: string; Icon: typeof Info }> = {
  info: {
    container: "border-blue-300 bg-blue-100 text-blue-800",
    icon: "text-blue-700",
    Icon: Info,
  },
  warning: {
    container: "border-orange-300 bg-orange-100 text-orange-800",
    icon: "text-orange-700",
    Icon: AlertTriangle,
  },
  error: {
    container: "border-destructive/30 bg-destructive/5 text-destructive",
    icon: "text-destructive",
    Icon: XCircle,
  },
}

export function AccountAlert({ variant, title, description }: AccountAlertProps) {
  const { container, icon, Icon } = styles[variant]
  return (
    <div className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm ${container}`}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${icon}`} />
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{title}</span>
        <span className="opacity-80">{description}</span>
      </div>
    </div>
  )
}
