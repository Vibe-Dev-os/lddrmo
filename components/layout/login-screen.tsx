"use client"

import { HardHat, ShieldCheck, TriangleAlert, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"
import type { Role } from "@/lib/types"

const ROLES: { role: Role; title: string; description: string; icon: typeof ShieldCheck }[] = [
  {
    role: "admin",
    title: "MDRRMO Admin",
    description: "Full access to incidents, victims, reports, and system settings.",
    icon: ShieldCheck,
  },
  {
    role: "encoder",
    title: "Field Encoder / Responder",
    description: "Create and update incident reports, victims, and geotags.",
    icon: HardHat,
  },
  {
    role: "viewer",
    title: "Viewer / Analyst",
    description: "Read-only access to the dashboard, map, and reports.",
    icon: Users,
  },
]

export function LoginScreen() {
  const { login } = useApp()

  return (
    <div className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sidebar via-sidebar to-[#050810] px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-sidebar-accent ring-2 ring-sidebar-primary/40">
            <TriangleAlert className="size-8 text-sidebar-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/60">
              Local Government of Midsalip
            </p>
            <h1 className="text-2xl font-semibold text-sidebar-foreground sm:text-3xl">
              Midsalip LDRRMO Incident Report System
            </h1>
            <p className="mt-1 text-sm text-sidebar-foreground/70">
              Disaster Risk Reduction &amp; Management Information System
            </p>
          </div>
        </div>

        <Card className="border-white/10 bg-card/95 shadow-2xl backdrop-blur">
          <CardHeader>
            <CardTitle>Login as</CardTitle>
            <CardDescription>Select a demo role to preview the system from that perspective.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {ROLES.map(({ role, title, description, icon: Icon }) => (
                <div
                  key={role}
                  className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-background p-4 text-left transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                  <Button size="sm" variant="secondary" className="mt-1 w-full" onClick={() => login(role)}>
                    Continue as {title.split(" ")[0]}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <p className="mt-6 text-center text-xs text-sidebar-foreground/50">
          Demo environment — all data shown is simulated for evaluation purposes.
        </p>
      </div>
    </div>
  )
}
