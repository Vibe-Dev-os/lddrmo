"use client"

import { Cell, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useApp } from "@/lib/app-context"
import { SEVERITY_META } from "@/lib/mock-data"
import type { Severity } from "@/lib/types"

export function SeverityBreakdownChart() {
  const { filteredIncidents } = useApp()

  const severities = Object.keys(SEVERITY_META) as Severity[]
  const data = severities
    .map((s) => ({ severity: SEVERITY_META[s].label, count: filteredIncidents.filter((i) => i.severity === s).length, fill: SEVERITY_META[s].color }))
    .filter((d) => d.count > 0)

  const chartConfig: ChartConfig = { count: { label: "Incidents" } }
  const total = data.reduce((sum, d) => sum + d.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Severity Breakdown</CardTitle>
        <CardDescription>Share of incidents by severity level</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
        <ChartContainer config={chartConfig} className="aspect-square h-[200px] w-[200px] shrink-0">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="count" nameKey="severity" innerRadius={55} outerRadius={80} strokeWidth={2}>
              {data.map((d) => (
                <Cell key={d.severity} fill={d.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex w-full flex-col gap-2">
          {data.map((d) => (
            <div key={d.severity} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-foreground">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                {d.severity}
              </span>
              <span className="font-medium tabular-nums text-muted-foreground">
                {d.count} ({total > 0 ? Math.round((d.count / total) * 100) : 0}%)
              </span>
            </div>
          ))}
          {data.length === 0 && <p className="text-sm text-muted-foreground">No data for current filters.</p>}
        </div>
      </CardContent>
    </Card>
  )
}
