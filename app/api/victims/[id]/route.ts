import { connectToDatabase } from "@/lib/db"
import { VictimModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const victim = await VictimModel.findOne({ id }).lean()

    if (!victim) {
      return NextResponse.json({ error: "Victim not found" }, { status: 404 })
    }

    return NextResponse.json(victim)
  } catch (error) {
    console.error("Error fetching victim:", error)
    return NextResponse.json({ error: "Failed to fetch victim" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    const body = await request.json()

    const victim = await VictimModel.findOneAndUpdate({ id }, body, {
      new: true,
    }).lean()

    if (!victim) {
      return NextResponse.json({ error: "Victim not found" }, { status: 404 })
    }

    return NextResponse.json(victim)
  } catch (error) {
    console.error("Error updating victim:", error)
    return NextResponse.json({ error: "Failed to update victim" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase()
    const { id } = await params

    await VictimModel.deleteOne({ id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting victim:", error)
    return NextResponse.json({ error: "Failed to delete victim" }, { status: 500 })
  }
}
