"use client"

import { IncidentFormDialog } from "@/components/incidents/incident-form-dialog"
import { IncidentsTable } from "@/components/incidents/incidents-table"
import { useApp } from "@/lib/app-context"

export default function IncidentsPage() {
  const { role, filteredIncidents } = useApp()
  const canCreate = role === "admin" || role === "encoder"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Incident Reports</h1>
          <p className="text-sm text-muted-foreground">
            {filteredIncidents.length} incident(s) matching the current filters.
          </p>
        </div>
        {canCreate && <IncidentFormDialog />}
      </div>
      <IncidentsTable />
    </div>
  )
}
