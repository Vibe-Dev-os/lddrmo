import { VICTIM_STATUS_META } from "@/lib/mock-data"
import type { VictimStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

export function VictimStatusBadge({ status, className }: { status: VictimStatus; className?: string }) {
  const meta = VICTIM_STATUS_META[status]
  const isDeceased = status === "deceased"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        isDeceased && "text-white",
        className,
      )}
      style={{ backgroundColor: isDeceased ? meta.color : `${meta.color}1a`, color: isDeceased ? "white" : meta.color }}
    >
      {meta.label}
    </span>
  )
}
