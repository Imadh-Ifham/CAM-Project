import mongoose, { Schema, Document } from "mongoose";

export type CollectionStatus =
  | "draft"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ICollectionJob extends Document {
  jobId: string; // human-friendly id
  campaignId: string; // Campaign.campaignID (string id used across app)
  coordinatorAgentId: string; // User.agentId of coordinator
  resourceId: string; // Campaign.resources[].id
  // Snapshot of the campaign resource at creation time (optional but useful)
  resourceSnapshot?: {
    id: string;
    name: string;
    category: string;
    unit: string;
    quantity?: number; // campaign required quantity (alias of target)
    estimatedCost?: number;
    description?: string;
    targetQty?: number; // campaign required quantity
  };
  // Snapshot of coordinator profile for quick reads
  coordinatorProfile?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  targetQty: number; // e.g., 100
  progressQty: number; // actual collected
  status: CollectionStatus;
  assignedVolunteerId?: string;
  pickup?: {
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
  records?: Array<{
    volunteerId?: string;
    volunteerName?: string;
    amountSubmitted: number; // delta collected in this record
    completedQtyAfter: number; // cumulative collected quantity after this record
    targetQtySnapshot: number; // target at time of record
    recordedAt: Date;
    note?: string;
  }>;
}

const CollectionJobSchema = new Schema<ICollectionJob>(
  {
    jobId: { type: String, required: true, unique: true, index: true },
    campaignId: { type: String, required: true, index: true },
    coordinatorAgentId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    resourceSnapshot: {
      id: String,
      name: String,
      category: String,
      unit: String,
      quantity: Number,
      estimatedCost: Number,
      description: String,
      targetQty: Number,
    },
    coordinatorProfile: {
      fullName: String,
      email: String,
      phoneNumber: String,
    },
    targetQty: { type: Number, required: true, min: 1 },
    progressQty: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["draft", "scheduled", "in_progress", "completed", "cancelled"],
      default: "draft",
      index: true,
    },
    assignedVolunteerId: { type: String },
    pickup: {
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
    records: [
      new Schema(
        {
          volunteerId: { type: String },
          volunteerName: { type: String },
          amountSubmitted: { type: Number, required: true, min: 0 },
          completedQtyAfter: { type: Number, required: true, min: 0 },
          targetQtySnapshot: { type: Number, required: true, min: 0 },
          recordedAt: { type: Date, required: true },
          note: { type: String },
        },
        { _id: false }
      ),
    ],
    audit: {
      createdByUid: { type: String, required: true },
      updatedByUid: { type: String },
    },
  },
  { timestamps: true }
);

CollectionJobSchema.index({ campaignId: 1, resourceId: 1, status: 1 });

export default (mongoose.models.CollectionJob as any) ||
  mongoose.model<ICollectionJob>("CollectionJob", CollectionJobSchema);
