import { connectToDatabase } from "@/lib/db"
import { VictimModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const victim = await VictimModel.findOne({ id: params.id }).lean()

    if (!victim) {
      return NextResponse.json({ error: "Victim not found" }, { status: 404 })
    }

    return NextResponse.json(victim)
  } catch (error) {
    console.error("Error fetching victim:", error)
    return NextResponse.json({ error: "Failed to fetch victim" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const victim = await VictimModel.findOneAndUpdate({ id: params.id }, body, {
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDatabase()

    await VictimModel.deleteOne({ id: params.id })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting victim:", error)
    return NextResponse.json({ error: "Failed to delete victim" }, { status: 500 })
  }
}
