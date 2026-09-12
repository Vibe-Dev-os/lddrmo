"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { toast } from "sonner"
import {
  BARANGAYS as INITIAL_BARANGAYS,
  INCIDENT_TYPES as INITIAL_INCIDENT_TYPES,
  MOCK_INCIDENTS,
  MOCK_VICTIMS,
  STAFF_USERS as INITIAL_STAFF,
} from "./mock-data"
import type {
  Barangay,
  GlobalFilters,
  Incident,
  IncidentStatus,
  IncidentTypeDef,
  IncidentTypeId,
  Role,
  StaffUser,
  Victim,
  VictimStatus,
} from "./types"

interface NewIncidentInput {
  type: IncidentTypeId
  dateTime: string
  barangayId: string
  lat: number
  lng: number
  description: string
  severity: Incident["severity"]
  status: IncidentStatus
  victims: Omit<Victim, "id" | "incidentId">[]
}

interface AppContextValue {
  role: Role | null
  currentUserName: string
  login: (role: Role) => void
  logout: () => void

  filters: GlobalFilters
  setFilters: (f: Partial<GlobalFilters>) => void
  clearFilters: () => void
  activeFilterCount: number

  incidents: Incident[]
  victims: Victim[]
  incidentTypes: IncidentTypeDef[]
  barangays: Barangay[]
  staff: StaffUser[]

  filteredIncidents: Incident[]
  filteredVictims: Victim[]

  addIncident: (input: NewIncidentInput) => Incident
  updateIncidentStatus: (id: string, status: IncidentStatus, note: string) => void
  deleteIncident: (id: string) => void

  addVictim: (input: Omit<Victim, "id">) => Victim
  deleteVictim: (id: string) => void

  addIncidentType: (def: Omit<IncidentTypeDef, "id"> & { id?: string }) => void
  updateIncidentType: (id: string, def: Partial<IncidentTypeDef>) => void
  removeIncidentType: (id: string) => void

  addBarangay: (b: Omit<Barangay, "id">) => void
  removeBarangay: (id: string) => void

  addStaff: (s: Omit<StaffUser, "id">) => void
  removeStaff: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const now = new Date()
const DEFAULT_FILTERS: GlobalFilters = {
  month: "all",
  year: now.getFullYear(),
  types: [],
}

let incidentCounter = MOCK_INCIDENTS.length
let victimCounter = MOCK_VICTIMS.length

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [currentUserName, setCurrentUserName] = useState("Guest")
  const [filters, setFiltersState] = useState<GlobalFilters>(DEFAULT_FILTERS)

  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS)
  const [victims, setVictims] = useState<Victim[]>(MOCK_VICTIMS)
  const [incidentTypes, setIncidentTypes] = useState<IncidentTypeDef[]>(INITIAL_INCIDENT_TYPES)
  const [barangays, setBarangays] = useState<Barangay[]>(INITIAL_BARANGAYS)
  const [staff, setStaff] = useState<StaffUser[]>(INITIAL_STAFF)

  const login = useCallback((r: Role) => {
    setRole(r)
    const name = r === "admin" ? "Engr. Ramil Santos" : r === "encoder" ? "Jenny Ochoa" : "Provincial DRRM Analyst"
    setCurrentUserName(name)
    toast.success(`Logged in as ${name}`, { description: r === "admin" ? "MDRRMO Admin" : r === "encoder" ? "Field Encoder / Responder" : "Viewer / Analyst" })
  }, [])

  const logout = useCallback(() => {
    setRole(null)
    setCurrentUserName("Guest")
  }, [])

  const setFilters = useCallback((f: Partial<GlobalFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...f }))
  }, [])

  const clearFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS)
    toast.info("Filters cleared")
  }, [])

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (filters.month !== "all") n++
    if (filters.year !== now.getFullYear()) n++
    if (filters.types.length > 0) n++
    return n
  }, [filters])

  const matchesFilters = useCallback(
    (dateTime: string, type: IncidentTypeId) => {
      const d = new Date(dateTime)
      if (d.getFullYear() !== filters.year) return false
      if (filters.month !== "all" && d.getMonth() !== filters.month) return false
      if (filters.types.length > 0 && !filters.types.includes(type)) return false
      return true
    },
    [filters],
  )

  const filteredIncidents = useMemo(
    () => incidents.filter((i) => matchesFilters(i.dateTime, i.type)),
    [incidents, matchesFilters],
  )

  const filteredIncidentIds = useMemo(() => new Set(filteredIncidents.map((i) => i.id)), [filteredIncidents])

  const filteredVictims = useMemo(
    () => victims.filter((v) => filteredIncidentIds.has(v.incidentId)),
    [victims, filteredIncidentIds],
  )

  const addIncident = useCallback(
    (input: NewIncidentInput) => {
      incidentCounter += 1
      const id = `INC-${now.getFullYear()}-${String(incidentCounter).padStart(3, "0")}`
      const author = currentUserName
      const newVictims: Victim[] = input.victims.map((v) => {
        victimCounter += 1
        return { ...v, id: `VIC-${String(victimCounter).padStart(4, "0")}`, incidentId: id }
      })
      const incident: Incident = {
        id,
        type: input.type,
        dateTime: input.dateTime,
        barangayId: input.barangayId,
        lat: input.lat,
        lng: input.lng,
        description: input.description,
        severity: input.severity,
        status: input.status,
        victimIds: newVictims.map((v) => v.id),
        createdBy: author,
        updates: [
          {
            id: `${id}-u1`,
            timestamp: new Date().toISOString(),
            note: "Incident logged and initial responders dispatched to the area.",
            author,
            statusAfter: input.status,
          },
        ],
      }
      setIncidents((prev) => [incident, ...prev])
      if (newVictims.length > 0) setVictims((prev) => [...newVictims, ...prev])
      return incident
    },
    [currentUserName],
  )

  const updateIncidentStatus = useCallback(
    (id: string, status: IncidentStatus, note: string) => {
      setIncidents((prev) =>
        prev.map((inc) =>
          inc.id === id
            ? {
                ...inc,
                status,
                updates: [
                  ...inc.updates,
                  {
                    id: `${id}-u${inc.updates.length + 1}`,
                    timestamp: new Date().toISOString(),
                    note: note || `Status updated to ${status}.`,
                    author: currentUserName,
                    statusAfter: status,
                  },
                ],
              }
            : inc,
        ),
      )
    },
    [currentUserName],
  )

  const deleteIncident = useCallback((id: string) => {
    setIncidents((prev) => prev.filter((i) => i.id !== id))
    setVictims((prev) => prev.filter((v) => v.incidentId !== id))
  }, [])

  const addVictim = useCallback((input: Omit<Victim, "id">) => {
    victimCounter += 1
    const victim: Victim = { ...input, id: `VIC-${String(victimCounter).padStart(4, "0")}` }
    setVictims((prev) => [victim, ...prev])
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === input.incidentId ? { ...inc, victimIds: [...inc.victimIds, victim.id] } : inc)),
    )
    return victim
  }, [])

  const deleteVictim = useCallback((id: string) => {
    setVictims((prev) => {
      const victim = prev.find((v) => v.id === id)
      if (victim) {
        setIncidents((incs) =>
          incs.map((inc) =>
            inc.id === victim.incidentId ? { ...inc, victimIds: inc.victimIds.filter((vid) => vid !== id) } : inc,
          ),
        )
      }
      return prev.filter((v) => v.id !== id)
    })
  }, [])

  const addIncidentType = useCallback((def: Omit<IncidentTypeDef, "id"> & { id?: string }) => {
    const id = (def.id ?? def.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")) as IncidentTypeId
    setIncidentTypes((prev) => [...prev, { id, label: def.label, color: def.color, icon: def.icon }])
  }, [])

  const updateIncidentType = useCallback((id: string, def: Partial<IncidentTypeDef>) => {
    setIncidentTypes((prev) => prev.map((t) => (t.id === id ? { ...t, ...def } : t)))
  }, [])

  const removeIncidentType = useCallback((id: string) => {
    setIncidentTypes((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addBarangay = useCallback((b: Omit<Barangay, "id">) => {
    const id = b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    setBarangays((prev) => [...prev, { ...b, id }])
  }, [])

  const removeBarangay = useCallback((id: string) => {
    setBarangays((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const addStaff = useCallback((s: Omit<StaffUser, "id">) => {
    setStaff((prev) => [...prev, { ...s, id: `u${prev.length + 1}${Date.now()}` }])
  }, [])

  const removeStaff = useCallback((id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const value: AppContextValue = {
    role,
    currentUserName,
    login,
    logout,
    filters,
    setFilters,
    clearFilters,
    activeFilterCount,
    incidents,
    victims,
    incidentTypes,
    barangays,
    staff,
    filteredIncidents,
    filteredVictims,
    addIncident,
    updateIncidentStatus,
    deleteIncident,
    addVictim,
    deleteVictim,
    addIncidentType,
    updateIncidentType,
    removeIncidentType,
    addBarangay,
    removeBarangay,
    addStaff,
    removeStaff,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}

export function statusLabel(s: VictimStatus) {
  return s
}
