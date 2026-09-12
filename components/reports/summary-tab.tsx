"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IncidentTypeBadge } from "@/components/shared/incident-type-badge"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { useApp } from "@/lib/app-context"
import { SEVERITY_META } from "@/lib/mock-data"
import type { Severity } from "@/lib/types"

export function SummaryTab() {
  const { filteredIncidents, filteredVictims, incidentTypes } = useApp()

  const typeRows = incidentTypes
    .map((t) => {
      const incidents = filteredIncidents.filter((i) => i.type === t.id)
      const resolved = incidents.filter((i) => i.status === "resolved").length
      return { type: t.id, count: incidents.length, resolved }
    })
    .filter((r) => r.count > 0)
    .sort((a, b) => b.count - a.count)

  const severities = Object.keys(SEVERITY_META) as Severity[]
  const severityRows = severities
    .map((s) => ({ severity: s, count: filteredIncidents.filter((i) => i.severity === s).length }))
    .filter((r) => r.count > 0)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Incident Type Breakdown</CardTitle>
          <CardDescription>Total incidents and resolution status by type</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Resolved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {typeRows.map((r) => (
                <TableRow key={r.type}>
                  <TableCell>
                    <IncidentTypeBadge type={r.type as any} />
                  </TableCell>
                  <TableCell className="tabular-nums">{r.count}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {r.resolved}/{r.count}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {typeRows.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No data available.</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Severity Summary</CardTitle>
          <CardDescription>Incident count grouped by severity level</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {severityRows.map((r) => (
                <TableRow key={r.severity}>
                  <TableCell>
                    <SeverityBadge severity={r.severity} />
                  </TableCell>
                  <TableCell className="tabular-nums">{r.count}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {Math.round((r.count / Math.max(filteredIncidents.length, 1)) * 100)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {severityRows.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No data available.</p>}
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Victim Impact Summary</CardTitle>
          <CardDescription>Aggregated impact on affected individuals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Affected", value: filteredVictims.length },
              { label: "Injured", value: filteredVictims.filter((v) => v.status === "injured").length },
              { label: "Deceased", value: filteredVictims.filter((v) => v.status === "deceased").length },
              {
                label: "Given Medical Aid",
                value: filteredVictims.filter((v) => v.medicalAssistance).length,
              },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border p-4">
                <p className="text-2xl font-semibold tabular-nums text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
