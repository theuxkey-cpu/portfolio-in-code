"use client"

import { useCallback, useMemo, useState } from "react"

import { DISCOUNT_LIMIT, QUOTE_EXTRA_LINE, QUOTE_LINES, TOUR_STEPS, type QuoteLine } from "./data"

export type SendState = "idle" | "sent" | "approval"

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

/**
 * State of the quote screen. `help` switches the in-screen help on; the tour
 * only runs with help on. Any change to the quote clears the "sent" message.
 */
export function useQuoteScreen() {
  const [help, setHelpState] = useState(false)
  const [qty, setQtyState] = useState<Record<string, number>>({})
  const [added, setAdded] = useState(false)
  const [discount, setDiscountState] = useState(0)
  const [tour, setTour] = useState<number | null>(null)
  const [sent, setSent] = useState<SendState>("idle")

  const lines: readonly QuoteLine[] = useMemo(
    () =>
      [...QUOTE_LINES, ...(added ? [QUOTE_EXTRA_LINE] : [])].map((line) => ({ ...line, qty: qty[line.id] ?? line.qty })),
    [added, qty]
  )
  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.price, 0)
  const total = subtotal * (1 - discount / 100)
  const overLimit = discount > DISCOUNT_LIMIT

  const setHelp = useCallback((on: boolean) => {
    setHelpState(on)
    if (!on) setTour(null)
  }, [])
  const setQty = useCallback((id: string, value: number) => {
    setQtyState((all) => ({ ...all, [id]: clamp(value, 1, 99) }))
    setSent("idle")
  }, [])
  const addProduct = useCallback(() => {
    setAdded(true)
    setSent("idle")
  }, [])
  const setDiscount = useCallback((value: number) => {
    setDiscountState(clamp(Number.isFinite(value) ? value : 0, 0, 30))
    setSent("idle")
  }, [])
  const send = useCallback(() => setSent(overLimit ? "approval" : "sent"), [overLimit])

  const startTour = useCallback(() => setTour(0), [])
  const endTour = useCallback(() => setTour(null), [])
  const nextTour = useCallback(() => setTour((s) => (s === null ? s : s + 1 >= TOUR_STEPS.length ? null : s + 1)), [])
  const backTour = useCallback(() => setTour((s) => (s === null ? s : Math.max(0, s - 1))), [])

  const reset = useCallback(() => {
    setHelpState(false)
    setQtyState({})
    setAdded(false)
    setDiscountState(0)
    setTour(null)
    setSent("idle")
  }, [])

  return {
    help,
    lines,
    added,
    discount,
    subtotal,
    total,
    overLimit,
    tour,
    sent,
    setHelp,
    setQty,
    addProduct,
    setDiscount,
    send,
    startTour,
    endTour,
    nextTour,
    backTour,
    reset,
  }
}

export type QuoteScreenState = ReturnType<typeof useQuoteScreen>
