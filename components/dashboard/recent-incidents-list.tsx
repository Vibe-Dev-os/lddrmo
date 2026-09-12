"use client"

import Link from "next/link"
import { ArrowRight, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { IncidentTypeBadge } from "@/components/shared/incident-type-badge"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { useApp } from "@/lib/app-context"
import { formatDateTime } from "@/lib/format"
import { BARANGAYS } from "@/lib/mock-data"

export function RecentIncidentsList() {
  const { filteredIncidents } = useApp()
  const recent = filteredIncidents.slice(0, 6)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Incident Reports</CardTitle>
        <CardDescription>Latest entries matching the current filters</CardDescription>
        <CardAction>
          <Button render={<Link href="/incidents" />} nativeButton={false} variant="ghost" size="sm">
            View all
            <ArrowRight data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <div className="px-4 pb-4">
        {recent.length === 0 ? (
          <Empty>
            <EmptyMedia variant="icon">
              <ClipboardList />
            </EmptyMedia>
            <EmptyTitle>No incidents found</EmptyTitle>
            <EmptyDescription>Try adjusting your filters or add a new incident report.</EmptyDescription>
          </Empty>
        ) : (
          <div className="flex flex-col gap-1">
            {recent.map((inc) => {
              const barangay = BARANGAYS.find((b) => b.id === inc.barangayId)
              return (
                <Link
                  key={inc.id}
                  href={`/incidents/${inc.id}`}
                  className="flex flex-col gap-2 rounded-lg px-2 py-2.5 transition-colors hover:bg-accent sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <IncidentTypeBadge type={inc.type} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {barangay?.name ?? "Unknown"} — {inc.id}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(inc.dateTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <SeverityBadge severity={inc.severity} />
                    <StatusBadge status={inc.status} />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </Card>
  )
}
