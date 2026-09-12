"use client"

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useApp } from "@/lib/app-context"

export function IncidentsByTypeChart() {
  const { filteredIncidents, incidentTypes } = useApp()

  const data = incidentTypes
    .map((t) => ({
      type: t.label,
      count: filteredIncidents.filter((i) => i.type === t.id).length,
      fill: t.color,
    }))
    .filter((d) => d.count > 0)
    .sort((a, b) => b.count - a.count)

  const chartConfig: ChartConfig = { count: { label: "Incidents" } }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incidents by Type</CardTitle>
        <CardDescription>Distribution across incident categories</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">No incidents match the current filters.</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} />
              <YAxis
                dataKey="type"
                type="category"
                tickLine={false}
                axisLine={false}
                fontSize={11}
                width={110}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((d) => (
                  <Cell key={d.type} fill={d.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
