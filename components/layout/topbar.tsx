"use client"

import { useState } from "react"
import { Bell, HardHat, LogOut, Menu, ShieldCheck, Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { GlobalFilterBar } from "@/components/layout/global-filter-bar"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { IncidentTypeBadge } from "@/components/shared/incident-type-badge"
import { useApp } from "@/lib/app-context"
import { formatDateTime } from "@/lib/format"
import { BARANGAYS } from "@/lib/mock-data"
import type { Role } from "@/lib/types"

const ROLE_ICONS: Record<Role, typeof ShieldCheck> = { admin: ShieldCheck, encoder: HardHat, viewer: Users }
const ROLE_LABELS: Record<Role, string> = { admin: "MDRRMO Admin", encoder: "Field Encoder / Responder", viewer: "Viewer / Analyst" }

export function Topbar() {
  const { role, currentUserName, login, logout, incidents } = useApp()
  const [mobileOpen, setMobileOpen] = useState(false)

  const ongoing = incidents.filter((i) => i.status === "ongoing").slice(0, 5)
  const RoleIcon = role ? ROLE_ICONS[role] : ShieldCheck

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
        <Menu />
        <span className="sr-only">Open navigation</span>
      </Button>

      <div className="min-w-0 flex-1 overflow-x-auto">
        <GlobalFilterBar />
      </div>

      <Popover>
        <PopoverTrigger render={<Button variant="ghost" size="icon" className="relative shrink-0" />}>
          <Bell />
          {ongoing.length > 0 && (
            <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-destructive" />
          )}
          <span className="sr-only">Notifications</span>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold">Active Incident Alerts</p>
            <p className="text-xs text-muted-foreground">{ongoing.length} incident(s) currently ongoing</p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {ongoing.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-muted-foreground">No active alerts right now.</p>
            ) : (
              ongoing.map((inc) => {
                const barangay = BARANGAYS.find((b) => b.id === inc.barangayId)
                return (
                  <div key={inc.id} className="flex flex-col gap-1.5 border-b border-border px-4 py-3 last:border-0">
                    <div className="flex items-center justify-between gap-2">
                      <IncidentTypeBadge type={inc.type} />
                      <span className="text-[11px] text-muted-foreground">{formatDateTime(inc.dateTime)}</span>
                    </div>
                    <p className="text-xs text-foreground">{barangay?.name ?? "Unknown"} — {inc.description.slice(0, 60)}...</p>
                  </div>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 pl-1.5 pr-2.5" />}>
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary text-[11px] text-primary-foreground">
              {currentUserName
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline">{currentUserName}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 font-normal text-muted-foreground">
              <RoleIcon className="size-3.5" />
              {role ? ROLE_LABELS[role] : ""}
            </DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Switch role (demo)
            </DropdownMenuLabel>
            {(["admin", "encoder", "viewer"] as Role[]).map((r) => {
              const Icon = ROLE_ICONS[r]
              return (
                <DropdownMenuItem key={r} onClick={() => login(r)} disabled={r === role}>
                  <Icon data-icon="inline-start" />
                  {ROLE_LABELS[r]}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={logout} variant="destructive">
              <LogOut data-icon="inline-start" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
