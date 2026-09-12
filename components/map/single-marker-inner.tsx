"use client"

import { useMemo } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet"
import { pinIcon } from "@/lib/leaflet-icons"
import "leaflet/dist/leaflet.css"

export default function SingleMarkerInner({
  lat,
  lng,
  color,
  label,
}: {
  lat: number
  lng: number
  color: string
  label: string
}) {
  const icon = useMemo(() => pinIcon(color), [color])

  return (
    <MapContainer center={[lat, lng]} zoom={14} scrollWheelZoom={false} className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  )
}
