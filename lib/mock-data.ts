import type {
  Barangay,
  Incident,
  IncidentStatus,
  IncidentTypeDef,
  IncidentTypeId,
  IncidentUpdate,
  Severity,
  StaffUser,
  Victim,
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

export const BARANGAYS: Barangay[] = [
  { id: "poblacion", name: "Poblacion", lat: 7.9019, lng: 123.3012 },
  { id: "bag-ong-lugar", name: "Bag-ong Lugar", lat: 7.9142, lng: 123.312 },
  { id: "bunawan", name: "Bunawan", lat: 7.888, lng: 123.291 },
  { id: "camp-1", name: "Camp 1", lat: 7.9205, lng: 123.284 },
  { id: "camp-2", name: "Camp 2", lat: 7.9301, lng: 123.298 },
  { id: "concepcion", name: "Concepcion", lat: 7.879, lng: 123.313 },
  { id: "dalaon", name: "Dalaon", lat: 7.896, lng: 123.322 },
  { id: "libertad", name: "Libertad", lat: 7.9088, lng: 123.279 },
  { id: "little-baguio", name: "Little Baguio", lat: 7.933, lng: 123.309 },
  { id: "lower-tumaran", name: "Lower Tumaran", lat: 7.883, lng: 123.276 },
  { id: "mabuhay", name: "Mabuhay", lat: 7.898, lng: 123.305 },
  { id: "san-jose", name: "San Jose", lat: 7.912, lng: 123.295 },
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

// Deterministic seeded RNG so server and client render identical mock data.
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(19842)

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

function randInt(min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

const NARRATIVES: Record<IncidentTypeId, string[]> = {
  flood: [
    "Heavy rainfall overnight caused the river to overflow, submerging low-lying residential areas.",
    "Flash flood affected several households near the creek, prompting evacuation to the barangay hall.",
  ],
  fire: [
    "Residential fire broke out reportedly due to faulty electrical wiring, spreading to two adjacent structures.",
    "Small fire started in a cooking area and was contained by community bystanders before BFP arrival.",
  ],
  landslide: [
    "Continuous rainfall triggered a slope failure along the mountain road, blocking passage.",
    "Soil erosion along the hillside caused a partial landslide affecting a nearby footpath.",
  ],
  earthquake: [
    "A moderate tremor was felt across the municipality, causing minor structural cracks in some homes.",
    "Aftershock from a regional earthquake caused panic and minor damage to a school building.",
  ],
  vehicular: [
    "A motorcycle collided with a delivery van along the national highway during heavy rain.",
    "Multi-vehicle collision occurred at a road junction due to poor visibility at night.",
  ],
  medical: [
    "A resident collapsed due to suspected cardiac arrest and was rushed to the nearest health center.",
    "A snake bite emergency was reported by a farmer while working in the field.",
  ],
  "armed-conflict": [
    "Reported armed skirmish near the boundary area prompted the deployment of local security forces.",
    "Security personnel responded to a reported harassment incident involving armed individuals.",
  ],
  other: [
    "A fallen tree blocked the main road following strong winds overnight.",
    "A structural collapse of an old warehouse was reported with no immediate casualties.",
  ],
}

function typeToDefaultSeverityPool(type: IncidentTypeId): Severity[] {
  switch (type) {
    case "fire":
    case "earthquake":
    case "armed-conflict":
      return ["moderate", "severe", "casualties", "severe"]
    case "vehicular":
    case "medical":
      return ["moderate", "severe", "casualties"]
    case "flood":
    case "landslide":
      return ["minor", "moderate", "severe", "casualties"]
    default:
      return ["minor", "moderate"]
  }
}

function jitterCoord(base: number, spreadKm: number) {
  const spreadDeg = spreadKm / 111
  return base + (rng() * 2 - 1) * spreadDeg
}

function daysAgoDate(daysAgo: number, hour: number, minute: number) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, minute, 0, 0)
  return d
}

function buildUpdates(id: string, status: IncidentStatus, dateTime: string, author: string): IncidentUpdate[] {
  const base = new Date(dateTime)
  const updates: IncidentUpdate[] = [
    {
      id: `${id}-u1`,
      timestamp: base.toISOString(),
      note: "Incident logged and initial responders dispatched to the area.",
      author,
      statusAfter: "ongoing",
    },
  ]
  if (status === "monitoring" || status === "resolved") {
    const t2 = new Date(base.getTime() + 1000 * 60 * 60 * 6)
    updates.push({
      id: `${id}-u2`,
      timestamp: t2.toISOString(),
      note: "Situation stabilized. LDRRMO continues to monitor conditions in the area.",
      author,
      statusAfter: "monitoring",
    })
  }
  if (status === "resolved") {
    const t3 = new Date(base.getTime() + 1000 * 60 * 60 * 30)
    updates.push({
      id: `${id}-u3`,
      timestamp: t3.toISOString(),
      note: "Incident formally closed. All affected residents accounted for and assisted.",
      author,
      statusAfter: "resolved",
    })
  }
  return updates
}

function generateIncidents(count: number): Incident[] {
  const incidents: Incident[] = []
  for (let i = 0; i < count; i++) {
    const type = pick(INCIDENT_TYPES).id
    const barangay = pick(BARANGAYS)
    const daysAgo = randInt(0, 364)
    const hour = randInt(0, 23)
    const minute = pick([0, 15, 30, 45])
    const dateTime = daysAgoDate(daysAgo, hour, minute).toISOString()
    const severity = pick(typeToDefaultSeverityPool(type))
    const status: IncidentStatus = daysAgo < 3 ? pick(["ongoing", "monitoring"]) : pick(["monitoring", "resolved", "resolved"])
    const author = pick(STAFF_USERS.filter((u) => u.role !== "viewer")).name
    const id = `INC-${String(2024000 + i).slice(-4)}-${String(i + 1).padStart(3, "0")}`
    incidents.push({
      id,
      type,
      dateTime,
      barangayId: barangay.id,
      lat: jitterCoord(barangay.lat, 1.2),
      lng: jitterCoord(barangay.lng, 1.2),
      description: pick(NARRATIVES[type]),
      severity,
      status,
      victimIds: [],
      updates: buildUpdates(id, status, dateTime, author),
      createdBy: author,
    })
  }
  return incidents.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
}

const FIRST_NAMES = ["Maria", "Juan", "Rosa", "Pedro", "Ana", "Jose", "Teresa", "Carlos", "Liza", "Ramon", "Grace", "Noel", "Fely", "Dante", "Rina"]
const LAST_NAMES = ["Delacruz", "Santos", "Reyes", "Bautista", "Gonzales", "Ramos", "Torres", "Flores", "Mendoza", "Aquino"]

function generateVictims(incidents: Incident[], count: number): Victim[] {
  const victims: Victim[] = []
  const eligible = incidents.filter((inc) => inc.severity !== "minor")
  const pool = eligible.length > 0 ? eligible : incidents
  for (let i = 0; i < count; i++) {
    const incident = pick(pool)
    const gender = pick<"Male" | "Female">(["Male", "Female"])
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`
    const barangay = BARANGAYS.find((b) => b.id === incident.barangayId)
    let status: VictimStatus = "safe"
    if (incident.severity === "casualties") {
      status = pick(["deceased", "injured", "missing", "safe"])
    } else if (incident.severity === "severe") {
      status = pick(["injured", "safe", "safe"])
    } else {
      status = pick(["safe", "injured"])
    }
    const id = `VIC-${String(i + 1).padStart(4, "0")}`
    victims.push({
      id,
      name,
      age: randInt(3, 78),
      gender,
      address: `Purok ${randInt(1, 6)}, ${barangay?.name ?? "Poblacion"}`,
      incidentId: incident.id,
      status,
      medicalAssistance: status !== "safe" ? true : rng() > 0.5,
      medicalNotes:
        status === "deceased"
          ? "Body recovered, released to family for burial rites."
          : status === "missing"
            ? "Search and rescue operations ongoing."
            : status === "injured"
              ? "Given first aid and transported to Midsalip Rural Health Unit."
              : "No injuries reported; provided relief pack and psychosocial support.",
    })
    incident.victimIds.push(id)
  }
  return victims
}

export const MOCK_INCIDENTS: Incident[] = generateIncidents(34)
export const MOCK_VICTIMS: Victim[] = generateVictims(MOCK_INCIDENTS, 22)
