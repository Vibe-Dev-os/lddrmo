"use client"

import Image from "next/image"
import { Eye, EyeOff, HardHat, Lock, Mail, ShieldCheck, TriangleAlert, Users } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/lib/app-context"
import type { Role } from "@/lib/types"

const ROLES: { role: Role; title: string; description: string; icon: typeof ShieldCheck; email: string }[] = [
  {
    role: "admin",
    title: "MDRRMO Admin",
    description: "Full access to incidents, victims, reports, and system settings.",
    icon: ShieldCheck,
    email: "ramil.santos@midsalip.gov.ph",
  },
  {
    role: "encoder",
    title: "Field Encoder / Responder",
    description: "Create and update incident reports, victims, and geotags.",
    icon: HardHat,
    email: "jenny.ochoa@midsalip.gov.ph",
  },
  {
    role: "viewer",
    title: "Viewer / Analyst",
    description: "Read-only access to the dashboard, map, and reports.",
    icon: Users,
    email: "analyst@zdsprov.gov.ph",
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

  if (selectedRole && selectedRoleData) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sidebar via-sidebar to-[#050810] px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-red-700 via-red-600 to-red-500 shadow-lg shadow-red-600/30">
              <Lock className="size-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-red-800">Verify Your Identity</h2>
              <p className="mt-1 text-base font-semibold text-gray-700">
                Enter your password to access as{" "}
                <span className="font-bold text-red-700">{selectedRoleData.title.split(" ")[0]}</span>
              </p>
            </div>
          </div>

          <Card className="border-white/10 bg-card/95 shadow-2xl backdrop-blur">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <selectedRoleData.icon className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{selectedRoleData.title}</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">{selectedRoleData.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
                      className="pr-10"
                      disabled={isLoading}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20">
                    {error}
                  </div>
                )}

                <div className="space-y-2 pt-2">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Verifying..." : "Login"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedRole(null)
                      setPassword("")
                      setError("")
                    }}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                </div>


              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-sidebar via-sidebar to-[#050810] px-4 py-10">
      <div className="w-full max-w-4xl">
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <Image 
            src="/MIDSALIP.png" 
            alt="Midsalip LDRRMO Logo" 
            width={120} 
            height={120}
            className="drop-shadow-lg"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-700 drop-shadow-sm mb-2">
              Local Government of Midsalip
            </p>
            <h1 className="text-4xl font-extrabold text-red-800 drop-shadow-sm sm:text-5xl">
              Midsalip LDRRMO
            </h1>
            <p className="mt-2 text-lg font-bold text-red-700 drop-shadow-sm">Incident Report System</p>
            <p className="mt-1 text-sm font-semibold text-gray-700 drop-shadow-sm">
              Disaster Risk Reduction &amp; Management Information System
            </p>
          </div>
        </div>

        <Card className="border-transparent bg-transparent shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-red-800">Select Your Role</CardTitle>
            <CardDescription className="mt-2 text-base font-semibold text-gray-700">Choose your account type to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {ROLES.map(({ role, title, description, icon: Icon }) => (
                <div
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedRole(role)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className="group relative flex flex-col items-start gap-4 rounded-xl border border-red-200 bg-gradient-to-br from-background/80 to-background/50 p-5 text-left transition-all duration-300 hover:border-red-400 hover:shadow-lg hover:shadow-red-200 hover:bg-gradient-to-br hover:from-background hover:to-background/80 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 rounded-xl opacity-0 bg-gradient-to-br from-red-50 to-transparent group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-100 to-red-50 text-red-700 shadow-sm transition-all duration-300 group-hover:from-red-200 group-hover:to-red-100 group-hover:shadow-md group-hover:shadow-red-200">
                    <Icon className="size-6" />
                  </div>

                  <div className="relative flex-1">
                    <p className="font-semibold text-foreground text-sm group-hover:text-red-700 transition-colors">{title}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
                  </div>

                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedRole(role)
                      }}
                      className="w-full px-4 py-2 rounded-md border border-red-300 text-red-700 hover:bg-red-50 hover:border-red-500 transition-all duration-300 group-hover:border-red-600 group-hover:bg-red-100 text-sm font-medium font-semibold"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-xs text-white/60">
            Demo environment — all data shown is simulated for evaluation purposes.
          </p>
        </div>
      </div>
    </div>
  )
}

