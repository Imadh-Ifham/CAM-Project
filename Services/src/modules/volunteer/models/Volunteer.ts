import mongoose, { Document, Schema } from "mongoose";

export type PreferredType = "collecting" | "distributing";

export interface IVolunteer extends Document {
  fullName: string;
  age?: number;
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  preferredType?: PreferredType;
  skillsAndInterest?: string;
  availability?: string;
  assignedCampaigns: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>({
  fullName: { type: String, required: true },
  age: { type: Number },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  phoneNumber: { type: String },
  preferredType: { type: String, enum: ["collecting", "distributing"] },
  skillsAndInterest: { type: String },
  availability: { type: String },
  assignedCampaigns: [{ type: Schema.Types.ObjectId, ref: "Campaign" }],
  createdAt: { type: Date, default: () => new Date() },
});

export default (mongoose.models.Volunteer as mongoose.Model<IVolunteer>) ||
  mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
