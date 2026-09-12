"use client"

import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { useApp } from "@/lib/app-context"
import { MONTH_NAMES } from "@/lib/format"

export function YoyTab() {
  const { incidents, filters } = useApp()
  const currentYear = filters.year
  const previousYear = currentYear - 1

  const data = MONTH_NAMES.map((month, idx) => {
    const currentCount = incidents.filter((i) => {
      const d = new Date(i.dateTime)
      return d.getFullYear() === currentYear && d.getMonth() === idx
    }).length
    const previousCount = incidents.filter((i) => {
      const d = new Date(i.dateTime)
      return d.getFullYear() === previousYear && d.getMonth() === idx
    }).length
    return { month: month.slice(0, 3), current: currentCount, previous: previousCount }
  })

  const currentTotal = data.reduce((sum, d) => sum + d.current, 0)
  const previousTotal = data.reduce((sum, d) => sum + d.previous, 0)
  const change = previousTotal > 0 ? Math.round(((currentTotal - previousTotal) / previousTotal) * 100) : 0

  const chartConfig: ChartConfig = {
    current: { label: String(currentYear), color: "var(--chart-1)" },
    previous: { label: String(previousYear), color: "var(--chart-3)" },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Year-over-Year Comparison</CardTitle>
        <CardDescription>
          {currentYear} vs {previousYear} — {currentTotal} vs {previousTotal} incidents (
          {change >= 0 ? "+" : ""}
          {change}%)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart data={data} margin={{ left: -20, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} allowDecimals={false} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="previous" fill="var(--color-previous)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="current" fill="var(--color-current)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
