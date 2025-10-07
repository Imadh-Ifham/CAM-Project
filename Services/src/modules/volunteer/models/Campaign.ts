import mongoose, { Document, Schema } from "mongoose";

export interface IAssignedVolunteer {
  volunteerId: mongoose.Types.ObjectId;
  role?: "collecting" | "distributing";
}

export interface ICampaign extends Document {
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  goals?: any;
  assignedVolunteers: IAssignedVolunteer[];
  status: "active" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}

const AssignedVolunteerSchema = new Schema<IAssignedVolunteer>(
  {
    volunteerId: {
      type: Schema.Types.ObjectId,
      ref: "Volunteer",
      required: true,
    },
    role: { type: String, enum: ["collecting", "distributing"] },
  },
  { _id: false }
);

const DemoCampaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    goals: { type: Schema.Types.Mixed },
    assignedVolunteers: { type: [AssignedVolunteerSchema], default: [] },
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

export default (mongoose.models.DemoCampaign as mongoose.Model<ICampaign>) ||
  mongoose.model<ICampaign>("DemoCampaign", DemoCampaignSchema);
