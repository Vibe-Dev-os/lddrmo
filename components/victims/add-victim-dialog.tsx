"use client"

import { useState } from "react"
import { toast } from "sonner"
import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldContent, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/lib/app-context"
import type { VictimStatus } from "@/lib/types"

export function AddVictimDialog({ incidentId }: { incidentId: string }) {
  const { addVictim } = useApp()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState<"Male" | "Female">("Male")
  const [address, setAddress] = useState("")
  const [status, setStatus] = useState<VictimStatus>("safe")
  const [medicalAssistance, setMedicalAssistance] = useState(false)
  const [medicalNotes, setMedicalNotes] = useState("")

  function reset() {
    setName("")
    setAge("")
    setGender("Male")
    setAddress("")
    setStatus("safe")
    setMedicalAssistance(false)
    setMedicalNotes("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Name is required.")
      return
    }
    addVictim({
      name: name.trim(),
      age: Number(age) || 0,
      gender,
      address: address.trim() || "Not specified",
      incidentId,
      status,
      medicalAssistance,
      medicalNotes: medicalNotes.trim() || "No additional notes.",
    })
    toast.success(`${name.trim()} added to this incident`)
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset() }}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <UserPlus data-icon="inline-start" />
        Add Victim
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Affected Individual</DialogTitle>
          <DialogDescription>Record a victim or affected individual linked to this incident.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="v-name">Full Name</FieldLabel>
              <Input id="v-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="v-age">Age</FieldLabel>
                <Input id="v-age" type="number" min={0} value={age} onChange={(e) => setAge(e.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor="v-gender">Gender</FieldLabel>
                <Select value={gender} onValueChange={(v) => setGender(v as "Male" | "Female")}>
                  <SelectTrigger id="v-gender">
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
              <FieldLabel htmlFor="v-address">Address</FieldLabel>
              <Input id="v-address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="v-status">Status</FieldLabel>
              <Select value={status} onValueChange={(v) => setStatus(v as VictimStatus)}>
                <SelectTrigger id="v-status">
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
            <Field orientation="horizontal">
              <Checkbox
                id="v-assist"
                checked={medicalAssistance}
                onCheckedChange={(c) => setMedicalAssistance(Boolean(c))}
              />
              <FieldContent>
                <FieldLabel htmlFor="v-assist">Medical assistance provided</FieldLabel>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="v-notes">Medical / Relief Notes</FieldLabel>
              <Textarea id="v-notes" rows={2} value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
