import type { SVGProps } from "react"

function TireIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}

export { TireIcon }
