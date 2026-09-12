import mongoose, { Schema, type Document } from "mongoose"
import type { Incident, IncidentUpdate, Victim, StaffUser, Barangay, IncidentTypeDef } from "./types"

export interface IncidentDocument extends Incident, Document {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface VictimDocument extends Victim, Document {
  _id: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface StaffUserDocument extends StaffUser, Document {
  _id: mongoose.Types.ObjectId
  password?: string
  createdAt: Date
  updatedAt: Date
}

export interface BarangayDocument extends Barangay, Document {
  _id: mongoose.Types.ObjectId
}

export interface IncidentTypeDocument extends IncidentTypeDef, Document {
  _id: mongoose.Types.ObjectId
}

const incidentUpdateSchema = new Schema(
  {
    id: String,
    timestamp: String,
    note: String,
    author: String,
    statusAfter: String,
  },
  { _id: false }
)

const incidentSchema = new Schema<IncidentDocument>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["flood", "fire", "landslide", "earthquake", "vehicular", "medical", "armed-conflict", "other"],
    },
    dateTime: {
      type: String,
      required: true,
    },
    barangayId: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      required: true,
      enum: ["minor", "moderate", "severe", "casualties"],
    },
    status: {
      type: String,
      required: true,
      enum: ["ongoing", "monitoring", "resolved"],
    },
    victimIds: [String],
    updates: [incidentUpdateSchema],
    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

const victimSchema = new Schema<VictimDocument>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    address: {
      type: String,
      required: true,
    },
    incidentId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["injured", "deceased", "missing", "safe"],
    },
    medicalAssistance: {
      type: Boolean,
      default: false,
    },
    medicalNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
)

const staffUserSchema = new Schema<StaffUserDocument>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "encoder", "viewer"],
    },
    password: String,
  },
  { timestamps: true }
)

const barangaySchema = new Schema<BarangayDocument>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const incidentTypeSchema = new Schema<IncidentTypeDocument>(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

// Create or get models
export const IncidentModel =
  mongoose.models.Incident || mongoose.model<IncidentDocument>("Incident", incidentSchema)

export const VictimModel =
  mongoose.models.Victim || mongoose.model<VictimDocument>("Victim", victimSchema)

export const StaffUserModel =
  mongoose.models.StaffUser || mongoose.model<StaffUserDocument>("StaffUser", staffUserSchema)

export const BarangayModel =
  mongoose.models.Barangay || mongoose.model<BarangayDocument>("Barangay", barangaySchema)

export const IncidentTypeModel =
  mongoose.models.IncidentType ||
  mongoose.model<IncidentTypeDocument>("IncidentType", incidentTypeSchema)
