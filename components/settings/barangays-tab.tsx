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

export function BarangaysTab() {
  const { barangays, addBarangay, removeBarangay } = useApp()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [lat, setLat] = useState("7.9")
  const [lng, setLng] = useState("123.3")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    addBarangay({ name: name.trim(), lat: Number(lat) || 7.9, lng: Number(lng) || 123.3 })
    toast.success(`Barangay "${name.trim()}" added`)
    setOpen(false)
    setName("")
    setLat("7.9")
    setLng("123.3")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Barangays</CardTitle>
        <CardDescription>Manage the list of barangays used for geotagging incidents.</CardDescription>
        <div className="mt-1">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus data-icon="inline-start" />
              Add Barangay
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Barangay</DialogTitle>
                <DialogDescription>Register a new barangay with its approximate coordinates.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="brgy-name">Name</FieldLabel>
                    <Input id="brgy-name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field>
                      <FieldLabel htmlFor="brgy-lat">Latitude</FieldLabel>
                      <Input id="brgy-lat" value={lat} onChange={(e) => setLat(e.target.value)} />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="brgy-lng">Longitude</FieldLabel>
                      <Input id="brgy-lng" value={lng} onChange={(e) => setLng(e.target.value)} />
                    </Field>
                  </div>
                </FieldGroup>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Barangay</Button>
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
              <TableHead>Name</TableHead>
              <TableHead>Coordinates</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {barangays.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium text-foreground">{b.name}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {b.lat.toFixed(4)}, {b.lng.toFixed(4)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      removeBarangay(b.id)
                      toast.success(`Removed "${b.name}"`)
                    }}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
