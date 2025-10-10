import mongoose, { Schema, Document } from "mongoose";

export type DistributionStatus =
  | "draft"
  | "scheduled"
  | "blocked_insufficient_stock"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface IDistributionJob extends Document {
  distributionId: string; // human-friendly id
  campaignId: string; // Campaign.campaignID (string id used across app)
  coordinatorAgentId: string; // User.agentId of coordinator
  resourceId: string; // Inventory or Campaign resource id to distribute
  // Snapshots for denormalization and query convenience
  resourceSnapshot?: {
    id: string;
    name?: string;
    category?: string;
    unit?: string;
    availableQty?: number;
    description?: string;
    targetQty?: number;
  };
  coordinatorProfile?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  targetQty: number; // planned to distribute
  reservedQty: number; // reserved from inventory for this job
  progressQty: number; // actually delivered so far
  status: DistributionStatus;
  assignedVolunteerId?: string;
  receiverPhone?: string; // recipient phone number
  deliveryInstructions?: string; // special notes for delivery
  destination?: {
    locationName?: string;
    address?: string;
    lat?: number;
    lng?: number;
    contactName?: string;
    contactPhone?: string;
  };
  schedule?: {
    plannedStartAt?: Date;
    plannedEndAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
  };
  notes?: string;
  audit: { createdByUid: string; updatedByUid?: string };
}

const DistributionJobSchema = new Schema<IDistributionJob>(
  {
    distributionId: { type: String, required: true, unique: true, index: true },
    campaignId: { type: String, required: true, index: true },
    coordinatorAgentId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    resourceSnapshot: {
      id: String,
      name: String,
      category: String,
      unit: String,
      availableQty: Number,
      description: String,
      targetQty: Number,
    },
    coordinatorProfile: {
      fullName: String,
      email: String,
      phoneNumber: String,
    },
    targetQty: { type: Number, required: true, min: 1 },
    reservedQty: { type: Number, default: 0, min: 0 },
    progressQty: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: [
        "draft",
        "scheduled",
        "blocked_insufficient_stock",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "draft",
      index: true,
    },
    assignedVolunteerId: { type: String },
    receiverPhone: { type: String },
    deliveryInstructions: { type: String },
    destination: {
      locationName: String,
      address: String,
      lat: Number,
      lng: Number,
      contactName: String,
      contactPhone: String,
    },
    schedule: {
      plannedStartAt: Date,
      plannedEndAt: Date,
      startedAt: Date,
      completedAt: Date,
    },
    notes: { type: String },
    audit: {
      createdByUid: { type: String, required: true },
      updatedByUid: { type: String },
    },
  },
  { timestamps: true }
);

DistributionJobSchema.index({ campaignId: 1, resourceId: 1, status: 1 });

export default (mongoose.models.DistributionJob as any) ||
  mongoose.model<IDistributionJob>("DistributionJob", DistributionJobSchema);
