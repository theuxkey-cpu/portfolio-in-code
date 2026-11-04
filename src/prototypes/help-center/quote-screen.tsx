"use client"

import { useId } from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/design-system/ui/button"
import { QUOTE_CUSTOMER, DISCOUNT_LIMIT, TOUR_STEPS, type TourStep } from "./data"
import type { QuoteScreenState } from "./use-quote-screen"

const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" })

const TARGET_RING = "ring-2 ring-primary ring-offset-2 ring-offset-card"

function Hint({ children }: { children: string }) {
  return <p className="mt-1 text-[11px] leading-snug text-foreground/70">{children}</p>
}

/**
 * The quote screen of Rota, with the help off or on. Off, it is the bare
 * screen: a terse "Approval required" and nothing else. On, hints sit where
 * the question starts, and a four-step tour walks through the first quote.
 */
export function QuoteScreen({ quote }: { quote: QuoteScreenState }) {
  const discountId = useId()
  const step: TourStep | null = quote.help && quote.tour !== null ? TOUR_STEPS[quote.tour] : null
  const ring = (target: TourStep["target"]) => (step?.target === target ? TARGET_RING : "")

  return (
    <section aria-label="Quote screen" className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-4 py-2.5">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-foreground/70">Quote for</p>
          <p className="text-sm font-medium">{QUOTE_CUSTOMER}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div role="group" aria-label="Help mode" className="flex gap-1">
            <button
              type="button"
              aria-pressed={!quote.help}
              onClick={() => quote.setHelp(false)}
              className={cn(buttonVariants({ variant: quote.help ? "outline" : "default", size: "sm" }), "min-h-11 @2xl:min-h-7")}
            >
              Without help
            </button>
            <button
              type="button"
              aria-pressed={quote.help}
              onClick={() => quote.setHelp(true)}
              className={cn(buttonVariants({ variant: quote.help ? "default" : "outline", size: "sm" }), "min-h-11 @2xl:min-h-7")}
            >
              With help
            </button>
          </div>
          {quote.help && step === null ? (
            <Button variant="secondary" size="sm" className="min-h-11 @2xl:min-h-7" onClick={quote.startTour}>
              Start the tour
            </Button>
          ) : null}
        </div>
      </div>

      {step ? (
        <div
          role="group"
          aria-label={`Tour, step ${(quote.tour ?? 0) + 1} of ${TOUR_STEPS.length}`}
          onKeyDown={(e) => {
            if (e.key === "Escape") quote.endTour()
          }}
          className="mx-4 mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border border-[var(--badge-warm-border)] bg-[var(--badge-warm-bg)] px-3 py-2"
        >
          <div aria-live="polite" className="min-w-0 text-[13px] leading-snug">
            <p className="text-[11px] font-medium text-[var(--accent-dim)]">
              Step {(quote.tour ?? 0) + 1} of {TOUR_STEPS.length}
            </p>
            <p>
              <span className="font-medium">{step.title}. </span>
              {step.body}
            </p>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="min-h-11 @2xl:min-h-7" onClick={quote.endTour}>
              Skip
            </Button>
            <Button variant="outline" size="sm" className="min-h-11 @2xl:min-h-7" disabled={quote.tour === 0} onClick={quote.backTour}>
              Back
            </Button>
            <Button size="sm" className="min-h-11 @2xl:min-h-7" autoFocus onClick={quote.nextTour}>
              {quote.tour === TOUR_STEPS.length - 1 ? "Done" : "Next"}
            </Button>
          </div>
        </div>
      ) : null}

      <div className="px-4 py-3">
        <table className="w-full text-sm">
          <caption className="sr-only">Lines of the quote</caption>
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.06em] text-foreground/70">
              <th scope="col" className="pb-1 font-medium">Product</th>
              <th scope="col" className="pb-1 text-center font-medium">Qty</th>
              <th scope="col" className="hidden pb-1 text-right font-medium @lg:table-cell">Price</th>
              <th scope="col" className="pb-1 text-right font-medium">Line total</th>
            </tr>
          </thead>
          <tbody>
            {quote.lines.map((line, index) => (
              <tr key={line.id} className="border-t border-border">
                <td className="py-1 pr-2">
                  {line.product}
                  <span className="ml-2 hidden font-mono text-[11px] text-foreground/70 @lg:inline">{line.code}</span>
                </td>
                <td className="py-1">
                  <div className={cn("mx-auto flex w-fit items-center gap-1 rounded-md", index === 0 ? ring("quantity") : "")}>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="size-11 @2xl:size-6"
                      aria-label={`Fewer ${line.product}`}
                      disabled={line.qty <= 1}
                      onClick={() => quote.setQty(line.id, line.qty - 1)}
                    >
                      <MinusIcon aria-hidden />
                    </Button>
                    <span className="w-7 text-center tabular-nums" aria-label={`${line.qty} of ${line.product}`}>
                      {line.qty}
                    </span>
                    <Button
                      variant="outline"
                      size="icon-xs"
                      className="size-11 @2xl:size-6"
                      aria-label={`More ${line.product}`}
                      onClick={() => quote.setQty(line.id, line.qty + 1)}
                    >
                      <PlusIcon aria-hidden />
                    </Button>
                  </div>
                </td>
                <td className="hidden py-1 text-right tabular-nums @lg:table-cell">{money(line.price)}</td>
                <td className="py-1 text-right tabular-nums">{money(line.price * line.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {quote.help ? <Hint>Change the quantity on a line. The total follows.</Hint> : null}

        <div className="mt-3 flex flex-wrap items-start justify-between gap-4 border-t border-border pt-3">
          <div className="flex flex-col gap-3">
            <div>
              <button
                type="button"
                disabled={quote.added}
                onClick={quote.addProduct}
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "min-h-11 gap-1.5 @2xl:min-h-7", ring("add-product"))}
              >
                <PlusIcon aria-hidden />
                {quote.added ? "Product added" : "Add product"}
              </button>
              {quote.help ? <Hint>Search by name or code, then set the quantity.</Hint> : null}
            </div>
            <div>
              <label htmlFor={discountId} className="text-[13px] font-medium">
                Discount (%)
              </label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  id={discountId}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={30}
                  value={quote.discount}
                  onChange={(e) => quote.setDiscount(Number(e.target.value))}
                  className={cn(
                    "h-11 w-20 rounded-md border bg-background px-2 text-sm tabular-nums @2xl:h-8",
                    quote.overLimit ? "border-warning-700" : "border-input",
                    ring("discount")
                  )}
                />
                <span className="text-[11px] text-foreground/70">Your limit: {DISCOUNT_LIMIT}%</span>
              </div>
              {quote.overLimit ? (
                <p role="status" className="mt-1 max-w-[22rem] rounded-md bg-warning-100 px-2 py-1 text-[12px] leading-snug text-warning-700">
                  {quote.help
                    ? `${quote.discount}% is above your ${DISCOUNT_LIMIT}% limit, so the quote needs approval before the customer sees it. Lower the discount to send it now.`
                    : "Approval required"}
                </p>
              ) : quote.help ? (
                <Hint>Above your limit the field turns amber and the quote needs approval.</Hint>
              ) : null}
            </div>
          </div>

          <div className="min-w-[14rem] text-right">
            <dl className="space-y-0.5 text-sm tabular-nums">
              <div className="flex justify-between gap-6 text-foreground/70">
                <dt>Subtotal</dt>
                <dd>{money(quote.subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-6 font-medium">
                <dt>Total</dt>
                <dd>{money(quote.total)}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={quote.send}
              className={cn(buttonVariants({ size: "sm" }), "mt-2 min-h-11 w-full @2xl:min-h-7", ring("send"))}
            >
              {quote.overLimit ? "Send for approval" : "Send quote"}
            </button>
            {quote.help ? <Hint>Nothing reaches the customer until you press Send.</Hint> : null}
            <p role="status" className="mt-1 min-h-4 text-[12px] font-medium">
              {quote.sent === "sent" ? `Sent to ${QUOTE_CUSTOMER}.` : quote.sent === "approval" ? "Sent to your manager for approval." : ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
