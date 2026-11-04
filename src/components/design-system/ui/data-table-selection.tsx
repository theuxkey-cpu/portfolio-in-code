"use client"

import type { ColumnDef, Row, Table } from "@tanstack/react-table"

import { Checkbox } from "@/components/design-system/ui/checkbox"

function SelectAllCheckbox<TData>({ table }: { table: Table<TData> }) {
  const allSelected = table.getIsAllPageRowsSelected()
  const someSelected = table.getIsSomePageRowsSelected()

  return (
    <Checkbox
      checked={allSelected ? true : someSelected ? "indeterminate" : false}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all rows on this page"
    />
  )
}

// Factory: the consumer puts the column in its own `columns` array, no new
// prop on the engine. `getRowLabel` lets each row's checkbox carry a
// meaningful accessible name ("Select order TL-24831") instead of a generic one.
function createSelectionColumn<TData>({
  getRowLabel,
}: {
  getRowLabel?: (row: Row<TData>) => string
} = {}): ColumnDef<TData> {
  return {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => <SelectAllCheckbox table={table} />,
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={getRowLabel ? getRowLabel(row) : "Select row"}
      />
    ),
  }
}

export { createSelectionColumn }
