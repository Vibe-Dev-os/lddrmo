"use client"

import { AlertTriangle, HeartPulse, ShieldCheck, TrendingDown, TrendingUp, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

export function KpiCards() {
  const { filteredIncidents, filteredVictims } = useApp()

  const ongoing = filteredIncidents.filter((i) => i.status === "ongoing").length
  const resolved = filteredIncidents.filter((i) => i.status === "resolved").length
  const casualties = filteredVictims.filter((v) => v.status === "deceased" || v.status === "missing").length
  const assisted = filteredVictims.filter((v) => v.medicalAssistance).length

  const cards = [
    {
      label: "Total Incidents",
      value: filteredIncidents.length,
      icon: AlertTriangle,
      tone: "primary" as const,
      trend: { value: "+12% vs last period", positive: false },
    },
    {
      label: "Ongoing / Active",
      value: ongoing,
      icon: ShieldCheck,
      tone: "destructive" as const,
      trend: { value: `${resolved} resolved`, positive: true },
    },
    {
      label: "Affected Individuals",
      value: filteredVictims.length,
      icon: Users,
      tone: "warning" as const,
      trend: { value: `${casualties} casualties`, positive: false },
    },
    {
      label: "Medical Assistance Given",
      value: assisted,
      icon: HeartPulse,
      tone: "success" as const,
      trend: { value: `${Math.round((assisted / Math.max(filteredVictims.length, 1)) * 100)}% of affected`, positive: true },
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon
        const TrendIcon = c.trend.positive ? TrendingUp : TrendingDown
        return (
          <Card key={c.label}>
            <CardContent className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">{c.label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{c.value}</p>
                <p
                  className={cn(
                    "mt-1.5 flex items-center gap-1 text-[11px] font-medium",
                    c.trend.positive ? "text-success" : "text-muted-foreground",
                  )}
                >
                  <TrendIcon className="size-3" />
                  {c.trend.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-lg",
                  c.tone === "primary" && "bg-primary/10 text-primary",
                  c.tone === "destructive" && "bg-destructive/10 text-destructive",
                  c.tone === "warning" && "bg-warning/15 text-warning",
                  c.tone === "success" && "bg-success/10 text-success",
                )}
              >
                <Icon className="size-4.5" />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
