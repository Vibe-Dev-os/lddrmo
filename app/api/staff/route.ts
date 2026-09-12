import { connectToDatabase } from "@/lib/db"
import { StaffUserModel } from "@/lib/models"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const staffUsers = await StaffUserModel.find({}).lean()

    return NextResponse.json(staffUsers)
  } catch (error) {
    console.error("Error fetching staff users:", error)
    return NextResponse.json({ error: "Failed to fetch staff users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    const body = await request.json()

    const staffUser = new StaffUserModel({
      ...body,
      id: body.id || `user_${Date.now()}`,
    })

    await staffUser.save()

    return NextResponse.json(staffUser.toObject(), { status: 201 })
  } catch (error) {
    console.error("Error creating staff user:", error)
    return NextResponse.json({ error: "Failed to create staff user" }, { status: 500 })
  }
}
