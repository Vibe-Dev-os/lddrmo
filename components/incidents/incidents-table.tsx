"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Search, SearchX } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { IncidentTypeBadge } from "@/components/shared/incident-type-badge"
import { SeverityBadge } from "@/components/shared/severity-badge"
import { StatusBadge } from "@/components/shared/status-badge"
import { useApp } from "@/lib/app-context"
import { formatDateTime } from "@/lib/format"
import { BARANGAYS } from "@/lib/mock-data"
import type { IncidentStatus } from "@/lib/types"

const PAGE_SIZE = 8

export function IncidentsTable() {
  const { filteredIncidents } = useApp()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all")
  const [barangayFilter, setBarangayFilter] = useState("all")
  const [page, setPage] = useState(0)

  const results = useMemo(() => {
    return filteredIncidents.filter((inc) => {
      if (statusFilter !== "all" && inc.status !== statusFilter) return false
      if (barangayFilter !== "all" && inc.barangayId !== barangayFilter) return false
      if (query) {
        const barangay = BARANGAYS.find((b) => b.id === inc.barangayId)?.name ?? ""
        const haystack = `${inc.id} ${inc.description} ${barangay}`.toLowerCase()
        if (!haystack.includes(query.toLowerCase())) return false
      }
      return true
    })
  }, [filteredIncidents, statusFilter, barangayFilter, query])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const paged = results.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by ID, barangay, or description..."
            className="pl-9"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(0)
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as IncidentStatus | "all")
            setPage(0)
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={barangayFilter}
          onValueChange={(v) => {
            setBarangayFilter(v ?? "all")
            setPage(0)
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Barangay" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Barangays</SelectItem>
              {BARANGAYS.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Incident</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Barangay</TableHead>
              <TableHead>Date &amp; Time</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((inc) => {
              const barangay = BARANGAYS.find((b) => b.id === inc.barangayId)
              return (
                <TableRow key={inc.id} className="cursor-pointer">
                  <TableCell className="p-0">
                    <Link href={`/incidents/${inc.id}`} className="block px-4 py-3 font-medium text-foreground">
                      {inc.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <IncidentTypeBadge type={inc.type} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{barangay?.name ?? "Unknown"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(inc.dateTime)}</TableCell>
                  <TableCell>
                    <SeverityBadge severity={inc.severity} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={inc.status} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {paged.length === 0 && (
          <Empty className="border-0 py-12">
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>No matching incidents</EmptyTitle>
            <EmptyDescription>Try adjusting your search or filters.</EmptyDescription>
          </Empty>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {paged.length === 0 ? 0 : currentPage * PAGE_SIZE + 1}–
          {currentPage * PAGE_SIZE + paged.length} of {results.length}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft />
          </Button>
          <span className="px-2 tabular-nums">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
