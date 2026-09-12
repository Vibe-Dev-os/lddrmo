"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"
import { BARANGAYS } from "@/lib/mock-data"

export function TopBarangays() {
  const { filteredIncidents } = useApp()

  const counts = BARANGAYS.map((b) => ({
    barangay: b,
    count: filteredIncidents.filter((i) => i.barangayId === b.id).length,
  }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const max = Math.max(...counts.map((c) => c.count), 1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Affected Barangays</CardTitle>
        <CardDescription>Ranked by number of incidents</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {counts.length === 0 && <p className="text-sm text-muted-foreground">No data for current filters.</p>}
        {counts.map((c, idx) => (
          <div key={c.barangay.id} className="flex items-center gap-3">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
              {idx + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-foreground">{c.barangay.name}</span>
                <span className="tabular-nums text-muted-foreground">{c.count}</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${(c.count / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
