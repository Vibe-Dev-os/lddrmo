import type {
  Barangay,
  IncidentStatus,
  IncidentTypeDef,
  Severity,
  StaffUser,
  VictimStatus,
} from "./types"

export const INCIDENT_TYPES: IncidentTypeDef[] = [
  { id: "flood", label: "Flood", color: "#2563EB", icon: "Waves" },
  { id: "fire", label: "Fire", color: "#DC2626", icon: "Flame" },
  { id: "landslide", label: "Landslide", color: "#92400E", icon: "Mountain" },
  { id: "earthquake", label: "Earthquake", color: "#7C3AED", icon: "Activity" },
  { id: "vehicular", label: "Vehicular Accident", color: "#D97706", icon: "Car" },
  { id: "medical", label: "Medical Emergency", color: "#DB2777", icon: "HeartPulse" },
  { id: "armed-conflict", label: "Armed Conflict / Security", color: "#0F172A", icon: "ShieldAlert" },
  { id: "other", label: "Other", color: "#64748B", icon: "CircleAlert" },
]

// Real barangays of the Municipality of Midsalip, Zamboanga del Sur (33 total), with
// coordinates sourced from OpenStreetMap/PhilAtlas.
export const BARANGAYS: Barangay[] = [
  { id: "bacahan", name: "Bacahan", lat: 8.0321, lng: 123.3502 },
  { id: "balonai", name: "Balonai", lat: 8.0537, lng: 123.1625 },
  { id: "bibilop", name: "Bibilop", lat: 8.0224, lng: 123.3366 },
  { id: "buloron", name: "Buloron", lat: 8.0099, lng: 123.3549 },
  { id: "cabaloran", name: "Cabaloran", lat: 7.9862, lng: 123.2879 },
  { id: "canipay-norte", name: "Canipay Norte", lat: 8.051, lng: 123.2985 },
  { id: "canipay-sur", name: "Canipay Sur", lat: 8.0348, lng: 123.2944 },
  { id: "cumaron", name: "Cumaron", lat: 8.0126, lng: 123.3126 },
  { id: "dakayakan", name: "Dakayakan", lat: 8.0281, lng: 123.2017 },
  { id: "duelic", name: "Duelic", lat: 8.0192, lng: 123.2345 },
  { id: "dumalinao", name: "Dumalinao", lat: 8.0257, lng: 123.3581 },
  { id: "ecuan", name: "Ecuan", lat: 8.077, lng: 123.2848 },
  { id: "golictop", name: "Golictop", lat: 8.0707, lng: 123.2716 },
  { id: "guinabot", name: "Guinabot", lat: 8.0141, lng: 123.29 },
  { id: "guitalos", name: "Guitalos", lat: 8.0595, lng: 123.2472 },
  { id: "guma", name: "Guma", lat: 8.022, lng: 123.3227 },
  { id: "kahayagan", name: "Kahayagan", lat: 8.0861, lng: 123.3064 },
  { id: "licuro-an", name: "Licuro-an", lat: 8.0816, lng: 123.2327 },
  { id: "lumpunid", name: "Lumpunid", lat: 7.9932, lng: 123.3474 },
  { id: "matalang", name: "Matalang", lat: 8.0328, lng: 123.2512 },
  { id: "new-katipunan", name: "New Katipunan", lat: 8.0879, lng: 123.249 },
  { id: "new-unidos", name: "New Unidos", lat: 8.072, lng: 123.3001 },
  { id: "palili", name: "Palili", lat: 8.072, lng: 123.3163 },
  { id: "pawan", name: "Pawan", lat: 8.0943, lng: 123.2086 },
  { id: "pili", name: "Pili", lat: 8.0758, lng: 123.1774 },
  { id: "pisompongan", name: "Pisompongan", lat: 8.0488, lng: 123.1967 },
  { id: "piwan", name: "Piwan", lat: 8.0197, lng: 123.1842 },
  { id: "poblacion-a", name: "Poblacion A", lat: 8.0318, lng: 123.319 },
  { id: "poblacion-b", name: "Poblacion B", lat: 8.031, lng: 123.3119 },
  { id: "sigapod", name: "Sigapod", lat: 8.0244, lng: 123.2662 },
  { id: "timbaboy", name: "Timbaboy", lat: 8.0379, lng: 123.3056 },
  { id: "tulbong", name: "Tulbong", lat: 8.0823, lng: 123.2708 },
  { id: "tuluan", name: "Tuluan", lat: 8.0485, lng: 123.2726 },
]

export const SEVERITY_META: Record<Severity, { label: string; color: string }> = {
  minor: { label: "Minor", color: "#16A34A" },
  moderate: { label: "Moderate", color: "#D97706" },
  severe: { label: "Severe", color: "#EA580C" },
  casualties: { label: "With Casualties", color: "#DC2626" },
}

export const STATUS_META: Record<IncidentStatus, { label: string }> = {
  ongoing: { label: "Ongoing" },
  monitoring: { label: "Monitoring" },
  resolved: { label: "Resolved" },
}

export const VICTIM_STATUS_META: Record<VictimStatus, { label: string; color: string }> = {
  injured: { label: "Injured", color: "#D97706" },
  deceased: { label: "Deceased", color: "#991B1B" },
  missing: { label: "Missing", color: "#7C3AED" },
  safe: { label: "Rescued / Safe", color: "#16A34A" },
}

export const STAFF_USERS: StaffUser[] = [
  { id: "u1", name: "Engr. Ramil Santos", email: "ramil.santos@midsalip.gov.ph", role: "admin", password: "pass123" },
  { id: "u2", name: "Jenny Ochoa", email: "jenny.ochoa@midsalip.gov.ph", role: "encoder", password: "pass123" },
  { id: "u3", name: "Mark Villareal", email: "mark.villareal@midsalip.gov.ph", role: "encoder", password: "pass123" },
  { id: "u4", name: "Provincial DRRM Analyst", email: "analyst@zdsprov.gov.ph", role: "viewer", password: "pass123" },
]
