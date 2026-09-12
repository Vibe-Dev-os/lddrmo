import { connectToDatabase } from "@/lib/db"
import { IncidentModel, VictimModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const incident = await IncidentModel.findOne({ id: params.id }).lean()

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error("Error fetching incident:", error)
    return NextResponse.json({ error: "Failed to fetch incident" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const incident = await IncidentModel.findOneAndUpdate({ id: params.id }, body, {
      new: true,
    }).lean()

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error("Error updating incident:", error)
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    // Delete incident
    await IncidentModel.deleteOne({ id: params.id })

    // Delete associated victims
    await VictimModel.deleteMany({ incidentId: params.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting incident:", error)
    return NextResponse.json({ error: "Failed to delete incident" }, { status: 500 })
  }
}
