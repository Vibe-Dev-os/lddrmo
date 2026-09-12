"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApp } from "@/lib/app-context"
import { getIncidentIcon } from "@/lib/icon-map"

export function IncidentTypesTab() {
  const { incidentTypes, addIncidentType, removeIncidentType } = useApp()
  const [open, setOpen] = useState(false)
  const [label, setLabel] = useState("")
  const [color, setColor] = useState("#64748B")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim()) return
    addIncidentType({ label: label.trim(), color, icon: "CircleAlert" })
    toast.success(`Incident type "${label.trim()}" added`)
    setOpen(false)
    setLabel("")
    setColor("#64748B")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Types</CardTitle>
        <CardDescription>Manage the categories used to classify incident reports.</CardDescription>
        <div className="mt-1">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus data-icon="inline-start" />
              Add Type
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Incident Type</DialogTitle>
                <DialogDescription>Create a new incident classification.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="type-label">Label</FieldLabel>
                    <Input id="type-label" value={label} onChange={(e) => setLabel(e.target.value)} required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="type-color">Color</FieldLabel>
                    <Input
                      id="type-color"
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="h-10 w-20 p-1"
                    />
                  </Field>
                </FieldGroup>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Type</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidentTypes.map((t) => {
              const Icon = getIncidentIcon(t.icon)
              return (
                <TableRow key={t.id}>
                  <TableCell className="flex items-center gap-2 font-medium text-foreground">
                    <Icon className="size-4" style={{ color: t.color }} />
                    {t.label}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="size-3 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.color}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeIncidentType(t.id)
                        toast.success(`Removed "${t.label}"`)
                      }}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
