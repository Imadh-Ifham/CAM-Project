import mongoose, { Document, Schema } from "mongoose";

export type RequestStatus = "pending" | "approved" | "rejected" | "canceled";

export interface IAgentCampaignRequest extends Document {
  agentId: string; // references User.agentId or User.uid depending on client usage
  campaignId: string; // Campaign _id or campaignID; here we store Campaign _id as string
  status: RequestStatus;
  experience?: string;
  motivation?: string;
  availability?: string;
  agentSnapshot?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AgentCampaignRequestSchema = new Schema<IAgentCampaignRequest>(
  {
    agentId: { type: String, required: true, index: true },
    campaignId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "canceled"],
      default: "pending",
      index: true,
    },
    experience: { type: String, trim: true, maxlength: 1000 },
    motivation: { type: String, trim: true, maxlength: 1000 },
    availability: { type: String, trim: true, maxlength: 500 },
    agentSnapshot: {
      name: { type: String },
      phone: { type: String },
      email: { type: String },
    },
  },
  { timestamps: true }
);

AgentCampaignRequestSchema.index(
  { agentId: 1, campaignId: 1 },
  { unique: true }
);
AgentCampaignRequestSchema.index({ campaignId: 1, status: 1 });

export default mongoose.models.AgentCampaignRequest ||
  mongoose.model<IAgentCampaignRequest>(
    "AgentCampaignRequest",
    AgentCampaignRequestSchema
  );
