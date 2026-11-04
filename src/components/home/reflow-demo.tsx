"use client"

import { useEffect, useId, useRef, useState } from "react"

/**
 * A small live demo of the technique I use for dense data on phones:
 * one list of rows, and the width of its container (not the screen) decides
 * whether it reads as a table or as cards. The slider resizes the container.
 * Plain HTML, CSS container queries and one range input: no libraries, and it
 * works with a keyboard.
 */

const ROWS = [
  { id: "TL-1042", status: "In transit", eta: "Today", qty: 24 },
  { id: "TL-1041", status: "Packed", eta: "Tomorrow", qty: 8 },
  { id: "TL-1038", status: "Delayed", eta: "Fri", qty: 16 },
  { id: "TL-1035", status: "Delivered", eta: "Mon", qty: 4 },
] as const

function statusClass(status: string) {
  return status === "Delayed"
    ? "border-[var(--badge-warm-border)] bg-[var(--badge-warm-bg)] text-[var(--accent-dim)]"
    : "border-[var(--tag-border)] bg-[var(--tag-bg)] text-foreground/75"
}

export function ReflowDemo() {
  const sliderId = useId()
  const frameRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLTableElement>(null)
  const [share, setShare] = useState(100)
  const [measure, setMeasure] = useState<{ width: number; layout: "table" | "cards" } | null>(null)

  // The layout is read from what the browser actually shows (the container
  // query decides it in CSS), so it stays right at any text size.
  useEffect(() => {
    const el = frameRef.current
    const table = tableRef.current
    if (!el || !table) return
    const observer = new ResizeObserver(([entry]) =>
      setMeasure({
        width: Math.round(entry.contentRect.width),
        layout: getComputedStyle(table).display === "none" ? "cards" : "table",
      })
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const layout = measure?.layout ?? null
  const width = measure?.width ?? null

  return (
    <figure className="flex w-full flex-col gap-3">
      <div className="rounded-xl border border-border bg-muted/30 p-2 md:p-4">
        <div
          ref={frameRef}
          // 200px is the narrowest the demo gets; the share moves it up to the full width of the box.
          style={{ width: `calc(200px + (100% - 200px) * ${share / 100})` }}
          className="@container mx-auto max-w-full overflow-hidden rounded-lg border border-border bg-card"
        >
          <table ref={tableRef} className="hidden w-full text-left text-[13px] @2xs:table">
            <caption className="sr-only">Orders, shown as a table</caption>
            <thead className="border-b border-border text-[11px] uppercase tracking-[0.06em] text-foreground/70">
              <tr>
                <th scope="col" className="whitespace-nowrap px-2.5 py-2 font-medium">Order</th>
                <th scope="col" className="whitespace-nowrap px-2.5 py-2 font-medium">Status</th>
                <th scope="col" className="whitespace-nowrap px-2.5 py-2 font-medium">Delivery</th>
                <th scope="col" className="whitespace-nowrap px-2.5 py-2 text-right font-medium">Qty</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-b-0">
                  <th scope="row" className="whitespace-nowrap px-2.5 py-2 font-medium">{row.id}</th>
                  <td className="whitespace-nowrap px-2.5 py-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-foreground/75">{row.eta}</td>
                  <td className="whitespace-nowrap px-2.5 py-2 text-right tabular-nums">{row.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="flex flex-col @2xs:hidden" aria-label="Orders, shown as cards">
            {ROWS.map((row) => (
              <li key={row.id} className="flex flex-col gap-1.5 border-b border-border px-3 py-3 last:border-b-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-medium">{row.id}</span>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClass(row.status)}`}>
                    {row.status}
                  </span>
                </div>
                <p className="text-[12px] text-foreground/75">
                  Delivery {row.eta} · Qty {row.qty}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <figcaption className="flex flex-col gap-2 text-[12px] text-foreground/70">
        <label htmlFor={sliderId} className="flex items-center gap-3">
          <span className="shrink-0 font-medium text-foreground">Resize the container</span>
          <input
            id={sliderId}
            type="range"
            min={0}
            max={100}
            step={1}
            value={share}
            onChange={(event) => setShare(Number(event.target.value))}
            aria-valuetext={layout ? `${width} pixels wide, shown as ${layout}` : undefined}
            className="h-11 min-w-0 flex-1 accent-[var(--accent-dim)] md:h-6"
          />
        </label>
        <span>
          {layout ? `${width}px wide → ${layout}.` : "Drag to change the width."} The container decides, not the screen:
          the same rows read as a table or as cards. Fictional data.
        </span>
      </figcaption>
    </figure>
  )
}
