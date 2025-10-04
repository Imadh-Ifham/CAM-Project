import mongoose, { Document, Schema } from 'mongoose';

export type CampaignStatus = 'active' | 'completed';
export type VolunteerRole = 'collecting' | 'distributing';

export interface IGoals {
  riceKg?: number;
  clothesKg?: number;
  cashLKR?: number;
}

export interface IAssignedVolunteer {
  volunteerId: mongoose.Types.ObjectId;
  role?: VolunteerRole;
}

export interface ICampaign extends Document {
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  goals?: IGoals;
  status: CampaignStatus;
  assignedVolunteers: IAssignedVolunteer[];
  collectedTotals?: IGoals;
  distributedTotals?: IGoals;
  createdAt: Date;
}

const GoalsSchema = new Schema<IGoals>({
  riceKg: { type: Number, default: 0 },
  clothesKg: { type: Number, default: 0 },
  cashLKR: { type: Number, default: 0 },
}, { _id: false });

const AssignedVolunteerSchema = new Schema<IAssignedVolunteer>({
  volunteerId: { type: Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  role: { type: String, enum: ['collecting', 'distributing'] }
}, { _id: false });

const CampaignSchema = new Schema<ICampaign>({
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  goals: { type: GoalsSchema, default: {} },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  assignedVolunteers: { type: [AssignedVolunteerSchema], default: [] },
  collectedTotals: { type: GoalsSchema, default: {} },
  distributedTotals: { type: GoalsSchema, default: {} },
  createdAt: { type: Date, default: () => new Date() }
});

export default mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
