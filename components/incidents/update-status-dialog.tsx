"use client"

import { useState } from "react"
import { toast } from "sonner"
import { RefreshCw } from "lucide-react"
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useApp } from "@/lib/app-context"
import type { Incident, IncidentStatus } from "@/lib/types"

export function UpdateStatusDialog({ incident }: { incident: Incident }) {
  const { updateIncidentStatus } = useApp()
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<IncidentStatus>(incident.status)
  const [note, setNote] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateIncidentStatus(incident.id, status, note.trim())
    toast.success(`Incident ${incident.id} updated to "${status}"`)
    setOpen(false)
    setNote("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <RefreshCw data-icon="inline-start" />
        Update Status
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Incident Status</DialogTitle>
          <DialogDescription>Add a progress note and change the current status of {incident.id}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="new-status">Status</FieldLabel>
              <Select value={status} onValueChange={(v) => setStatus(v as IncidentStatus)}>
                <SelectTrigger id="new-status">
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
            <Field>
              <FieldLabel htmlFor="note">Progress Note</FieldLabel>
              <Textarea
                id="note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Describe the latest response actions or situation update..."
              />
            </Field>
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Update</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
