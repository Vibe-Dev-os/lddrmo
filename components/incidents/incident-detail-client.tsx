"use client"

import Link from "next/link"
import { ArrowLeft, Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { AddVictimDialog } from "@/components/victims/add-victim-dialog"
import { IncidentTypeBadge } from "@/components/shared/incident-type-badge"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { VictimStatusBadge } from "@/components/shared/victim-status-badge"
import { DeleteIncidentDialog } from "@/components/incidents/delete-incident-dialog"
import { UpdateStatusDialog } from "@/components/incidents/update-status-dialog"
import { SingleMarkerMap } from "@/components/map/single-marker-map"
import { useApp } from "@/lib/app-context"
import { formatDateTime } from "@/lib/format"
import { SEVERITY_META } from "@/lib/mock-data"

export function IncidentDetailClient({ id }: { id: string }) {
  const { incidents, victims, barangays, role, deleteVictim } = useApp()
  const incident = incidents.find((i) => i.id === id)

  if (!incident) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-lg font-medium text-foreground">Incident not found</p>
        <p className="text-sm text-muted-foreground">This incident may have been deleted.</p>
        <Button render={<Link href="/incidents" />} nativeButton={false} variant="outline">
          Back to Incident Reports
        </Button>
      </div>
    )
  }

  const barangay = barangays.find((b) => b.id === incident.barangayId)
  const linkedVictims = victims.filter((v) => v.incidentId === incident.id)
  const canManage = role === "admin" || role === "encoder"
  const canDelete = role === "admin"
  const severityColor = SEVERITY_META[incident.severity].color

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          render={<Link href="/incidents" />}
          nativeButton={false}
          variant="ghost"
          size="sm"
          className="-ml-2 mb-2 text-muted-foreground"
        >
          <ArrowLeft data-icon="inline-start" />
          Back to Incident Reports
        </Button>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground sm:text-2xl">{incident.id}</h1>
              <StatusBadge status={incident.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {barangay?.name ?? "Unknown barangay"} — {formatDateTime(incident.dateTime)}
            </p>
          </div>
          {canManage && (
            <div className="flex flex-wrap items-center gap-2">
              <UpdateStatusDialog incident={incident} />
              {canDelete && <DeleteIncidentDialog incidentId={incident.id} />}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Incident Overview</CardTitle>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <IncidentTypeBadge type={incident.type} />
                <SeverityBadge severity={incident.severity} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground">{incident.description}</p>
              <Separator className="my-4" />
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-muted-foreground">Reported By</dt>
                  <dd className="font-medium text-foreground">{incident.createdBy}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Coordinates</dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Affected Individuals</dt>
                  <dd className="font-medium text-foreground">{linkedVictims.length}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Response Timeline</CardTitle>
              <CardDescription>Chronological log of status changes and response actions</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="flex flex-col gap-4">
                {incident.updates.map((u, idx) => (
                  <li key={u.id} className="relative flex gap-3 pl-1">
                    <div className="flex flex-col items-center">
                      <span
                        className="mt-1 size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: idx === incident.updates.length - 1 ? severityColor : "var(--muted-foreground)" }}
                      />
                      {idx < incident.updates.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-border" />}
                    </div>
                    <div className="min-w-0 flex-1 pb-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{u.note}</p>
                        <span className="text-xs text-muted-foreground">{formatDateTime(u.timestamp)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">by {u.author}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Geotagged Location</CardTitle>
            </CardHeader>
            <CardContent>
              <SingleMarkerMap lat={incident.lat} lng={incident.lng} color={severityColor} label={incident.id} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Victims / Affected Individuals</CardTitle>
          <CardDescription>{linkedVictims.length} record(s) linked to this incident</CardDescription>
          {canManage && (
            <div className="mt-1">
              <AddVictimDialog incidentId={incident.id} />
            </div>
          )}
        </CardHeader>
        <CardContent>
          {linkedVictims.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No victims recorded for this incident.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {linkedVictims.map((v) => (
                <div
                  key={v.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <User className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{v.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {v.age} yrs old, {v.gender} — {v.address}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <VictimStatusBadge status={v.status} />
                    {canDelete && (
                      <Button variant="ghost" size="icon" onClick={() => deleteVictim(v.id)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
