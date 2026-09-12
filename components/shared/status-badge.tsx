import { Badge } from "@/components/ui/badge"
import { STATUS_META } from "@/lib/mock-data"
import type { IncidentStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

export function StatusBadge({ status, className }: { status: IncidentStatus; className?: string }) {
  const variant = status === "ongoing" ? "destructive" : status === "monitoring" ? "secondary" : "outline"
  return (
    <Badge
      variant={variant}
      className={cn(status === "resolved" && "border-success/40 text-success", className)}
    >
      {STATUS_META[status].label}
    </Badge>
  )
}
