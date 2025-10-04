import mongoose, { Document, Schema } from 'mongoose';

export interface IItem {
  type: string;
  quantity: number;
  unit?: string;
}

export interface ICollectionLog extends Document {
  campaignId: mongoose.Types.ObjectId;
  volunteerId: mongoose.Types.ObjectId;
  items: IItem[];
  note?: string;
  createdAt: Date;
}

const ItemSchema = new Schema<IItem>({
  type: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String }
}, { _id: false });

const CollectionLogSchema = new Schema<ICollectionLog>({
  campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
  volunteerId: { type: Schema.Types.ObjectId, ref: 'Volunteer', required: true },
  items: { type: [ItemSchema], required: true },
  note: { type: String },
  createdAt: { type: Date, default: () => new Date() }
});

export default mongoose.models.CollectionLog || mongoose.model<ICollectionLog>('CollectionLog', CollectionLogSchema);
