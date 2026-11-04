"use client"

import * as React from "react"
import Image from "next/image"
import { LogOutIcon, PanelLeftCloseIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/design-system/ui/button"
import { Typography } from "@/components/design-system/ui/typography"

function SidebarNavigation({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="sidebar-navigation"
      aria-label="Main navigation"
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        className
      )}
      {...props}
    />
  )
}

function SidebarNavigationHeader({
  onCollapse,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { onCollapse?: () => void }) {
  return (
    <div
      data-slot="sidebar-navigation-header"
      className={cn(
        "flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border px-4",
        className
      )}
      {...props}
    >
      {children}
      {onCollapse ? (
        <Button variant="ghost" size="icon" aria-label="Collapse menu" onClick={onCollapse}>
          <PanelLeftCloseIcon />
        </Button>
      ) : null}
    </div>
  )
}

// src/alt are overridable (with this default) — a cross-product pattern
// can't hardcode one specific brand without an escape hatch. Default mark
// is a generic placeholder, not tied to any real product.
function SidebarNavigationBrand({
  src = "/design-system-mark.svg",
  alt = "Product",
  className,
  ...props
}: Omit<React.ComponentProps<typeof Image>, "src" | "alt" | "width" | "height"> & {
  src?: string
  alt?: string
}) {
  return (
    <Image
      src={src}
      alt={alt}
      priority
      width={99}
      height={36}
      className={cn("h-9 w-auto", className)}
      {...props}
    />
  )
}

function SidebarNavigationMenu({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-navigation-menu"
      className={cn("flex flex-1 flex-col gap-1 overflow-y-auto p-2", className)}
      {...props}
    />
  )
}

function SidebarNavigationItem({
  active,
  icon,
  label,
  className,
  ...props
}: {
  active?: boolean
  icon: React.ReactNode
  label: string
} & React.ComponentProps<"a">) {
  return (
    <a
      data-slot="sidebar-navigation-item"
      data-active={active ? "" : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground",
        className
      )}
      {...props}
    >
      <span className="shrink-0 [&_svg]:size-4">{icon}</span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
    </a>
  )
}

function SidebarNavigationFooter({
  userName,
  userDetail,
  onLogout,
  className,
  ...props
}: {
  userName: string
  userDetail: string
  onLogout?: () => void
} & Omit<React.ComponentProps<"div">, "onClick">) {
  return (
    <div
      data-slot="sidebar-navigation-footer"
      className={cn(
        "flex items-center justify-between gap-2 border-t border-sidebar-border p-4",
        className
      )}
      {...props}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-sidebar-foreground">{userName}</p>
        <Typography variant="caption" className="truncate text-muted-foreground">
          {userDetail}
        </Typography>
      </div>
      <Button variant="ghost" size="icon" aria-label="Log out" onClick={onLogout}>
        <LogOutIcon />
      </Button>
    </div>
  )
}

export {
  SidebarNavigation,
  SidebarNavigationHeader,
  SidebarNavigationBrand,
  SidebarNavigationMenu,
  SidebarNavigationItem,
  SidebarNavigationFooter,
}
