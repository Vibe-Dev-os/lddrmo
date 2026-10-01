import { connectToDatabase } from "@/lib/db"
import { StaffUserModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const staffUser = await StaffUserModel.findOne({ id }).lean()

    if (!staffUser) {
      return NextResponse.json({ error: "Staff user not found" }, { status: 404 })
    }

    return NextResponse.json(staffUser)
  } catch (error) {
    console.error("Error fetching staff user:", error)
    return NextResponse.json({ error: "Failed to fetch staff user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const body = await request.json()

    const staffUser = await StaffUserModel.findOneAndUpdate({ id }, body, {
      new: true,
    }).lean()

    if (!staffUser) {
      return NextResponse.json({ error: "Staff user not found" }, { status: 404 })
    }

    return NextResponse.json(staffUser)
  } catch (error) {
    console.error("Error updating staff user:", error)
    return NextResponse.json({ error: "Failed to update staff user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    await StaffUserModel.deleteOne({ id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting staff user:", error)
    return NextResponse.json({ error: "Failed to delete staff user" }, { status: 500 })
  }
}
