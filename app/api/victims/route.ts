import { connectToDatabase } from "@/lib/db"
import { VictimModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const victims = await VictimModel.find({}).lean()

    return NextResponse.json(victims)
  } catch (error) {
    console.error("Error fetching victims:", error)
    return NextResponse.json({ error: "Failed to fetch victims" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const victim = new VictimModel({
      ...body,
      id: body.id || `victim_${Date.now()}`,
    })

    await victim.save()

    return NextResponse.json(victim.toObject(), { status: 201 })
  } catch (error) {
    console.error("Error creating victim:", error)
    return NextResponse.json({ error: "Failed to create victim" }, { status: 500 })
  }
}
