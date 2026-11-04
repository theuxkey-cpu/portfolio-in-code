/**
 * Everything the help-center prototype knows and says. The product names
 * (Rota, Rumo) are stand-ins, the values are samples, and Rumo's replies are
 * written by hand and played back; no model runs behind it.
 */

/** Label for the seal that goes on every figure. */
export const ILLUSTRATIVE = "Sample values"

/* ---------------------------------------------------------------- funnel */

/** Share of all tickets that come from the few flows the help covers first. */
export const COVERED_SHARE = 0.48
/** Share of the tickets in those flows that are "how do I" questions. */
export const HOW_TO_SHARE = 0.6
/** Share of those "how do I" questions the assistant resolves. */
export const RESOLUTION_RATE = 0.7
/** Tickets in a month before the help existed, as an index so no real volume shows. */
export const BASELINE_TICKETS = 1000

export interface FunnelInput {
  /** Share of all tickets that sit in the covered flows (0..1). */
  covered: number
  /** Share of those that are "how do I" questions (0..1). */
  howTo: number
  /** Share of those the assistant resolves (0..1). */
  resolved: number
}

export const DEFAULT_FUNNEL: FunnelInput = {
  covered: COVERED_SHARE,
  howTo: HOW_TO_SHARE,
  resolved: RESOLUTION_RATE,
}

/** Drop inside the covered flows: how-to share times resolution (0.60 x 0.70 = 0.42). */
export function coveredDrop(input: FunnelInput): number {
  return input.howTo * input.resolved
}

/** Drop in total volume: covered share times the drop inside them (0.48 x 0.42 = 0.2016). */
export function totalDrop(input: FunnelInput): number {
  return input.covered * coveredDrop(input)
}

/* ----------------------------------------------------------------- flows */

export type ModuleId = "quotes" | "orders" | "customers" | "stock" | "delivery"

export interface FlowModule {
  id: ModuleId
  name: string
}

export const MODULES: readonly FlowModule[] = [
  { id: "quotes", name: "Quotes" },
  { id: "orders", name: "Orders" },
  { id: "customers", name: "Customers" },
  { id: "stock", name: "Stock and pricing" },
  { id: "delivery", name: "Deliveries" },
]

export interface Flow {
  id: string
  moduleId: ModuleId
  name: string
  /** Share of the month's tickets, in tenths of a percent. The 50 sum to 1000. */
  weight: number
  /** True for the three flows the help covers first. */
  covered: boolean
}

const flow = (id: string, moduleId: ModuleId, name: string, weight: number, covered = false): Flow => ({
  id,
  moduleId,
  name,
  weight,
  covered,
})

/**
 * About fifty flows in five modules. The three covered ones hold 480 of 1000
 * (48%); the other 47 share the remaining 520.
 */
export const FLOWS: readonly Flow[] = [
  flow("q-complex", "quotes", "Build a quote with several lines", 210, true),
  flow("q-discount", "quotes", "Apply a discount and get it approved", 150, true),
  flow("q-copy", "quotes", "Copy a past quote", 20),
  flow("q-expire", "quotes", "Extend or close an expired quote", 14),
  flow("q-share", "quotes", "Send a quote to the customer", 14),
  flow("q-notes", "quotes", "Add notes and attachments", 8),
  flow("q-tax", "quotes", "Check taxes on a quote", 8),
  flow("q-split", "quotes", "Split a quote in two", 6),
  flow("q-merge", "quotes", "Merge two quotes", 6),
  flow("q-print", "quotes", "Print or export a quote", 8),

  flow("o-convert", "orders", "Turn a quote into an order", 120, true),
  flow("o-edit", "orders", "Change an order after it is placed", 20),
  flow("o-cancel", "orders", "Cancel an order", 14),
  flow("o-partial", "orders", "Ship an order in parts", 14),
  flow("o-status", "orders", "Read an order status", 8),
  flow("o-return", "orders", "Register a return", 8),
  flow("o-credit", "orders", "Issue a credit note", 8),
  flow("o-dup", "orders", "Repeat a past order", 6),
  flow("o-hold", "orders", "Put an order on hold", 6),
  flow("o-split", "orders", "Split an order by warehouse", 8),

  flow("c-new", "customers", "Register a new customer", 20),
  flow("c-credit", "customers", "Check a customer's credit", 20),
  flow("c-contact", "customers", "Add or change a contact", 14),
  flow("c-address", "customers", "Add a delivery address", 14),
  flow("c-terms", "customers", "Set payment terms", 8),
  flow("c-merge", "customers", "Merge duplicate customers", 8),
  flow("c-history", "customers", "Read a customer's history", 8),
  flow("c-block", "customers", "Block or unblock a customer", 6),
  flow("c-tier", "customers", "Move a customer to another price tier", 6),
  flow("c-visit", "customers", "Log a field visit", 8),

  flow("s-price", "stock", "Look up a product price", 20),
  flow("s-avail", "stock", "Check stock across warehouses", 20),
  flow("s-reserve", "stock", "Reserve stock for a quote", 14),
  flow("s-subst", "stock", "Offer a substitute product", 14),
  flow("s-promo", "stock", "Apply a promotion", 14),
  flow("s-list", "stock", "Read a price list", 8),
  flow("s-min", "stock", "Handle a minimum order", 8),
  flow("s-bundle", "stock", "Sell a product bundle", 8),
  flow("s-back", "stock", "Handle a backorder", 6),
  flow("s-unit", "stock", "Switch the unit of sale", 6),

  flow("d-schedule", "delivery", "Schedule a delivery", 20),
  flow("d-track", "delivery", "Track a delivery", 20),
  flow("d-window", "delivery", "Change a delivery window", 14),
  flow("d-fee", "delivery", "Explain a delivery fee", 14),
  flow("d-route", "delivery", "Read the day's route", 8),
  flow("d-proof", "delivery", "Find the proof of delivery", 8),
  flow("d-fail", "delivery", "Handle a failed delivery", 8),
  flow("d-pickup", "delivery", "Offer pickup at the counter", 6),
  flow("d-claim", "delivery", "Open a damage claim", 6),
  flow("d-address", "delivery", "Fix a wrong delivery address", 10),
]

/* ---------------------------------------------------------- knowledge base */

/** Where a reply comes from. Every answer Rumo gives names one of these. */
export interface KnowledgeArticle {
  id: string
  flowId: string
  /** Name shown as the source under the reply. */
  source: string
  /** The reply, in the voice of the guide: plain words, no internal jargon. */
  answer: string
  /** Detail that changes with the customer or the day; the reply tells Dani to confirm it on the screen. */
  checkOnScreen?: string
}

export const KNOWLEDGE: readonly KnowledgeArticle[] = [
  {
    id: "add-lines",
    flowId: "q-complex",
    source: "Guide · Build a quote with several lines",
    answer:
      "Open the quote, choose Add product, search by name or code, set the quantity and press Add. Repeat for each line. The total updates as you go, and nothing is saved to the customer until you press Send.",
  },
  {
    id: "discount",
    flowId: "q-discount",
    source: "Guide · Apply a discount and get it approved",
    answer:
      "Type the discount in the Discount field. A discount above your limit turns the field amber and the quote needs approval before the customer sees it.",
    checkOnScreen: "Your limit depends on your role. Check the number next to the field on your screen.",
  },
  {
    id: "convert",
    flowId: "o-convert",
    source: "Guide · Turn a quote into an order",
    answer:
      "Open an approved quote and press Make order. Rota asks you to confirm the delivery address and the payment terms, then creates the order and keeps the quote as a record.",
  },
]

export interface ChatQuestion {
  id: string
  /** The question as it appears on the button. */
  text: string
  /** "answer" when the knowledge base covers it; "decline" when it does not. */
  kind: "answer" | "decline"
  /** What Rumo looked in, shown while it searches. */
  looked: string
  /** For an answer: the article it comes from. */
  articleId?: string
  /** For a decline: why Rumo will not guess, and where to look instead. */
  declineReason?: string
}

export const CHAT_QUESTIONS: readonly ChatQuestion[] = [
  {
    id: "q-lines",
    text: "How do I add several products to a quote?",
    kind: "answer",
    looked: "the Quotes guides",
    articleId: "add-lines",
  },
  {
    id: "q-disc",
    text: "Why is my discount asking for approval?",
    kind: "answer",
    looked: "the Quotes guides",
    articleId: "discount",
  },
  {
    id: "q-conv",
    text: "How do I turn this quote into an order?",
    kind: "answer",
    looked: "the Orders guides",
    articleId: "convert",
  },
  {
    id: "q-limit",
    text: "What is the exact discount limit for my customer?",
    kind: "decline",
    looked: "the Quotes and Customers guides",
    declineReason:
      "That number depends on your role and the customer's tier, and it changes, so no guide holds it. Check it next to the Discount field on your screen.",
  },
  {
    id: "q-tax",
    text: "Which tax rate applies to this order?",
    kind: "decline",
    looked: "the Orders and Stock guides",
    declineReason: "Tax rules are not part of what I was given. Check the tax line on the quote, or ask the finance team.",
  },
]

/** The reply Rumo types: the guide's answer, or a refusal that says why and where to look. */
export function replyText(question: ChatQuestion): string {
  if (question.kind === "decline") return `I can't answer that, and I won't guess. ${question.declineReason ?? ""}`.trim()
  return KNOWLEDGE.find((a) => a.id === question.articleId)?.answer ?? ""
}

/** What happens when Dani asks for a person. */
export const ESCALATION_NOTE =
  "Sent to the support team with your question and the guides I checked, so you do not have to explain it again."

/* --------------------------------------------------------------- the quote */

export interface QuoteLine {
  id: string
  product: string
  code: string
  qty: number
  /** Unit price in dollars. */
  price: number
}

export const QUOTE_CUSTOMER = "Alder Garage"

export const QUOTE_LINES: readonly QuoteLine[] = [
  { id: "l1", product: "Brake pad set, front", code: "BP-2210", qty: 4, price: 38.5 },
  { id: "l2", product: "Oil filter", code: "OF-0417", qty: 12, price: 6.2 },
  { id: "l3", product: "Wiper blade, 55 cm", code: "WB-5500", qty: 10, price: 9.75 },
]

/** The line "Add product" puts on the quote. */
export const QUOTE_EXTRA_LINE: QuoteLine = { id: "l4", product: "Spark plug set, 4 pcs", code: "SP-0840", qty: 2, price: 14.9 }

/** A seller's discount limit, in percent. Above it the quote needs approval. */
export const DISCOUNT_LIMIT = 10

export interface TourStep {
  id: string
  /** What the tour points at on the quote screen. */
  target: "add-product" | "quantity" | "discount" | "send"
  title: string
  body: string
}

export const TOUR_STEPS: readonly TourStep[] = [
  { id: "t1", target: "add-product", title: "Start here", body: "Add each product with Add product. Search by name or code." },
  { id: "t2", target: "quantity", title: "Set the quantity", body: "Change the quantity on the line. The total follows." },
  { id: "t3", target: "discount", title: "Discounts need a limit check", body: "Above your limit the field turns amber and the quote needs approval." },
  { id: "t4", target: "send", title: "Send when it is ready", body: "Nothing reaches the customer until you press Send." },
]

