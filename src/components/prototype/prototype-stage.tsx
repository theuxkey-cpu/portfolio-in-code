"use client"

import { useCallback, useEffect, useRef, type ReactNode } from "react"

import { cn } from "@/lib/utils"

import "./prototype-stage.css"

interface PrototypeStageProps {
  /**
   * Forces the table/cards switch to "table" or "cards" regardless of
   * container width; any other value (or omitting the prop) leaves the
   * switch width-driven. See prototype-stage.css.
   */
  layout?: string
  /** Simulated width in px, or "fit" for 100%. Omit for a stage that always fills the available width. */
  width?: number | "fit"
  onStageRef?: (el: HTMLDivElement | null) => void
  onScrollerRef?: (el: HTMLDivElement | null) => void
  /** Rendered inside the scrolling area. */
  children: ReactNode
  /** Rendered as a stage sibling, after the scroller — dialogs, a selection bar: anything that must not scroll with the content. */
  overlays?: ReactNode
}

/**
 * Shared stage for a prototype's own content: centers it, switches between a
 * table and a cards view by container width (see prototype-stage.css), and
 * gives a case an optional manual override (`layout`) and an optional
 * simulated width control — both opt-in, so a case with neither (e.g.
 * Rimstack) just gets a full-width, width-driven stage.
 */
export function PrototypeStage({ layout, width, onStageRef, onScrollerRef, children, overlays }: PrototypeStageProps) {
  const style = width === undefined ? undefined : { width: width === "fit" ? "100%" : `${width}px`, maxWidth: "100%" }
  const scroller = useRef<HTMLDivElement | null>(null)
  const setScroller = useCallback(
    (el: HTMLDivElement | null) => {
      scroller.current = el
      onScrollerRef?.(el)
    },
    [onScrollerRef]
  )

  // While the content overflows, the scrollbar sits in the right padding's place:
  // `data-scrollable` trims that padding to 8 px so the bar is 8 px from the
  // content instead of 16 + its own track.
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const update = () => {
      el.dataset.scrollable = el.scrollHeight > el.clientHeight ? "true" : "false"
    }
    update()
    const resize = new ResizeObserver(update)
    resize.observe(el)
    if (el.firstElementChild) resize.observe(el.firstElementChild)
    const mutation = new MutationObserver(update)
    mutation.observe(el, { childList: true, subtree: true })
    return () => {
      resize.disconnect()
      mutation.disconnect()
    }
  }, [])

  return (
    <div className="flex min-h-0 flex-1 justify-center bg-muted/30">
      <div
        ref={onStageRef}
        data-prototype-stage=""
        data-layout={layout}
        style={style}
        className={cn("relative flex min-h-0 flex-col bg-card", width === undefined && "w-full")}
      >
        <div ref={setScroller} className="min-h-0 flex-1 overflow-y-auto p-4 data-[scrollable=true]:pr-2">
          {children}
        </div>
        {overlays}
      </div>
    </div>
  )
}
