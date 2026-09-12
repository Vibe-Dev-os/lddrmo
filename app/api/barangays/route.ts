import { connectToDatabase } from "@/lib/db"
import { BarangayModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const barangays = await BarangayModel.find({}).lean()

    return NextResponse.json(barangays)
  } catch (error) {
    console.error("Error fetching barangays:", error)
    return NextResponse.json({ error: "Failed to fetch barangays" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const barangay = new BarangayModel({
      ...body,
      id: body.id || `barangay_${Date.now()}`,
    })

    await barangay.save()

    return NextResponse.json(barangay.toObject(), { status: 201 })
  } catch (error) {
    console.error("Error creating barangay:", error)
    return NextResponse.json({ error: "Failed to create barangay" }, { status: 500 })
  }
}
