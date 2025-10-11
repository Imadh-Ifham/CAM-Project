import mongoose, { Document, Schema, Types } from "mongoose";

export interface IStockLot extends Document {
  campaignId: string;
  resourceId: string;
  resourceSnapshot?: {
    name?: string;
    unit?: string;
    category?: string;
  };
  collectionJobId?: Types.ObjectId;
  distributionJobIds: Types.ObjectId[];
  quantity: number; // collected quantity added to stock
  consumedQty: number; // how much has been distributed from this lot
  status: "available" | "partial" | "depleted";
  createdAt: Date;
  updatedAt: Date;
}

const StockSchema = new Schema<IStockLot>(
  {
    campaignId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true, index: true },
    resourceSnapshot: {
      name: { type: String },
      unit: { type: String },
      category: { type: String },
    },
    collectionJobId: { type: Schema.Types.ObjectId, ref: "CollectionJob" },
    distributionJobIds: [
      { type: Schema.Types.ObjectId, ref: "DistributionJob" },
    ],
    quantity: { type: Number, required: true, min: 0 },
    consumedQty: { type: Number, required: true, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["available", "partial", "depleted"],
      default: "available",
    },
  },
  { timestamps: true }
);

StockSchema.index({ campaignId: 1, resourceId: 1, createdAt: 1 });

export default (mongoose.models.Stock as any) ||
  mongoose.model<IStockLot>("Stock", StockSchema);
