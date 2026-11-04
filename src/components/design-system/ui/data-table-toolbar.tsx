"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import {
  CalendarIcon,
  DownloadIcon,
  ListFilterIcon,
  SearchIcon,
  UploadIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/design-system/ui/button"
import { Input } from "@/components/ui/input"
import { Typography } from "@/components/design-system/ui/typography"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/design-system/ui/dropdown-menu"

function DataTableToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="data-table-toolbar"
      className={cn("flex items-center justify-between gap-2", className)}
      {...props}
    />
  )
}

function DataTableTitleGroup({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div data-slot="data-table-title-group">
      <Typography as="h3" variant="small" weight="medium" className="text-foreground">
        {title}
      </Typography>
      {description ? (
        <Typography variant="caption" className="text-muted-foreground">
          {description}
        </Typography>
      ) : null}
    </div>
  )
}

function DataTableFilters({
  children,
  label = "Filters",
}: {
  children: React.ReactNode
  label?: string
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {label}
          <ListFilterIcon data-icon="inline-end" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">{children}</DropdownMenuContent>
    </DropdownMenu>
  )
}

function DataTableDateFilter(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" size="icon" aria-label="Filter by date" {...props}>
      <CalendarIcon />
    </Button>
  )
}

function DataTableImport(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" size="icon" aria-label="Import" {...props}>
      <UploadIcon />
    </Button>
  )
}

function DataTableExport(props: React.ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" size="icon" aria-label="Export" {...props}>
      <DownloadIcon />
    </Button>
  )
}

function DataTableSearch<TData>({
  table,
  placeholder = "Search",
  className,
}: {
  table: Table<TData>
  placeholder?: string
  className?: string
}) {
  return (
    <div className={cn("relative w-full max-w-sm", className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={(table.getState().globalFilter as string) ?? ""}
        onChange={(event) => table.setGlobalFilter(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="pl-8"
      />
    </div>
  )
}

export {
  DataTableToolbar,
  DataTableTitleGroup,
  DataTableFilters,
  DataTableDateFilter,
  DataTableImport,
  DataTableExport,
  DataTableSearch,
}
