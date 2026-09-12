"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"

export function DeleteIncidentDialog({ incidentId }: { incidentId: string }) {
  const { deleteIncident } = useApp()
  const router = useRouter()

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={<Button variant="outline" size="sm" className="text-destructive hover:text-destructive" />}
      >
        <Trash2 data-icon="inline-start" />
        Delete
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this incident report?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently remove {incidentId} and its linked victim records. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={() => {
              deleteIncident(incidentId)
              toast.success(`Incident ${incidentId} deleted`)
              router.push("/incidents")
            }}
          >
            Delete Incident
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
