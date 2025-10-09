import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "admin"| "agent" | "volunteer";

export interface IUserBase {
  uid: string; // Firebase UID
  email: string;
  phoneNumber?: string;
  role: UserRole;
  fullName: string;
  status: "active" | "inactive";
  agentId?: string; // Human-friendly unique ID for agents (e.g., AGT-7F3K2C)
}

export interface IAgentProfile {
  organization?: string;
  experienceAndMotivation?: string;
}

export interface IVolunteerProfile {
  age?: number;
  skillsAndInterest?: string;
  availability?: string;
}

export interface IUserDocument extends Document, IUserBase {
  agentProfile?: IAgentProfile;
  volunteerProfile?: IVolunteerProfile;
  createdAt: Date;
  updatedAt: Date;
}

const AgentProfileSchema = new Schema<IAgentProfile>(
  {
    organization: { type: String },
    experienceAndMotivation: { type: String },
  },
  { _id: false }
);

const VolunteerProfileSchema = new Schema<IVolunteerProfile>(
  {
    age: { type: Number },
    skillsAndInterest: { type: String },
    availability: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    uid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phoneNumber: { type: String },
    role: { type: String, enum: ["admin", "agent", "volunteer"], required: true },
    fullName: { type: String, required: true },
    agentId: { type: String, unique: true, sparse: true, index: true },
    status: { 
      type: String, 
      enum: ["active", "inactive"], 
      default: "active" // ✅ new field
    },
    agentProfile: { type: AgentProfileSchema, required: false },
    volunteerProfile: { type: VolunteerProfileSchema, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);
