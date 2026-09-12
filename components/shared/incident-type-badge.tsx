import { useApp } from "@/lib/app-context"
import { getIncidentIcon } from "@/lib/icon-map"
import type { IncidentTypeId } from "@/lib/types"
import { cn } from "@/lib/utils"

export function IncidentTypeBadge({ type, className }: { type: IncidentTypeId; className?: string }) {
  const { incidentTypes } = useApp()
  const def = incidentTypes.find((t) => t.id === type)
  if (!def) return null
  const Icon = getIncidentIcon(def.icon)
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", className)}
      style={{ backgroundColor: `${def.color}14`, color: def.color }}
    >
      <Icon className="size-3.5" />
      {def.label}
    </span>
  )
}
