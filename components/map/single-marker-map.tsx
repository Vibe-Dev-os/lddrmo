"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

const SingleMarkerInner = dynamic(() => import("./single-marker-inner"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
})

export function SingleMarkerMap(props: { lat: number; lng: number; color: string; label: string }) {
  return (
    <div className="h-56 w-full overflow-hidden rounded-lg border border-border">
      <SingleMarkerInner {...props} />
    </div>
  )
}
