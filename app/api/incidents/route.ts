import { connectToDatabase } from "@/lib/db"
import { IncidentModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const incidents = await IncidentModel.find({}).sort({ dateTime: -1 }).lean()

    return NextResponse.json(incidents)
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const incident = new IncidentModel({
      ...body,
      id: body.id || `incident_${Date.now()}`,
    })

    await incident.save()

    return NextResponse.json(incident.toObject(), { status: 201 })
  } catch (error) {
    console.error("Error creating incident:", error)
    return NextResponse.json({ error: "Failed to create incident" }, { status: 500 })
  }
}
