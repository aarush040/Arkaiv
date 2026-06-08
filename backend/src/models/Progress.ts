import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  goal?: string;
  level?: string;
  commitment?: number;
  duration?: number;
  marksheetUploaded: boolean;
  marksheetName?: string;
  streak: number;
  xp: number;
  overallProgress: number;
  createdAt: Date;
  updatedAt: Date;
}

const progressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    goal: { type: String, trim: true },
    level: { type: String, trim: true },
    commitment: { type: Number },
    duration: { type: Number },
    marksheetUploaded: { type: Boolean, default: false },
    marksheetName: { type: String },
    streak: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

export default mongoose.model<IProgress>('Progress', progressSchema);