import { flexRender, type Cell, type Row } from "@tanstack/react-table"

import "@/components/case/data-table-card-meta"

export function renderCell<TData>(cell: Cell<TData, unknown>) {
  return flexRender(cell.column.columnDef.cell, cell.getContext())
}

/**
 * Buckets a row's visible cells by their column's `meta.role` (see
 * data-table-card-meta.ts) — the mechanism every case's card view uses to
 * lay out a table row as a card without keeping its own copy of the data.
 * `byId` is for the odd column that isn't in the role scheme (e.g. a select
 * checkbox or a remove button) and needs its own slot in the card.
 */
export function roleCells<TData>(row: Row<TData>) {
  const cells = row.getVisibleCells()
  const withRole = (role: string) => cells.filter((cell) => cell.column.columnDef.meta?.role === role)
  const meta = withRole("meta")

  return {
    title: withRole("title"),
    badge: withRole("badge"),
    emphasised: meta.filter((cell) => cell.column.columnDef.meta?.emphasis),
    secondary: meta.filter((cell) => !cell.column.columnDef.meta?.emphasis),
    byId: (id: string) => cells.find((cell) => cell.column.id === id),
  }
}
