"use client"

import * as React from "react"

import { QuantityField } from "@/components/design-system/modules/quantity-field"
import { Alert, AlertDescription, AlertTitle } from "@/components/design-system/ui/alert"
import { Button } from "@/components/design-system/ui/button"
import { Chip } from "@/components/design-system/ui/chip"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/design-system/ui/dialog"
import { Progress } from "@/components/design-system/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/design-system/ui/table"
import { Typography } from "@/components/design-system/ui/typography"

export interface BranchOption {
  id: string
  name: string
  /** The most that can be assigned to this branch. */
  max: number
}

export interface BranchBySkuDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sku: string
  /** How many units the item needs in total. */
  needed: number
  branches: readonly BranchOption[]
  /** Quantities already assigned, by branch id. */
  current?: Readonly<Record<string, number>>
  onConfirm: (allocation: Record<string, number>) => void
  /** Extra props for the dialog content, which is portaled out of the page. */
  contentProps?: Omit<React.ComponentProps<typeof DialogContent>, "size" | "children"> & Record<`data-${string}`, string>
}

/**
 * Redistributes the quantity of one SKU among its eligible branches. Confirm
 * only enables when the total assigned is exactly what the item needs.
 */
export function BranchBySkuDialog({
  open,
  onOpenChange,
  sku,
  needed,
  branches,
  current = {},
  onConfirm,
  contentProps,
}: BranchBySkuDialogProps) {
  const [quantities, setQuantities] = React.useState<Record<string, number>>(() =>
    Object.fromEntries(branches.map((branch) => [branch.id, current[branch.id] ?? 0]))
  )

  function handleOpenChange(next: boolean) {
    onOpenChange(next)
    if (!next) setQuantities(Object.fromEntries(branches.map((branch) => [branch.id, current[branch.id] ?? 0])))
  }

  const total = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0)
  const closed = total === needed
  const exceeded = total > needed
  const reachableTotal = branches.reduce((sum, branch) => sum + branch.max, 0)
  const cannotClose = reachableTotal < needed

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent size="lg" {...contentProps}>
        <DialogHeader>
          <DialogTitle>Branch definition — SKU {sku}</DialogTitle>
          <DialogClose />
        </DialogHeader>
        <DialogDescription>Redistribute this item&apos;s quantity among the eligible branches.</DialogDescription>

        <div className="flex flex-col gap-2 rounded-xl bg-muted p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <Typography variant="small" className="text-secondary-foreground">
                Allocated
              </Typography>
              <Typography variant="body" weight="medium">
                {total} units
              </Typography>
              <Typography variant="small" className="text-secondary-foreground">
                of {needed} units
              </Typography>
            </div>
            {closed ? (
              <Chip tone="success" emphasis="subtle">
                Fully allocated
              </Chip>
            ) : exceeded ? (
              <Chip tone="error" emphasis="subtle">
                Balance exceeded
              </Chip>
            ) : null}
          </div>
          <Progress aria-label="Allocated" value={needed > 0 ? Math.min((total / needed) * 100, 100) : 0} />
        </div>

        {cannotClose ? (
          <Alert tone="warning">
            <AlertTitle>Part of this item is out of your reach</AlertTitle>
            <AlertDescription>
              The most you can assign across the visible branches is {reachableTotal} units, below the {needed} units
              needed. The difference is already allocated outside what you can edit, so &ldquo;Confirm&rdquo; may stay
              disabled.
            </AlertDescription>
          </Alert>
        ) : null}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {branches.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell>{branch.name}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <QuantityField
                      aria-label={`Quantity at ${branch.name}`}
                      value={quantities[branch.id] ?? 0}
                      max={branch.max}
                      onChange={(value) => setQuantities((previous) => ({ ...previous, [branch.id]: value }))}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={!closed} onClick={() => onConfirm(quantities)}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
