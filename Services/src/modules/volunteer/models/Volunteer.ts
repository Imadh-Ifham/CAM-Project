import mongoose, { Document, Schema } from "mongoose";

export type PreferredType = "collecting" | "distributing";

export interface IVolunteer extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  preferredType?: PreferredType;
  assignedCampaigns: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  phone: { type: String },
  preferredType: {
    type: String,
    enum: ["collection", "distribution", "both"],
    default: "both",
  },
  assignedCampaigns: [{ type: Schema.Types.ObjectId, ref: "Campaign" }],
  createdAt: { type: Date, default: () => new Date() },
});

export default (mongoose.models.Volunteer as mongoose.Model<IVolunteer>) ||
  mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
