import mongoose, { Schema, Document } from "mongoose";

export interface InventoryItem {
  id: string;
  name: string;
  category: "food" | "clothing" | "medical" | "educational" | "other";
  quantity: number;
  unit: string; // kg, pieces, boxes, etc.
  location: string;
  donatedBy?: string;
  donationDate: Date;
  expiryDate?: Date;
  status: "available" | "reserved" | "distributed" | "expired";
  description?: string;
  tags?: string[];
}

export interface InventoryDocument extends Document {
  name: string;
  category: "food" | "clothing" | "medical" | "educational" | "other";
  quantity: number;
  unit: string;
  location: string;
  donatedBy?: string;
  donationDate: Date;
  expiryDate?: Date;
  status: "available" | "reserved" | "distributed" | "expired";
  description?: string;
  tags?: string[];
}

const InventorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["food", "clothing", "medical", "educational", "other"],
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    donatedBy: {
      type: String,
      trim: true,
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["available", "reserved", "distributed", "expired"],
      default: "available",
    },
    description: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add indexes for better query performance
InventorySchema.index({ category: 1 });
InventorySchema.index({ status: 1 });
InventorySchema.index({ location: 1 });
InventorySchema.index({ name: "text", description: "text" });

export const InventoryModel = mongoose.model<InventoryDocument>(
  "Inventory",
  InventorySchema
);

export interface CreateInventoryItemDto {
  name: string;
  category: "food" | "clothing" | "medical" | "educational" | "other";
  quantity: number;
  unit: string;
  location: string;
  donatedBy?: string;
  expiryDate?: Date;
  description?: string;
  tags?: string[];
}

export interface UpdateInventoryItemDto {
  name?: string;
  category?: "food" | "clothing" | "medical" | "educational" | "other";
  quantity?: number;
  unit?: string;
  location?: string;
  donatedBy?: string;
  expiryDate?: Date;
  status?: "available" | "reserved" | "distributed" | "expired";
  description?: string;
  tags?: string[];
}
