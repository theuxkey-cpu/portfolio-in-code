"use client"

import * as React from "react"
import type { RowData, Table } from "@tanstack/react-table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react"

import { Button } from "@/components/design-system/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/design-system/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/design-system/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/design-system/ui/select"

// Readable label for the column-visibility toggle (DataTableColumnToggle) —
// can't be derived from `columnDef.header` because most real columns use
// DataTableColumnHeader (JSX, not a string) there. Explicit per column.
// (`role`/`emphasis`, the table→cards layout hint, live in
// @/components/case/data-table-card-meta — that's a case-prototype concept,
// not part of this generic footer.)
declare module "@tanstack/table-core" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
  }
}

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50]

function getPageWindow(currentPage: number, pageCount: number, size = 3) {
  if (pageCount <= size) {
    return Array.from({ length: pageCount }, (_, index) => index)
  }
  const start = Math.min(
    Math.max(0, currentPage - Math.floor(size / 2)),
    pageCount - size
  )
  return Array.from({ length: size }, (_, index) => start + index)
}

function DataTablePageSize<TData>({
  table,
  options = PAGE_SIZE_OPTIONS,
}: {
  table: Table<TData>
  options?: readonly number[]
}) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <span>Show</span>
      <Select
        value={`${table.getState().pagination.pageSize}`}
        onValueChange={(value) => table.setPageSize(Number(value))}
      >
        <SelectTrigger aria-label="Rows per page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start">
          {options.map((pageSize) => (
            <SelectItem key={pageSize} value={`${pageSize}`}>
              {pageSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function DataTableColumnToggle<TData>({ table }: { table: Table<TData> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          Columns
          <ChevronUpIcon data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => column.toggleVisibility(checked)}
              onSelect={(event) => event.preventDefault()}
            >
              {column.columnDef.meta?.label ?? column.id}
            </DropdownMenuCheckboxItem>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Reuses pagination.tsx's structural atoms (nav + list), but not
// PaginationLink/Previous/Next: those render an <a> meant for real
// href-based navigation. Here pagination is client-side (table.setPageIndex),
// no URL change — an <a> without href isn't focusable or exposed as a link
// to screen readers, so the clickable control stays a Button.
function DataTablePagination<TData>({ table }: { table: Table<TData> }) {
  const pageCount = table.getPageCount()
  const currentPage = table.getState().pagination.pageIndex
  const pageWindow = getPageWindow(currentPage, pageCount)

  return (
    <Pagination className="mx-0 w-fit justify-end">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="ghost"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeftIcon data-icon="inline-start" />
            Previous
          </Button>
        </PaginationItem>
        {pageWindow[0] > 0 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        {pageWindow.map((pageIndex) => (
          <PaginationItem key={pageIndex}>
            <Button
              variant={pageIndex === currentPage ? "outline" : "ghost"}
              size="icon"
              aria-current={pageIndex === currentPage ? "page" : undefined}
              onClick={() => table.setPageIndex(pageIndex)}
            >
              {pageIndex + 1}
            </Button>
          </PaginationItem>
        ))}
        {pageWindow[pageWindow.length - 1] < pageCount - 1 ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        <PaginationItem>
          <Button
            variant="ghost"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
            <ChevronRightIcon data-icon="inline-end" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function DataTableFooter<TData>({ table }: { table: Table<TData> }) {
  const { pageIndex } = table.getState().pagination
  const pageCount = table.getPageCount()

  return (
    <div
      data-slot="data-table-footer"
      className="flex items-center justify-between gap-2"
    >
      <div className="flex items-center gap-4">
        <DataTableColumnToggle table={table} />
        <DataTablePageSize table={table} />
        <span className="text-sm text-muted-foreground">
          {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
        </span>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

export {
  DataTableFooter,
  DataTablePageSize,
  DataTableColumnToggle,
  DataTablePagination,
}
