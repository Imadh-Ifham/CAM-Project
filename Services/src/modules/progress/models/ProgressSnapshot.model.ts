import mongoose, { Schema, Document } from "mongoose";

export interface IProgressSnapshot extends Document {
  campaignId: string;
  resourceId: string;
  targetQty: number;
  collectedQty: number;
  distributedQty: number;
  reservedQty: number;
  availableQty: number; // derived = collected - distributed - reserved
  updatedAt: Date;
}

const ProgressSnapshotSchema = new Schema<IProgressSnapshot>(
  {
    campaignId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    targetQty: { type: Number, required: true, default: 0 },
    collectedQty: { type: Number, required: true, default: 0 },
    distributedQty: { type: Number, required: true, default: 0 },
    reservedQty: { type: Number, required: true, default: 0 },
    availableQty: { type: Number, required: true, default: 0 },
    updatedAt: { type: Date, required: true, default: () => new Date() },
  },
  { timestamps: true }
);

ProgressSnapshotSchema.index(
  { campaignId: 1, resourceId: 1 },
  { unique: true }
);

export default (mongoose.models.ProgressSnapshot as any) ||
  mongoose.model<IProgressSnapshot>("ProgressSnapshot", ProgressSnapshotSchema);
