import { connectToDatabase } from "@/lib/db"
import {
  INCIDENT_TYPES,
  BARANGAYS,
  STAFF_USERS,
  MOCK_INCIDENTS,
  MOCK_VICTIMS,
} from "@/lib/mock-data"
import {
  IncidentTypeModel,
  BarangayModel,
  StaffUserModel,
  IncidentModel,
  VictimModel,
} from "@/lib/models"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    await connectToDatabase()

    // Seed incident types
    for (const type of INCIDENT_TYPES) {
      await IncidentTypeModel.updateOne(
        { id: type.id },
        { ...type },
        { upsert: true }
      )
    }

    // Seed barangays
    for (const barangay of BARANGAYS) {
      await BarangayModel.updateOne(
        { id: barangay.id },
        { ...barangay },
        { upsert: true }
      )
    }

    // Seed staff users
    for (const staff of STAFF_USERS) {
      await StaffUserModel.updateOne(
        { id: staff.id },
        { ...staff },
        { upsert: true }
      )
    }

    // Seed incidents
    for (const incident of MOCK_INCIDENTS) {
      await IncidentModel.updateOne(
        { id: incident.id },
        { ...incident },
        { upsert: true }
      )
    }

    // Seed victims
    for (const victim of MOCK_VICTIMS) {
      await VictimModel.updateOne(
        { id: victim.id },
        { ...victim },
        { upsert: true }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    await connectToDatabase()

    const incidentCount = await IncidentModel.countDocuments()
    const victimCount = await VictimModel.countDocuments()
    const staffCount = await StaffUserModel.countDocuments()
    const barangayCount = await BarangayModel.countDocuments()
    const typeCount = await IncidentTypeModel.countDocuments()

    return NextResponse.json({
      incidents: incidentCount,
      victims: victimCount,
      staff: staffCount,
      barangays: barangayCount,
      incidentTypes: typeCount,
    })
  } catch (error) {
    console.error("Error checking database:", error)
    return NextResponse.json({ error: "Failed to check database" }, { status: 500 })
  }
}
