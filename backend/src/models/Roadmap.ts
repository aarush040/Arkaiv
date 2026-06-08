import mongoose, { Document, Schema } from 'mongoose';

export interface IRoadmapStep {
  title: string;
  description: string;
  duration?: string;
  completed: boolean;
  order: number;
}

export interface IRoadmap extends Document {
  userId: mongoose.Types.ObjectId;
  goal: string;
  level?: string;
  commitment?: number;
  duration?: number;
  progress: number;
  steps: IRoadmapStep[];
  createdAt: Date;
  updatedAt: Date;
}

const stepSchema = new Schema<IRoadmapStep>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    duration: { type: String },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const roadmapSchema = new Schema<IRoadmap>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    goal: { type: String, required: true, trim: true },
    level: { type: String, trim: true },
    commitment: { type: Number },
    duration: { type: Number },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    steps: { type: [stepSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<IRoadmap>('Roadmap', roadmapSchema);