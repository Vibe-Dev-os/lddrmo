import { IncidentsByTypeChart } from "@/components/dashboard/incidents-by-type-chart"
import { IncidentsTrendChart } from "@/components/dashboard/incidents-trend-chart"
import { KpiCards } from "@/components/dashboard/kpi-cards"
import { RecentIncidentsList } from "@/components/dashboard/recent-incidents-list"
import { SeverityBreakdownChart } from "@/components/dashboard/severity-breakdown-chart"
import { TopBarangays } from "@/components/dashboard/top-barangays"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Municipal overview of disaster incidents, victims, and response status.
        </p>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <IncidentsTrendChart />
        </div>
        <TopBarangays />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <IncidentsByTypeChart />
        <SeverityBreakdownChart />
      </div>

      <RecentIncidentsList />
    </div>
  )
}
