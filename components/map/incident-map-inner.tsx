"use client"

import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet.markercluster"
import "leaflet.markercluster/dist/MarkerCluster.css"
import "leaflet.markercluster/dist/MarkerCluster.Default.css"
import "leaflet.heat"
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import { pinIcon } from "@/lib/leaflet-icons"
import { SEVERITY_META } from "@/lib/mock-data"
import type { Incident } from "@/lib/types"

const CENTER: [number, number] = [7.905, 123.3]

function ClusterLayer({ incidents, onSelect }: { incidents: Incident[]; onSelect: (incident: Incident) => void }) {
  const map = useMap()

  useEffect(() => {
    const group = (L as any).markerClusterGroup({ maxClusterRadius: 50, spiderfyOnMaxZoom: true })
    for (const incident of incidents) {
      const color = SEVERITY_META[incident.severity].color
      const marker = L.marker([incident.lat, incident.lng], { icon: pinIcon(color, 30) })
      marker.on("click", () => onSelect(incident))
      group.addLayer(marker)
    }
    map.addLayer(group)
    return () => {
      map.removeLayer(group)
    }
  }, [map, incidents, onSelect])

  return null
}

function HeatLayer({ incidents }: { incidents: Incident[] }) {
  const map = useMap()

  useEffect(() => {
    const weight: Record<string, number> = { minor: 0.35, moderate: 0.6, severe: 0.85, casualties: 1 }
    const points = incidents.map((i) => [i.lat, i.lng, weight[i.severity] ?? 0.5]) as [number, number, number][]
    const layer = (L as any).heatLayer(points, { radius: 28, blur: 22, maxZoom: 16 })
    map.addLayer(layer)
    return () => {
      map.removeLayer(layer)
    }
  }, [map, incidents])

  return null
}

export default function IncidentMapInner({
  incidents,
  mode,
  onSelect,
}: {
  incidents: Incident[]
  mode: "cluster" | "heatmap"
  onSelect: (incident: Incident) => void
}) {
  return (
    <MapContainer center={CENTER} zoom={12} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mode === "cluster" ? (
        <ClusterLayer incidents={incidents} onSelect={onSelect} />
      ) : (
        <HeatLayer incidents={incidents} />
      )}
    </MapContainer>
  )
}
