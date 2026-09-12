"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useApp } from "@/lib/app-context"
import { MONTH_NAMES } from "@/lib/format"

const chartConfig: ChartConfig = {
  incidents: { label: "Incidents", color: "var(--chart-1)" },
}

export function IncidentsTrendChart() {
  const { incidents, filters } = useApp()

  const data = MONTH_NAMES.map((month, idx) => {
    const count = incidents.filter((i) => {
      const d = new Date(i.dateTime)
      return d.getFullYear() === filters.year && d.getMonth() === idx
    }).length
    return { month: month.slice(0, 3), incidents: count }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Trend</CardTitle>
        <CardDescription>Monthly incident volume for {filters.year}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={data} margin={{ left: -20, right: 8 }}>
            <defs>
              <linearGradient id="fillIncidents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-incidents)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--color-incidents)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="incidents"
              type="monotone"
              fill="url(#fillIncidents)"
              stroke="var(--color-incidents)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
