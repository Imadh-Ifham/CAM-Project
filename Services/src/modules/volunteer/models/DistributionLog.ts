import mongoose, { Document, Schema } from 'mongoose';

export interface IDistributionItem {
  type: string;
  quantity: number;
  unit?: string;
}

export interface IDistributionLog extends Document {
  campaignId: mongoose.Types.ObjectId;
  volunteerId: mongoose.Types.ObjectId;
  items: IDistributionItem[];
  beneficiaryName?: string;
  note?: string;
  createdAt: Date;
}

const DistributionItemSchema = new Schema<IDistributionItem>({
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String }
}, { _id: false });

const DistributionLogSchema = new Schema<IDistributionLog>({
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
  volunteerId: { type: Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  items: { type: [DistributionItemSchema], required: true },
  beneficiaryName: { type: String },
  note: { type: String },
  createdAt: { type: Date, default: () => new Date() }
});

export default mongoose.models.DistributionLog || mongoose.model<IDistributionLog>('DistributionLog', DistributionLogSchema);
