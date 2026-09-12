import { connectToDatabase } from "@/lib/db"
import { IncidentTypeModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const incidentType = await IncidentTypeModel.findOne({ id: params.id }).lean()

    if (!incidentType) {
      return NextResponse.json({ error: "Incident type not found" }, { status: 404 })
    }

    return NextResponse.json(incidentType)
  } catch (error) {
    console.error("Error fetching incident type:", error)
    return NextResponse.json({ error: "Failed to fetch incident type" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const incidentType = await IncidentTypeModel.findOneAndUpdate({ id: params.id }, body, {
      new: true,
    }).lean()

    if (!incidentType) {
      return NextResponse.json({ error: "Incident type not found" }, { status: 404 })
    }

    return NextResponse.json(incidentType)
  } catch (error) {
    console.error("Error updating incident type:", error)
    return NextResponse.json({ error: "Failed to update incident type" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    await IncidentTypeModel.deleteOne({ id: params.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting incident type:", error)
    return NextResponse.json({ error: "Failed to delete incident type" }, { status: 500 })
  }
}
