"use client"

import type { ReactNode } from "react"

import { SidebarNavigation, SidebarNavigationItem, SidebarNavigationMenu } from "@/components/design-system/patterns/sidebar-navigation"
import { PageHeader } from "@/components/design-system/patterns/page-header"
import { Alert, AlertDescription, AlertTitle } from "@/components/design-system/ui/alert"
import { Button } from "@/components/design-system/ui/button"
import { Chip } from "@/components/design-system/ui/chip"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/design-system/ui/dialog"
import { Progress } from "@/components/design-system/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/design-system/ui/select"
import { Stat } from "@/components/design-system/ui/stat"
import { Stepper } from "@/components/design-system/ui/stepper"
import { SummaryList } from "@/components/design-system/ui/summary-list"
import { StatusBadge } from "@/components/design-system/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/design-system/ui/tabs"
import { Input } from "@/components/ui/input"
import { HomeIcon, LayersIcon, MinusIcon, PlusIcon } from "lucide-react"

/**
 * Live previews for the catalog items that exist in this portfolio's design
 * system, rendered with the real components and nothing else wired to them.
 * An item without an entry here shows a note instead of a preview.
 */
export const PREVIEWS: Readonly<Record<string, () => ReactNode>> = {
  alert: () => (
    <Alert tone="info" className="max-w-sm">
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>A short message about something that needs attention.</AlertDescription>
    </Alert>
  ),
  button: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button>Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
  chip: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip tone="neutral">Neutral</Chip>
      <Chip tone="info">Info</Chip>
      <Chip tone="success">Success</Chip>
      <Chip tone="warning">Warning</Chip>
      <Chip tone="error">Error</Chip>
    </div>
  ),
  dialog: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open dialog</Button>
      </DialogTrigger>
      <DialogContent data-preview="">
        <DialogHeader>
          <DialogTitle>Dialog title</DialogTitle>
          <DialogDescription>A short description of what this dialog asks for.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  input: () => <Input aria-label="Example input" placeholder="Type something" className="max-w-xs" />,
  select: () => (
    <Select>
      <SelectTrigger aria-label="Example select" className="w-56">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="one">Option one</SelectItem>
        <SelectItem value="two">Option two</SelectItem>
        <SelectItem value="three">Option three</SelectItem>
      </SelectContent>
    </Select>
  ),
  stat: () => <Stat label="Label" value="42 ready" caption="Supporting caption" />,
  "status-badge": () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge tone="success">success</StatusBadge>
      <StatusBadge tone="warning">warning</StatusBadge>
      <StatusBadge tone="error">error</StatusBadge>
      <StatusBadge tone="info">info</StatusBadge>
      <StatusBadge tone="neutral">neutral</StatusBadge>
    </div>
  ),
  tabs: () => (
    <Tabs defaultValue="one">
      <TabsList aria-label="Example tabs">
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger value="two">Two</TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one" className="text-sm text-muted-foreground">Content of the first tab</TabsContent>
      <TabsContent value="two" className="text-sm text-muted-foreground">Content of the second tab</TabsContent>
      <TabsContent value="three" className="text-sm text-muted-foreground">Content of the third tab</TabsContent>
    </Tabs>
  ),
  progress: () => <Progress value={60} aria-label="Example progress" className="max-w-xs" />,
  // inert: PageHeader renders a real <h1>, which would break this page's heading order.
  "page-header": () => (
    <div inert className="w-full">
      <PageHeader
        title="Page title"
        description="Supporting text under the title"
        action={<Button size="sm">Action</Button>}
        className="rounded-lg border border-border bg-card"
      />
    </div>
  ),
  "sidebar-navigation": () => (
    <SidebarNavigation aria-label="Example navigation" className="h-32 w-48 rounded-lg border">
      <SidebarNavigationMenu>
        <SidebarNavigationItem active icon={<HomeIcon aria-hidden />} label="Home" />
        <SidebarNavigationItem icon={<LayersIcon aria-hidden />} label="Patterns" />
      </SidebarNavigationMenu>
    </SidebarNavigation>
  ),
  // Module components below: simplified compositions of the atoms, with neutral content.
  "approver-chain": () => (
    <div className="flex w-full max-w-md flex-col gap-3">
      <Stepper
        nodes={[
          { status: "done", label: "Requester", caption: "Submitted" },
          { status: "current", label: "Approver 1", caption: "In review" },
          { status: "pending", label: "Approver 2" },
        ]}
      />
      <div>
        <StatusBadge tone="warning">Waiting for approver 1</StatusBadge>
      </div>
    </div>
  ),
  "quantity-field": () => (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" aria-label="Decrease quantity">
        <MinusIcon />
      </Button>
      <Input aria-label="Quantity" defaultValue="12" inputMode="numeric" className="w-20 text-center" />
      <Button variant="outline" size="icon" aria-label="Increase quantity">
        <PlusIcon />
      </Button>
    </div>
  ),
  "opportunity-details": () => (
    <SummaryList
      divided
      className="w-full max-w-sm"
      items={[
        { label: "Customer", value: "Example Co." },
        { label: "Items", value: "3" },
        { label: "Total", value: "$ 1,200.00", emphasis: true },
      ]}
    />
  ),
}
