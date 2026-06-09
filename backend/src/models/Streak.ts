import mongoose, { Document, Schema } from 'mongoose';

export interface IStreak extends Document {
  userId: mongoose.Types.ObjectId;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: Date;
  graceDaysUsed: number;
  graceDaysLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const streakSchema = new Schema<IStreak>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    graceDaysUsed: { type: Number, default: 0 },
    graceDaysLimit: { type: Number, default: 2 },
  },
  { timestamps: true }
);

export default mongoose.model<IStreak>('Streak', streakSchema);
