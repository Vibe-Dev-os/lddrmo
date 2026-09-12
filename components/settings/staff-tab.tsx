"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useApp } from "@/lib/app-context"
import type { Role } from "@/lib/types"

const ROLE_LABELS: Record<Role, string> = { admin: "MDRRMO Admin", encoder: "Field Encoder", viewer: "Viewer / Analyst" }

export function StaffTab() {
  const { staff, addStaff, removeStaff } = useApp()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("encoder")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    addStaff({ name: name.trim(), email: email.trim(), role })
    toast.success(`${name.trim()} added as ${ROLE_LABELS[role]}`)
    setOpen(false)
    setName("")
    setEmail("")
    setRole("encoder")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff / User Management</CardTitle>
        <CardDescription>Manage LDRRMO staff accounts and their access roles.</CardDescription>
        <div className="mt-1">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button size="sm" />}>
              <Plus data-icon="inline-start" />
              Add Staff
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
              <DialogHeader>
                <DialogTitle>Add Staff Member</DialogTitle>
                <DialogDescription>Grant a new user access to the system.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="staff-name">Full Name</FieldLabel>
                    <Input id="staff-name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="staff-email">Email</FieldLabel>
                    <Input id="staff-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="staff-role">Role</FieldLabel>
                    <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                      <SelectTrigger id="staff-role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="admin">MDRRMO Admin</SelectItem>
                          <SelectItem value="encoder">Field Encoder</SelectItem>
                          <SelectItem value="viewer">Viewer / Analyst</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                </FieldGroup>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Staff</Button>
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
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-foreground">{s.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{ROLE_LABELS[s.role]}</Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      removeStaff(s.id)
                      toast.success(`Removed ${s.name}`)
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
