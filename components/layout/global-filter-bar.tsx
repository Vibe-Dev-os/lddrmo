"use client"

import { Check, ChevronDown, ListFilter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApp } from "@/lib/app-context"
import { MONTH_NAMES } from "@/lib/format"
import { cn } from "@/lib/utils"

export function GlobalFilterBar() {
  const { filters, setFilters, clearFilters, activeFilterCount, incidentTypes } = useApp()
  const currentYear = new Date().getFullYear()
  const years = [currentYear, currentYear - 1, currentYear - 2]

  function toggleType(id: string) {
    const set = new Set(filters.types)
    if (set.has(id as any)) set.delete(id as any)
    else set.add(id as any)
    setFilters({ types: Array.from(set) as any })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="hidden items-center gap-1.5 text-xs font-medium text-muted-foreground sm:flex">
        <ListFilter className="size-3.5" />
        Filters
      </div>

      <Select
        value={String(filters.month)}
        onValueChange={(v) => setFilters({ month: v === "all" ? "all" : Number(v) })}
      >
        <SelectTrigger size="sm" className="w-[120px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Months</SelectItem>
            {MONTH_NAMES.map((m, i) => (
              <SelectItem key={m} value={String(i)}>
                {m}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={String(filters.year)} onValueChange={(v) => setFilters({ year: Number(v) })}>
        <SelectTrigger size="sm" className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {years.map((y) => (
              <SelectItem key={y} value={String(y)}>
                {y}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger render={<Button variant="outline" size="sm" className="justify-between gap-2" />}>
          Incident Type
          {filters.types.length > 0 && (
            <Badge variant="secondary" className="px-1.5">
              {filters.types.length}
            </Badge>
          )}
          <ChevronDown className="size-3.5" data-icon="inline-end" />
        </PopoverTrigger>
        <PopoverContent className="w-56 p-1.5" align="start">
          {incidentTypes.map((t) => {
            const active = filters.types.includes(t.id)
            return (
              <button
                key={t.id}
                onClick={() => toggleType(t.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                  active && "bg-accent",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ backgroundColor: t.color }} />
                  {t.label}
                </span>
                {active && <Check className="size-3.5 text-primary" />}
              </button>
            )
          })}
        </PopoverContent>
      </Popover>

      {activeFilterCount > 0 && (
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
          <X className="size-3.5" data-icon="inline-start" />
          Clear filters
        </Button>
      )}
    </div>
  )
}
