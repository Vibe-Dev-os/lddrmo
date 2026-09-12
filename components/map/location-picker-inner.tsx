"use client"

import { useMemo } from "react"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"
import { pinIcon } from "@/lib/leaflet-icons"
import "leaflet/dist/leaflet.css"

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function LocationPickerInner({
  lat,
  lng,
  onChange,
}: {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
}) {
  const icon = useMemo(() => pinIcon("#DC2626"), [])

  return (
    <MapContainer center={[lat, lng]} zoom={13} scrollWheelZoom className="h-full w-full">
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[lat, lng]}
        icon={icon}
        draggable
        eventHandlers={{
          dragend: (e) => {
            const p = e.target.getLatLng()
            onChange(p.lat, p.lng)
          },
        }}
      />
      <ClickHandler onPick={onChange} />
    </MapContainer>
  )
}
