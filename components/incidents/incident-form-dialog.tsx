"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { LocationPicker } from "@/components/map/location-picker"
import { useApp } from "@/lib/app-context"
import { SEVERITY_META } from "@/lib/mock-data"
import { nearestBarangay } from "@/lib/format"
import type { IncidentStatus, IncidentTypeId, Severity, VictimStatus } from "@/lib/types"
import { toast } from "sonner"

interface DraftVictim {
  name: string
  age: string
  gender: "Male" | "Female"
  address: string
  status: VictimStatus
  medicalAssistance: boolean
  medicalNotes: string
}

function emptyVictim(): DraftVictim {
  return { name: "", age: "", gender: "Male", address: "", status: "safe", medicalAssistance: false, medicalNotes: "" }
}

export function IncidentFormDialog() {
  const { incidentTypes, barangays, addIncident } = useApp()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const [type, setType] = useState<IncidentTypeId>(incidentTypes[0]?.id ?? "other")
  const [dateTime, setDateTime] = useState(() => new Date().toISOString().slice(0, 16))
  const [barangayId, setBarangayId] = useState(barangays[0]?.id ?? "")
  const [lat, setLat] = useState(barangays[0]?.lat ?? 7.9)
  const [lng, setLng] = useState(barangays[0]?.lng ?? 123.3)
  const [description, setDescription] = useState("")
  const [severity, setSeverity] = useState<Severity>("minor")
  const [status, setStatus] = useState<IncidentStatus>("ongoing")
  const [victims, setVictims] = useState<DraftVictim[]>([])

  function resetForm() {
    setType(incidentTypes[0]?.id ?? "other")
    setDateTime(new Date().toISOString().slice(0, 16))
    setBarangayId(barangays[0]?.id ?? "")
    setLat(barangays[0]?.lat ?? 7.9)
    setLng(barangays[0]?.lng ?? 123.3)
    setDescription("")
    setSeverity("minor")
    setStatus("ongoing")
    setVictims([])
  }

  function handleLocationChange(newLat: number, newLng: number) {
    setLat(newLat)
    setLng(newLng)
    const nearest = nearestBarangay(newLat, newLng, barangays)
    setBarangayId(nearest.id)
  }

  function handleBarangaySelect(id: string | null) {
    if (!id) return
    setBarangayId(id)
    const b = barangays.find((x) => x.id === id)
    if (b) {
      setLat(b.lat)
      setLng(b.lng)
    }
  }

  function addVictimRow() {
    setVictims((prev) => [...prev, emptyVictim()])
  }

  function updateVictim(idx: number, patch: Partial<DraftVictim>) {
    setVictims((prev) => prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)))
  }

  function removeVictim(idx: number) {
    setVictims((prev) => prev.filter((_, i) => i !== idx))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!description.trim()) {
      toast.error("Please provide an incident description.")
      return
    }
    const incident = addIncident({
      type,
      dateTime: new Date(dateTime).toISOString(),
      barangayId,
      lat,
      lng,
      description: description.trim(),
      severity,
      status,
      victims: victims
        .filter((v) => v.name.trim())
        .map((v) => ({
          name: v.name.trim(),
          age: Number(v.age) || 0,
          gender: v.gender,
          address: v.address.trim() || "Not specified",
          status: v.status,
          medicalAssistance: v.medicalAssistance,
          medicalNotes: v.medicalNotes.trim() || "No additional notes.",
        })),
    })
    toast.success(`Incident ${incident.id} logged successfully`)
    setOpen(false)
    resetForm()
    router.push(`/incidents/${incident.id}`)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) resetForm()
      }}
    >
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        New Incident Report
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Incident Report</DialogTitle>
          <DialogDescription>Log a new disaster or emergency incident with geotagged location.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldSet>
              <FieldLegend variant="label">Incident Details</FieldLegend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="type">Incident Type</FieldLabel>
                  <Select value={type} onValueChange={(v) => setType(v as IncidentTypeId)}>
                    <SelectTrigger id="type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {incidentTypes.map((t) => (
                          <SelectItem key={t.id} value={t.id}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="dateTime">Date &amp; Time</FieldLabel>
                  <Input
                    id="dateTime"
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="severity">Severity</FieldLabel>
                  <Select value={severity} onValueChange={(v) => setSeverity(v as Severity)}>
                    <SelectTrigger id="severity">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Object.entries(SEVERITY_META).map(([key, meta]) => (
                          <SelectItem key={key} value={key}>
                            {meta.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="status">Status</FieldLabel>
                  <Select value={status} onValueChange={(v) => setStatus(v as IncidentStatus)}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="monitoring">Monitoring</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="description">Description / Narrative</FieldLabel>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened, affected areas, and initial response..."
                  rows={3}
                  required
                />
              </Field>
            </FieldSet>

            <FieldSet>
              <FieldLegend variant="label">Location / Geotag</FieldLegend>
              <Field>
                <FieldLabel htmlFor="barangay">Barangay</FieldLabel>
                <Select value={barangayId} onValueChange={handleBarangaySelect}>
                  <SelectTrigger id="barangay">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {barangays.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Click or drag the pin on the map to set the exact geotagged location. {lat.toFixed(4)}, {lng.toFixed(4)}
                </FieldDescription>
              </Field>
              <LocationPicker lat={lat} lng={lng} onChange={handleLocationChange} />
            </FieldSet>

            <FieldSet>
              <div className="flex items-center justify-between">
                <FieldLegend variant="label">Victims / Affected Individuals</FieldLegend>
                <Button type="button" variant="outline" size="sm" onClick={addVictimRow}>
                  <Plus data-icon="inline-start" />
                  Add Person
                </Button>
              </div>
              {victims.length === 0 && (
                <FieldDescription>No victims added yet. This step is optional.</FieldDescription>
              )}
              <div className="flex flex-col gap-3">
                {victims.map((v, idx) => (
                  <div key={idx} className="rounded-lg border border-border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant="secondary">Person {idx + 1}</Badge>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeVictim(idx)}>
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field>
                        <FieldLabel>Full Name</FieldLabel>
                        <Input value={v.name} onChange={(e) => updateVictim(idx, { name: e.target.value })} />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field>
                          <FieldLabel>Age</FieldLabel>
                          <Input
                            type="number"
                            min={0}
                            value={v.age}
                            onChange={(e) => updateVictim(idx, { age: e.target.value })}
                          />
                        </Field>
                        <Field>
                          <FieldLabel>Gender</FieldLabel>
                          <Select value={v.gender} onValueChange={(g) => updateVictim(idx, { gender: g as "Male" | "Female" })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>
                      </div>
                      <Field>
                        <FieldLabel>Address</FieldLabel>
                        <Input value={v.address} onChange={(e) => updateVictim(idx, { address: e.target.value })} />
                      </Field>
                      <Field>
                        <FieldLabel>Status</FieldLabel>
                        <Select value={v.status} onValueChange={(s) => updateVictim(idx, { status: s as VictimStatus })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="safe">Rescued / Safe</SelectItem>
                              <SelectItem value="injured">Injured</SelectItem>
                              <SelectItem value="missing">Missing</SelectItem>
                              <SelectItem value="deceased">Deceased</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field className="sm:col-span-2" orientation="horizontal">
                        <Checkbox
                          id={`assist-${idx}`}
                          checked={v.medicalAssistance}
                          onCheckedChange={(c) => updateVictim(idx, { medicalAssistance: Boolean(c) })}
                        />
                        <FieldContent>
                          <FieldLabel htmlFor={`assist-${idx}`}>Medical assistance provided</FieldLabel>
                        </FieldContent>
                      </Field>
                      <Field className="sm:col-span-2">
                        <FieldLabel>Medical / Relief Notes</FieldLabel>
                        <Textarea
                          value={v.medicalNotes}
                          onChange={(e) => updateVictim(idx, { medicalNotes: e.target.value })}
                          rows={2}
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </FieldSet>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Incident Report</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
