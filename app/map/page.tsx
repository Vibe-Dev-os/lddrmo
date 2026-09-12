"use client"

import { useState } from "react"
import { IncidentMap } from "@/components/map/incident-map"
import { MapControls } from "@/components/map/map-controls"
import { SelectedIncidentPanel } from "@/components/map/selected-incident-panel"
import { useApp } from "@/lib/app-context"
import type { Incident } from "@/lib/types"

export default function MapPage() {
  const { filteredIncidents } = useApp()
  const [mode, setMode] = useState<"cluster" | "heatmap">("cluster")
  const [selected, setSelected] = useState<Incident | null>(null)

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">GIS Map</h1>
        <p className="text-sm text-muted-foreground">
          Geotagged view of {filteredIncidents.length} incident(s) matching the current filters.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="flex flex-col gap-4 lg:col-span-1">
          <MapControls mode={mode} onModeChange={setMode} />
          <SelectedIncidentPanel incident={selected} />
        </div>
        <div className="h-[520px] overflow-hidden rounded-lg border border-border lg:col-span-3">
          <IncidentMap incidents={filteredIncidents} mode={mode} onSelect={setSelected} />
        </div>
      </div>
    </div>
  )
}
