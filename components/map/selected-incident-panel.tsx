"use client"

import Link from "next/link"
import { ArrowRight, MapPinned } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { IncidentTypeBadge } from "@/components/shared/incident-type-badge"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { useApp } from "@/lib/app-context"
import { formatDateTime } from "@/lib/format"
import type { Incident } from "@/lib/types"

export function SelectedIncidentPanel({ incident }: { incident: Incident | null }) {
  const { barangays, victims } = useApp()

  if (!incident) {
    return (
      <Card>
        <CardContent>
          <Empty className="border-0 py-6">
            <EmptyMedia variant="icon">
              <MapPinned />
            </EmptyMedia>
            <EmptyTitle>No incident selected</EmptyTitle>
            <EmptyDescription>Click a marker on the map to view incident details.</EmptyDescription>
          </Empty>
        </CardContent>
      </Card>
    )
  }

  const barangay = barangays.find((b) => b.id === incident.barangayId)
  const victimCount = victims.filter((v) => v.incidentId === incident.id).length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Selected Incident</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <IncidentTypeBadge type={incident.type} />
          <SeverityBadge severity={incident.severity} />
        </div>
        <div>
          <p className="font-semibold text-foreground">{incident.id}</p>
          <p className="text-sm text-muted-foreground">{barangay?.name ?? "Unknown"}</p>
          <p className="text-xs text-muted-foreground">{formatDateTime(incident.dateTime)}</p>
        </div>
        <p className="text-sm leading-relaxed text-foreground">{incident.description}</p>
        <div className="flex items-center justify-between">
          <StatusBadge status={incident.status} />
          <span className="text-xs text-muted-foreground">{victimCount} affected</span>
        </div>
        <Button size="sm" className="mt-1" render={<Link href={`/incidents/${incident.id}`} />}>
          View Full Report
          <ArrowRight data-icon="inline-end" />
        </Button>
      </CardContent>
    </Card>
  )
}
