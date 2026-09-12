"use client"

import { Layers, Waves } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SEVERITY_META } from "@/lib/mock-data"
import type { Severity } from "@/lib/types"
import { cn } from "@/lib/utils"

export function MapControls({
  mode,
  onModeChange,
}: {
  mode: "cluster" | "heatmap"
  onModeChange: (mode: "cluster" | "heatmap") => void
}) {
  const severities = Object.keys(SEVERITY_META) as Severity[]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Map Layers</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button
            variant={mode === "cluster" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => onModeChange("cluster")}
          >
            <Layers data-icon="inline-start" />
            Markers
          </Button>
          <Button
            variant={mode === "heatmap" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => onModeChange("heatmap")}
          >
            <Waves data-icon="inline-start" />
            Heatmap
          </Button>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Severity Legend</p>
          <div className="flex flex-col gap-1.5">
            {severities.map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm">
                <span
                  className={cn("size-2.5 rounded-full")}
                  style={{ backgroundColor: SEVERITY_META[s].color }}
                />
                {SEVERITY_META[s].label}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
