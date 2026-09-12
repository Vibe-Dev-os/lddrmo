"use client"

import { ShieldOff } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { BarangaysTab } from "@/components/settings/barangays-tab"
import { IncidentTypesTab } from "@/components/settings/incident-types-tab"
import { StaffTab } from "@/components/settings/staff-tab"
import { useApp } from "@/lib/app-context"

export default function SettingsPage() {
  const { role } = useApp()

  if (role !== "admin") {
    return (
      <Empty className="py-20">
        <EmptyMedia variant="icon">
          <ShieldOff />
        </EmptyMedia>
        <EmptyTitle>Access Restricted</EmptyTitle>
        <EmptyDescription>Only MDRRMO Admin accounts can access system settings.</EmptyDescription>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage incident types, barangays, and staff access.</p>
      </div>

      <Tabs defaultValue="types">
        <TabsList>
          <TabsTrigger value="types">Incident Types</TabsTrigger>
          <TabsTrigger value="barangays">Barangays</TabsTrigger>
          <TabsTrigger value="staff">Staff / Users</TabsTrigger>
        </TabsList>
        <TabsContent value="types" className="mt-4">
          <IncidentTypesTab />
        </TabsContent>
        <TabsContent value="barangays" className="mt-4">
          <BarangaysTab />
        </TabsContent>
        <TabsContent value="staff" className="mt-4">
          <StaffTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
