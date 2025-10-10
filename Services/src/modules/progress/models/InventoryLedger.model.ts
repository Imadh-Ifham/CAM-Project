import mongoose, { Schema, Document } from "mongoose";

export type LedgerSourceType = "collection" | "distribution" | "adjustment";

export interface IInventoryLedger extends Document {
  campaignId: string;
  resourceId: string;
  delta: number; // + for collection, - for distribution, +/- for adjustment
  sourceType: LedgerSourceType;
  sourceId: string; // job _id or adjustment id
  committedAt: Date;
  createdByUid: string;
  idempotencyKey?: string;
}

const InventoryLedgerSchema = new Schema<IInventoryLedger>(
  {
    campaignId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    delta: { type: Number, required: true },
    sourceType: {
      type: String,
      enum: ["collection", "distribution", "adjustment"],
      required: true,
      index: true,
    },
    sourceId: { type: String, required: true, index: true },
    committedAt: { type: Date, required: true, default: () => new Date() },
    createdByUid: { type: String, required: true },
    idempotencyKey: { type: String, index: true },
  },
  { timestamps: true }
);

InventoryLedgerSchema.index({ campaignId: 1, resourceId: 1, committedAt: -1 });
InventoryLedgerSchema.index({ sourceType: 1, sourceId: 1 }, { unique: true });

export default (mongoose.models.InventoryLedger as any) ||
  mongoose.model<IInventoryLedger>("InventoryLedger", InventoryLedgerSchema);
