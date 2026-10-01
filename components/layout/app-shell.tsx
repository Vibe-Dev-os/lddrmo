"use client"

import type { ReactNode } from "react"
import { useApp } from "@/lib/app-context"
import { LoginScreen } from "@/components/layout/login-screen"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Topbar } from "@/components/layout/topbar"

export function AppShell({ children }: { children: ReactNode }) {
  const { role, loading } = useApp()

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (!role) return <LoginScreen />

  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarNav />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 bg-muted/30 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
