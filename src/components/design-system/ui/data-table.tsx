"use client"

import * as React from "react"
import {
  flexRender,
  type Column,
  type Table as TanstackTable,
} from "@tanstack/react-table"
import { ArrowDownIcon, ArrowDownUpIcon, ArrowUpIcon } from "lucide-react"

import "@/components/case/data-table-card-meta"
import { cn } from "@/lib/utils"
import { Button } from "@/components/design-system/ui/button"
import { EmptyState } from "@/components/design-system/ui/empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/design-system/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/design-system/ui/tooltip"

// The first data column ("title" role) holds long descriptive text, so it is the
// one exception to centered cells: left-aligned, cut with an ellipsis at a fixed
// width, and the full text is in a tooltip, shown only when it was actually cut.
// The 4 px padding (offset by a negative margin) keeps a focus ring drawn by an
// interactive child (Fleetline's request link) inside the clipped box.
function TruncatedCell({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const [open, setOpen] = React.useState(false)
  const [text, setText] = React.useState("")

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip
        open={open}
        onOpenChange={(next) => {
          const el = ref.current
          if (el) setText(el.textContent ?? "")
          setOpen(next && !!el && el.scrollWidth > el.clientWidth)
        }}
      >
        <TooltipTrigger asChild>
          <span ref={ref} data-slot="data-table-truncated" className="-m-1 block max-w-40 truncate p-1">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function DataTable<TData>({ table }: { table: TanstackTable<TData> }) {
  const columnCount = table.getAllLeafColumns().length

  return (
    <Table data-slot="data-table">
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                aria-sort={
                  !header.column.getCanSort()
                    ? undefined
                    : header.column.getIsSorted() === "asc"
                      ? "ascending"
                      : header.column.getIsSorted() === "desc"
                        ? "descending"
                        : "none"
                }
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              aria-selected={row.getIsSelected() ? true : undefined}
              data-state={row.getIsSelected() ? "selected" : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cell.column.columnDef.meta?.role === "title" ? "text-left" : undefined}
                >
                  {cell.column.columnDef.meta?.role === "title" ? (
                    <TruncatedCell>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TruncatedCell>
                  ) : (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columnCount} className="h-24">
              <EmptyState title="No results found." />
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: {
  column: Column<TData, TValue>
  title: string
  className?: string
}) {
  if (!column.getCanSort()) {
    return (
      <span
        data-slot="data-table-column-header"
        className={cn("text-sm font-medium text-muted-foreground", className)}
      >
        {title}
      </span>
    )
  }

  const sorted = column.getIsSorted()

  // The sort icon hangs off the label's right edge (absolute, overflow visible)
  // so the label alone is what centers in the column; a sibling icon would pull
  // the label left of the cell values beneath it.
  return (
    <Button
      asChild
      variant="ghost"
      className={cn("gap-1.5 overflow-visible px-2 text-muted-foreground", className)}
    >
      <button type="button" onClick={() => column.toggleSorting(sorted === "asc")}>
        <span className="relative">
          {title}
          {sorted === "asc" ? (
            <ArrowUpIcon className="absolute top-1/2 left-full ml-1.5 -translate-y-1/2" />
          ) : sorted === "desc" ? (
            <ArrowDownIcon className="absolute top-1/2 left-full ml-1.5 -translate-y-1/2" />
          ) : (
            <ArrowDownUpIcon className="absolute top-1/2 left-full ml-1.5 -translate-y-1/2 text-muted-foreground" />
          )}
        </span>
      </button>
    </Button>
  )
}

export { DataTable, DataTableColumnHeader }
