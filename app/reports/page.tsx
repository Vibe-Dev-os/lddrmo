"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SummaryTab } from "@/components/reports/summary-tab"
import { BarangayBreakdownTab } from "@/components/reports/barangay-breakdown-tab"
import { YoyTab } from "@/components/reports/yoy-tab"
import { ExportTab } from "@/components/reports/export-tab"

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Reports</h1>
        <p className="text-sm text-muted-foreground">Analytical breakdowns and exportable summaries for LDRRMO reporting.</p>
      </div>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="barangay">By Barangay</TabsTrigger>
          <TabsTrigger value="yoy">Year-over-Year</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        <TabsContent value="summary" className="mt-4">
          <SummaryTab />
        </TabsContent>
        <TabsContent value="barangay" className="mt-4">
          <BarangayBreakdownTab />
        </TabsContent>
        <TabsContent value="yoy" className="mt-4">
          <YoyTab />
        </TabsContent>
        <TabsContent value="export" className="mt-4">
          <ExportTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
