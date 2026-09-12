"use client"

import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"
import type { Incident } from "@/lib/types"

const IncidentMapInner = dynamic(() => import("./incident-map-inner"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
})

export function IncidentMap(props: {
  incidents: Incident[]
  mode: "cluster" | "heatmap"
  onSelect: (incident: Incident) => void
}) {
  return <IncidentMapInner {...props} />
}
