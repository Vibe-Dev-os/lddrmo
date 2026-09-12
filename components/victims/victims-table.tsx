"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Search, SearchX, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Badge } from "@/components/ui/badge"
import { VictimStatusBadge } from "@/components/shared/victim-status-badge"
import { useApp } from "@/lib/app-context"
import type { VictimStatus } from "@/lib/types"

const PAGE_SIZE = 8

export function VictimsTable() {
  const { filteredVictims, role, deleteVictim } = useApp()
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<VictimStatus | "all">("all")
  const [page, setPage] = useState(0)
  const canDelete = role === "admin"

  const results = useMemo(() => {
    return filteredVictims.filter((v) => {
      if (statusFilter !== "all" && v.status !== statusFilter) return false
      if (query) {
        const haystack = `${v.name} ${v.address} ${v.incidentId}`.toLowerCase()
        if (!haystack.includes(query.toLowerCase())) return false
      }
      return true
    })
  }, [filteredVictims, statusFilter, query])

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages - 1)
  const paged = results.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, address, or incident ID..."
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
            setStatusFilter(v as VictimStatus | "all")
            setPage(0)
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="safe">Rescued / Safe</SelectItem>
              <SelectItem value="injured">Injured</SelectItem>
              <SelectItem value="missing">Missing</SelectItem>
              <SelectItem value="deceased">Deceased</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age / Gender</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Linked Incident</TableHead>
              <TableHead>Medical Assistance</TableHead>
              <TableHead>Status</TableHead>
              {canDelete && <TableHead className="w-10" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium text-foreground">{v.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {v.age} / {v.gender}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{v.address}</TableCell>
                <TableCell>
                  <Link href={`/incidents/${v.incidentId}`} className="text-sm font-medium text-primary hover:underline">
                    {v.incidentId}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={v.medicalAssistance ? "secondary" : "outline"}>
                    {v.medicalAssistance ? "Provided" : "Not needed"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <VictimStatusBadge status={v.status} />
                </TableCell>
                {canDelete && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        deleteVictim(v.id)
                        toast.success(`${v.name} removed`)
                      }}
                    >
                      <Trash2 className="text-destructive" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {paged.length === 0 && (
          <Empty className="border-0 py-12">
            <EmptyMedia variant="icon">
              <SearchX />
            </EmptyMedia>
            <EmptyTitle>No matching records</EmptyTitle>
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
