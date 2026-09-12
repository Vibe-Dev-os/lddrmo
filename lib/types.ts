export type Role = "admin" | "encoder" | "viewer"

export type IncidentTypeId =
  | "flood"
  | "fire"
  | "landslide"
  | "earthquake"
  | "vehicular"
  | "medical"
  | "armed-conflict"
  | "other"

export type Severity = "minor" | "moderate" | "severe" | "casualties"

export type IncidentStatus = "ongoing" | "monitoring" | "resolved"

export interface IncidentTypeDef {
  id: IncidentTypeId
  label: string
  color: string
  icon: string
}

export interface Barangay {
  id: string
  name: string
  lat: number
  lng: number
}

export interface IncidentUpdate {
  id: string
  timestamp: string
  note: string
  author: string
  statusAfter: IncidentStatus
}

export interface Incident {
  id: string
  type: IncidentTypeId
  dateTime: string
  barangayId: string
  lat: number
  lng: number
  description: string
  severity: Severity
  status: IncidentStatus
  victimIds: string[]
  updates: IncidentUpdate[]
  createdBy: string
}

export type VictimStatus = "injured" | "deceased" | "missing" | "safe"

export interface Victim {
  id: string
  name: string
  age: number
  gender: "Male" | "Female"
  address: string
  incidentId: string
  status: VictimStatus
  medicalAssistance: boolean
  medicalNotes: string
}

export interface GlobalFilters {
  month: number | "all"
  year: number
  types: IncidentTypeId[]
}

export interface StaffUser {
  id: string
  name: string
  email: string
  role: Role
  password?: string
}
