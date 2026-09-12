"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApp } from "@/lib/app-context"

export function BarangayBreakdownTab() {
  const { filteredIncidents, filteredVictims, barangays } = useApp()

  const rows = barangays
    .map((b) => {
      const incidents = filteredIncidents.filter((i) => i.barangayId === b.id)
      const victims = filteredVictims.filter((v) => incidents.some((i) => i.id === v.incidentId))
      const resolved = incidents.filter((i) => i.status === "resolved").length
      return {
        barangay: b,
        incidentCount: incidents.length,
        victimCount: victims.length,
        casualties: victims.filter((v) => v.status === "deceased" || v.status === "missing").length,
        resolutionRate: incidents.length > 0 ? Math.round((resolved / incidents.length) * 100) : 0,
      }
    })
    .sort((a, b) => b.incidentCount - a.incidentCount)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barangay-Level Breakdown</CardTitle>
        <CardDescription>Incident and victim distribution across all barangays</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Barangay</TableHead>
              <TableHead>Incidents</TableHead>
              <TableHead>Affected Individuals</TableHead>
              <TableHead>Casualties</TableHead>
              <TableHead>Resolution Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.barangay.id}>
                <TableCell className="font-medium text-foreground">{r.barangay.name}</TableCell>
                <TableCell className="tabular-nums">{r.incidentCount}</TableCell>
                <TableCell className="tabular-nums">{r.victimCount}</TableCell>
                <TableCell className="tabular-nums text-destructive">{r.casualties || "—"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-success" style={{ width: `${r.resolutionRate}%` }} />
                    </div>
                    <span className="text-xs tabular-nums text-muted-foreground">{r.resolutionRate}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
