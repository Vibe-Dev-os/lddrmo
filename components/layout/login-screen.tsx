"use client"

import Image from "next/image"
import { ChevronRight, Eye, EyeOff, HardHat, ShieldCheck, Users } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"
import type { Role } from "@/lib/types"

const ROLES: {
  role: Role
  title: string
  description: string
  icon: typeof ShieldCheck
  email: string
  iconClass: string
  hoverClass: string
}[] = [
  {
    role: "admin",
    title: "MDRRMO Admin",
    description: "Full access to incidents, victims, reports, and system settings.",
    icon: ShieldCheck,
    email: "ramil.santos@midsalip.gov.ph",
    iconClass: "bg-destructive/10 text-destructive",
    hoverClass: "hover:border-destructive/40 hover:bg-destructive/5",
  },
  {
    role: "encoder",
    title: "Field Encoder / Responder",
    description: "Create and update incident reports, victims, and geotags.",
    icon: HardHat,
    email: "jenny.ochoa@midsalip.gov.ph",
    iconClass: "bg-warning/15 text-warning",
    hoverClass: "hover:border-warning/40 hover:bg-warning/5",
  },
  {
    role: "viewer",
    title: "Viewer / Analyst",
    description: "Read-only access to the dashboard, map, and reports.",
    icon: Users,
    email: "analyst@zdsprov.gov.ph",
    iconClass: "bg-chart-5/10 text-chart-5",
    hoverClass: "hover:border-chart-5/40 hover:bg-chart-5/5",
  },
]

export function LoginScreen() {
  const { login } = useApp()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const selectedRoleData = ROLES.find((r) => r.role === selectedRole)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password.trim()) {
      setError("Password is required")
      return
    }

    setIsLoading(true)

    // Simulate password verification (in real app, this would be server-side)
    setTimeout(() => {
      if (password === "pass123") {
        login(selectedRole!)
        setPassword("")
        setSelectedRole(null)
      } else {
        setError("Invalid password. Try 'pass123'")
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 py-10 sm:px-8">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Image src="/MIDSALIP.png" alt="Midsalip LDRRMO Logo" width={56} height={56} />
        <h1 className="text-xl font-semibold text-foreground">Midsalip LDRRMO</h1>
        <p className="text-xs text-muted-foreground">Disaster Risk Reduction &amp; Management</p>
      </div>

        {selectedRole && selectedRoleData ? (
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 shadow-xl shadow-black/[0.04]">
            <div className="mb-6 flex items-center gap-3">
              <div className={cn("flex size-11 shrink-0 items-center justify-center rounded-xl", selectedRoleData.iconClass)}>
                <selectedRoleData.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{selectedRoleData.title}</p>
                <p className="truncate text-xs text-muted-foreground">{selectedRoleData.email}</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError("")
                    }}
                    className="h-11 pr-10"
                    disabled={isLoading}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-2 pt-2">
                <Button type="submit" className="h-11 w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Login"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => {
                    setSelectedRole(null)
                    setPassword("")
                    setError("")
                  }}
                  disabled={isLoading}
                >
                  Back to role selection
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-xl shadow-black/[0.04]">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
              <p className="mt-1 text-sm text-muted-foreground">Select your role to continue</p>
            </div>

            <div className="space-y-2.5">
              {ROLES.map(({ role, title, description, icon: Icon, iconClass, hoverClass }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-xl border border-border bg-background p-4 text-left transition-all",
                    "hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    hoverClass,
                  )}
                >
                  <div
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
                      iconClass,
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo environment — all data shown is simulated for evaluation purposes.
        </p>
      </div>
  )
}

