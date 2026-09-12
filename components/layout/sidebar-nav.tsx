"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ClipboardList, Map, Users, BarChart3, Settings, ShieldAlert } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/incidents", label: "Incident Reports", icon: ClipboardList },
  { href: "/map", label: "GIS Map", icon: Map },
  { href: "/victims", label: "Victims", icon: Users },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: true },
]

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const { role, currentUserName } = useApp()

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sidebar-accent ring-1 ring-white/10">
          <ShieldAlert className="size-5 text-sidebar-primary" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-tight">LDRRMO Midsalip</p>
          <p className="truncate text-[11px] text-sidebar-foreground/60">Incident Report System</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAV_ITEMS.filter((item) => !item.adminOnly || role === "admin").map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <p className="text-xs font-medium text-sidebar-foreground/90">{currentUserName}</p>
        <p className="text-[11px] text-sidebar-foreground/50">
          {role === "admin" ? "MDRRMO Admin" : role === "encoder" ? "Field Encoder / Responder" : "Viewer / Analyst"}
        </p>
      </div>
    </div>
  )
}
