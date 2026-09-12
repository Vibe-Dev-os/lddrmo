"use client"

import { HeartPulse, ShieldCheck, Skull, UserSearch } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

export function VictimsKpi() {
  const { filteredVictims } = useApp()

  const injured = filteredVictims.filter((v) => v.status === "injured").length
  const deceased = filteredVictims.filter((v) => v.status === "deceased").length
  const missing = filteredVictims.filter((v) => v.status === "missing").length
  const safe = filteredVictims.filter((v) => v.status === "safe").length

  const cards = [
    { label: "Injured", value: injured, icon: HeartPulse, tone: "warning" as const },
    { label: "Deceased", value: deceased, icon: Skull, tone: "destructive" as const },
    { label: "Missing", value: missing, icon: UserSearch, tone: "primary" as const },
    { label: "Rescued / Safe", value: safe, icon: ShieldCheck, tone: "success" as const },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((c) => {
        const Icon = c.icon
        return (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-3">
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
              <div>
                <p className="text-lg font-semibold tabular-nums text-foreground">{c.value}</p>
                <p className="text-xs text-muted-foreground">{c.label}</p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
