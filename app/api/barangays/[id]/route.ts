import { connectToDatabase } from "@/lib/db"
import { BarangayModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const barangay = await BarangayModel.findOne({ id: params.id }).lean()

    if (!barangay) {
      return NextResponse.json({ error: "Barangay not found" }, { status: 404 })
    }

    return NextResponse.json(barangay)
  } catch (error) {
    console.error("Error fetching barangay:", error)
    return NextResponse.json({ error: "Failed to fetch barangay" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const barangay = await BarangayModel.findOneAndUpdate({ id: params.id }, body, {
      new: true,
    }).lean()

    if (!barangay) {
      return NextResponse.json({ error: "Barangay not found" }, { status: 404 })
    }

    return NextResponse.json(barangay)
  } catch (error) {
    console.error("Error updating barangay:", error)
    return NextResponse.json({ error: "Failed to update barangay" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    await BarangayModel.deleteOne({ id: params.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting barangay:", error)
    return NextResponse.json({ error: "Failed to delete barangay" }, { status: 500 })
  }
}
