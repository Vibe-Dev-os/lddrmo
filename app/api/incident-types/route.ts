import { connectToDatabase } from "@/lib/db"
import { IncidentTypeModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const incidentTypes = await IncidentTypeModel.find({}).lean()

    return NextResponse.json(incidentTypes)
  } catch (error) {
    console.error("Error fetching incident types:", error)
    return NextResponse.json({ error: "Failed to fetch incident types" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const incidentType = new IncidentTypeModel({
      ...body,
      id: body.id || `type_${Date.now()}`,
    })

    await incidentType.save()

    return NextResponse.json(incidentType.toObject(), { status: 201 })
  } catch (error) {
    console.error("Error creating incident type:", error)
    return NextResponse.json({ error: "Failed to create incident type" }, { status: 500 })
  }
}
