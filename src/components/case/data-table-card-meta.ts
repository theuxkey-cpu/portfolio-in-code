import type { RowData } from "@tanstack/react-table"

// Shared by any case prototype that draws one TanStack table as both a table
// and a card list (e.g. prototypes/treadline/orders-views.tsx). `role` says
// where a column goes in the card layout: `title` (heading), `badge` (status
// chip beside the title), `meta` (secondary line) or `hidden` (table only).
// Ignored by the table itself. `meta` columns flagged `emphasis` are shown
// first and stronger.
declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    role?: "title" | "badge" | "meta" | "hidden"
    emphasis?: boolean
  }
}

export {}
