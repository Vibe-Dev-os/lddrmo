"use client"

import { toast } from "sonner"
import { Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"
import { downloadCsv } from "@/lib/csv-export"
import { formatDateTime } from "@/lib/format"

export function ExportTab() {
  const { filteredIncidents, filteredVictims, barangays, incidentTypes } = useApp()

  function exportIncidents() {
    downloadCsv(
      `midsalip-incidents-${Date.now()}.csv`,
      filteredIncidents.map((i) => ({
        id: i.id,
        type: incidentTypes.find((t) => t.id === i.type)?.label ?? i.type,
        barangay: barangays.find((b) => b.id === i.barangayId)?.name ?? "Unknown",
        dateTime: formatDateTime(i.dateTime),
        severity: i.severity,
        status: i.status,
        victims: i.victimIds.length,
        description: i.description,
      })),
    )
    toast.success("Incident report exported as CSV")
  }

  function exportVictims() {
    downloadCsv(
      `midsalip-victims-${Date.now()}.csv`,
      filteredVictims.map((v) => ({
        id: v.id,
        name: v.name,
        age: v.age,
        gender: v.gender,
        address: v.address,
        incidentId: v.incidentId,
        status: v.status,
        medicalAssistance: v.medicalAssistance ? "Yes" : "No",
      })),
    )
    toast.success("Victims report exported as CSV")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Reports</CardTitle>
        <CardDescription>Download the currently filtered data for offline reporting and submission.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button onClick={exportIncidents} className="flex-1">
          <Download data-icon="inline-start" />
          Export Incidents (CSV) — {filteredIncidents.length} records
        </Button>
        <Button onClick={exportVictims} variant="secondary" className="flex-1">
          <Download data-icon="inline-start" />
          Export Victims (CSV) — {filteredVictims.length} records
        </Button>
        <Button onClick={() => window.print()} variant="outline" className="flex-1">
          <Printer data-icon="inline-start" />
          Print / Save as PDF
        </Button>
      </CardContent>
    </Card>
  )
}
