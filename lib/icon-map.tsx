import {
  Activity,
  Car,
  CircleAlert,
  Flame,
  HeartPulse,
  Mountain,
  ShieldAlert,
  Waves,
  type LucideIcon,
} from "lucide-react"

export const INCIDENT_ICONS: Record<string, LucideIcon> = {
  Waves,
  Flame,
  Mountain,
  Activity,
  Car,
  HeartPulse,
  ShieldAlert,
  CircleAlert,
}

export function getIncidentIcon(name: string): LucideIcon {
  return INCIDENT_ICONS[name] ?? CircleAlert
}
