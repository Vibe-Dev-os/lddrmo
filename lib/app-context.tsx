"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
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

let incidentCounter = 1000
let victimCounter = 1000

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null)
  const [currentUserName, setCurrentUserName] = useState("Guest")
  const [filters, setFiltersState] = useState<GlobalFilters>(DEFAULT_FILTERS)
  const [loading, setLoading] = useState(true)

  const [incidents, setIncidents] = useState<Incident[]>([])
  const [victims, setVictims] = useState<Victim[]>([])
  const [incidentTypes, setIncidentTypes] = useState<IncidentTypeDef[]>(INITIAL_INCIDENT_TYPES)
  const [barangays, setBarangays] = useState<Barangay[]>(INITIAL_BARANGAYS)
  const [staff, setStaff] = useState<StaffUser[]>(INITIAL_STAFF)

  // Initialize database on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true)

        // Fetch all data from API (ONLY real MongoDB data, no mock fallback)
        const [incidentsRes, victimsRes, barangaysRes, staffRes, typesRes] = await Promise.all([
          fetch("/api/incidents"),
          fetch("/api/victims"),
          fetch("/api/barangays"),
          fetch("/api/staff"),
          fetch("/api/incident-types"),
        ])

        if (incidentsRes.ok) {
          const data = await incidentsRes.json()
          setIncidents(data || [])
        }

        if (victimsRes.ok) {
          const data = await victimsRes.json()
          setVictims(data || [])
        }

        if (barangaysRes.ok) {
          const data = await barangaysRes.json()
          setBarangays(data || INITIAL_BARANGAYS)
        }

        if (staffRes.ok) {
          const data = await staffRes.json()
          setStaff(data || INITIAL_STAFF)
        }

        if (typesRes.ok) {
          const data = await typesRes.json()
          setIncidentTypes(data || INITIAL_INCIDENT_TYPES)
        }
      } catch (error) {
        console.error("Error loading data from database:", error)
        toast.error("Failed to load data from database")
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

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
    async (input: NewIncidentInput) => {
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

      try {
        // Save to database
        const incidentRes = await fetch("/api/incidents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(incident),
        })

        if (!incidentRes.ok) {
          toast.error("Failed to save incident to database")
          return incident
        }

        // Save victims to database
        if (newVictims.length > 0) {
          for (const victim of newVictims) {
            await fetch("/api/victims", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(victim),
            })
          }
        }

        toast.success("Incident saved to database")
      } catch (error) {
        console.error("Error saving incident:", error)
        toast.error("Failed to save incident to database")
      }

      setIncidents((prev) => [incident, ...prev])
      if (newVictims.length > 0) setVictims((prev) => [...newVictims, ...prev])
      return incident
    },
    [currentUserName],
  )

  const updateIncidentStatus = useCallback(
    (id: string, status: IncidentStatus, note: string) => {
      setIncidents((prev) => {
        const updated = prev.map((inc) =>
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
        )

        // Save to database
        const incident = updated.find((i) => i.id === id)
        if (incident) {
          fetch(`/api/incidents/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(incident),
          }).catch((error) => {
            console.error("Error updating incident:", error)
            toast.error("Failed to update incident in database")
          })
        }

        return updated
      })
    },
    [currentUserName],
  )

  const deleteIncident = useCallback((id: string) => {
    setIncidents((prev) => prev.filter((i) => i.id !== id))
    setVictims((prev) => prev.filter((v) => v.incidentId !== id))

    // Delete from database
    fetch(`/api/incidents/${id}`, { method: "DELETE" }).catch((error) => {
      console.error("Error deleting incident:", error)
      toast.error("Failed to delete incident from database")
    })
  }, [])

  const addVictim = useCallback((input: Omit<Victim, "id">) => {
    victimCounter += 1
    const victim: Victim = { ...input, id: `VIC-${String(victimCounter).padStart(4, "0")}` }
    setVictims((prev) => [victim, ...prev])
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === input.incidentId ? { ...inc, victimIds: [...inc.victimIds, victim.id] } : inc)),
    )

    // Save to database
    fetch("/api/victims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(victim),
    }).catch((error) => {
      console.error("Error saving victim:", error)
      toast.error("Failed to save victim to database")
    })

    // Update incident in database
    const incident = incidents.find((i) => i.id === input.incidentId)
    if (incident) {
      const updatedIncident = { ...incident, victimIds: [...incident.victimIds, victim.id] }
      fetch(`/api/incidents/${input.incidentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedIncident),
      }).catch((error) => {
        console.error("Error updating incident:", error)
      })
    }

    return victim
  }, [incidents])

  const deleteVictim = useCallback((id: string) => {
    setVictims((prev) => {
      const victim = prev.find((v) => v.id === id)
      if (victim) {
        setIncidents((incs) =>
          incs.map((inc) =>
            inc.id === victim.incidentId ? { ...inc, victimIds: inc.victimIds.filter((vid) => vid !== id) } : inc,
          ),
        )

        // Delete from database
        fetch(`/api/victims/${id}`, { method: "DELETE" }).catch((error) => {
          console.error("Error deleting victim:", error)
          toast.error("Failed to delete victim from database")
        })
      }
      return prev.filter((v) => v.id !== id)
    })
  }, [])

  const addIncidentType = useCallback((def: Omit<IncidentTypeDef, "id"> & { id?: string }) => {
    const id = (def.id ?? def.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")) as IncidentTypeId
    const newType = { id, label: def.label, color: def.color, icon: def.icon }
    setIncidentTypes((prev) => [...prev, newType])

    // Save to database
    fetch("/api/incident-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newType),
    }).catch((error) => {
      console.error("Error saving incident type:", error)
      toast.error("Failed to save incident type to database")
    })
  }, [])

  const updateIncidentType = useCallback((id: string, def: Partial<IncidentTypeDef>) => {
    setIncidentTypes((prev) => {
      const updated = prev.map((t) => (t.id === id ? { ...t, ...def } : t))

      // Save to database
      const type = updated.find((t) => t.id === id)
      if (type) {
        fetch(`/api/incident-types/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(type),
        }).catch((error) => {
          console.error("Error updating incident type:", error)
          toast.error("Failed to update incident type in database")
        })
      }

      return updated
    })
  }, [])

  const removeIncidentType = useCallback((id: string) => {
    setIncidentTypes((prev) => prev.filter((t) => t.id !== id))

    // Delete from database
    fetch(`/api/incident-types/${id}`, { method: "DELETE" }).catch((error) => {
      console.error("Error deleting incident type:", error)
      toast.error("Failed to delete incident type from database")
    })
  }, [])

  const addBarangay = useCallback((b: Omit<Barangay, "id">) => {
    const id = b.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const newBarangay = { ...b, id }
    setBarangays((prev) => [...prev, newBarangay])

    // Save to database
    fetch("/api/barangays", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBarangay),
    }).catch((error) => {
      console.error("Error saving barangay:", error)
      toast.error("Failed to save barangay to database")
    })
  }, [])

  const removeBarangay = useCallback((id: string) => {
    setBarangays((prev) => prev.filter((b) => b.id !== id))

    // Delete from database
    fetch(`/api/barangays/${id}`, { method: "DELETE" }).catch((error) => {
      console.error("Error deleting barangay:", error)
      toast.error("Failed to delete barangay from database")
    })
  }, [])

  const addStaff = useCallback((s: Omit<StaffUser, "id">) => {
    const newStaff = { ...s, id: `u${Date.now()}` }
    setStaff((prev) => [...prev, newStaff])

    // Save to database
    fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStaff),
    }).catch((error) => {
      console.error("Error saving staff user:", error)
      toast.error("Failed to save staff user to database")
    })
  }, [])

  const removeStaff = useCallback((id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id))

    // Delete from database
    fetch(`/api/staff/${id}`, { method: "DELETE" }).catch((error) => {
      console.error("Error deleting staff user:", error)
      toast.error("Failed to delete staff user from database")
    })
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
