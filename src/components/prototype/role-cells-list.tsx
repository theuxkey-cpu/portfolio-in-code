"use client"

import { Fragment, type ReactNode } from "react"
import type { Row, Table } from "@tanstack/react-table"

import { DataTable } from "@/components/design-system/ui/data-table"

interface RoleCellsTableViewProps<TData> {
  table: Table<TData>
  empty: ReactNode
  footer?: ReactNode
}

/** Wide view shell shared by every case's table: the DataTable, an empty state when there are no rows, and an optional footer (page size, range text, pagination — each case's own). Rows come from `table.getRowModel()`, so the view can never drift from what the table itself renders. */
export function RoleCellsTableView<TData>({ table, empty, footer }: RoleCellsTableViewProps<TData>) {
  return (
    <div data-view="table">
      {table.getRowModel().rows.length ? <DataTable table={table} /> : empty}
      {footer}
    </div>
  )
}

interface RoleCellsCardListProps<TData> {
  table: Table<TData>
  renderCard: (row: Row<TData>) => ReactNode
  ariaLabel: string
  empty: ReactNode
  footer?: ReactNode
}

/** Narrow view shell shared by every case's card list, drawn from the same table instance as the wide view. Each case supplies its own card layout via `renderCard` (see role-cells.ts for the roleCells()/renderCell() mechanism cards use to stay in sync with the table's columns). */
export function RoleCellsCardList<TData>({ table, renderCard, ariaLabel, empty, footer }: RoleCellsCardListProps<TData>) {
  const rows = table.getRowModel().rows

  return (
    <div data-view="cards">
      {rows.length ? (
        <ul aria-label={ariaLabel} className="flex flex-col gap-2">
          {rows.map((row) => (
            <Fragment key={row.id}>{renderCard(row)}</Fragment>
          ))}
        </ul>
      ) : (
        empty
      )}
      {footer}
    </div>
  )
}
