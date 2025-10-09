import mongoose, { Schema, Document } from "mongoose";

export interface ICoordinatorAssignment extends Document {
  campaignId: string; // Campaign.campaignID
  agentId: string; // User.agentId
  role: "coordinator";
  status: "active" | "ended";
  startedAt: Date;
  endedAt?: Date;
  audit: {
    approvedByUid: string;
    approvedByEmail?: string;
    approvedAt: Date;
  };
  campaign?: {
    name?: string;
    type?: string;
    district?: string;
    city?: string;
    location?: string;
  };
  coordinatorProfile?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  resourcesSnapshot?: Array<{
    resourceId: string;
    name: string;
    unit: string;
    targetQty?: number;
  }>;
  stats?: {
    progress?: { overallPercent: number };
    collections?: {
      completed: number;
      target?: number;
      byResource?: Array<{
        resourceId: string;
        name: string;
        unit: string;
        collectedQty: number;
        targetQty?: number;
      }>;
    };
    distributions?: {
      completed: number;
      target?: number;
      byResource?: Array<{
        resourceId: string;
        name: string;
        unit: string;
        distributedQty: number;
        targetQty?: number;
      }>;
    };
    tasks?: {
      open: number;
      completed: number;
    };
  };
  relationIds?: {
    recentCollectionLogIds?: string[];
    recentDistributionLogIds?: string[];
    recentTaskIds?: string[];
  };
  volunteers?: Array<{
    volunteerId: string;
    joinedAt: Date;
    leftAt?: Date;
    contribution?: {
      collections?: number;
      distributions?: number;
      tasksCompleted?: number;
    };
  }>;
}

const CoordinatorAssignmentSchema = new Schema<ICoordinatorAssignment>(
  {
    campaignId: { type: String, required: true, index: true, unique: true },
    agentId: { type: String, required: true, index: true },
    role: { type: String, enum: ["coordinator"], default: "coordinator" },
    status: { type: String, enum: ["active", "ended"], default: "active" },
    startedAt: { type: Date, default: () => new Date() },
    endedAt: { type: Date },
    audit: {
      approvedByUid: { type: String, required: true },
      approvedByEmail: { type: String },
      approvedAt: { type: Date, default: () => new Date() },
    },
    campaign: {
      name: { type: String },
      type: { type: String },
      district: { type: String },
      city: { type: String },
      location: { type: String },
    },
    coordinatorProfile: {
      fullName: { type: String },
      email: { type: String },
      phoneNumber: { type: String },
    },
    resourcesSnapshot: [
      {
        resourceId: { type: String, required: true },
        name: { type: String, required: true },
        unit: { type: String, required: true },
        targetQty: { type: Number },
      },
    ],
    stats: {
      progress: { overallPercent: { type: Number, default: 0 } },
      collections: {
        completed: { type: Number, default: 0 },
        target: { type: Number },
        byResource: [
          {
            resourceId: { type: String, required: true },
            name: { type: String, required: true },
            unit: { type: String, required: true },
            collectedQty: { type: Number, default: 0 },
            targetQty: { type: Number },
          },
        ],
      },
      distributions: {
        completed: { type: Number, default: 0 },
        target: { type: Number },
        byResource: [
          {
            resourceId: { type: String, required: true },
            name: { type: String, required: true },
            unit: { type: String, required: true },
            distributedQty: { type: Number, default: 0 },
            targetQty: { type: Number },
          },
        ],
      },
      tasks: {
        open: { type: Number, default: 0 },
        completed: { type: Number, default: 0 },
      },
    },
    relationIds: {
      recentCollectionLogIds: [{ type: String }],
      recentDistributionLogIds: [{ type: String }],
      recentTaskIds: [{ type: String }],
    },
    volunteers: [
      {
        volunteerId: { type: String, required: true },
        joinedAt: { type: Date, default: () => new Date() },
        leftAt: { type: Date },
        contribution: {
          collections: { type: Number, default: 0 },
          distributions: { type: Number, default: 0 },
          tasksCompleted: { type: Number, default: 0 },
        },
      },
    ],
  },
  { timestamps: true }
);

export default (mongoose.models.CoordinatorAssignment as any) ||
  mongoose.model<ICoordinatorAssignment>(
    "CoordinatorAssignment",
    CoordinatorAssignmentSchema
  );
