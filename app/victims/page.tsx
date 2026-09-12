"use client"

import { VictimsKpi } from "@/components/victims/victims-kpi"
import { VictimsTable } from "@/components/victims/victims-table"
import { useApp } from "@/lib/app-context"

export default function VictimsPage() {
  const { filteredVictims } = useApp()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Victims</h1>
        <p className="text-sm text-muted-foreground">
          {filteredVictims.length} affected individual(s) matching the current filters.
        </p>
      </div>
      <VictimsKpi />
      <VictimsTable />
    </div>
  )
}
