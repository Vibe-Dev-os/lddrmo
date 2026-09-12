"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const LocationPickerInner = dynamic(() => import("./location-picker-inner"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
})

export function LocationPicker(props: { lat: number; lng: number; onChange: (lat: number, lng: number) => void }) {
  return (
    <div className="h-64 w-full overflow-hidden rounded-lg border border-border">
      <LocationPickerInner {...props} />
    </div>
  )
}
