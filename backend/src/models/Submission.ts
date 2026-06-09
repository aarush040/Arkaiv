import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  size?: string;
  type: 'doc' | 'link';
  status: 'completed' | 'pending' | 'failed';
  taskName?: string;
  taskId?: string;
  selectedMissionId?: string;
  overallScore?: string;
  scores?: {
    understanding: number;
    conceptualClarity: number;
    execution: number;
    nepCompliance: number;
    careerRelevance: number;
    nepRubricScore?: number;
  };
  highestArea?: string;
  lackedArea?: string;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fileName: { type: String, required: true, trim: true },
    size: { type: String, trim: true },
    type: { type: String, enum: ['doc', 'link'], default: 'doc' },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'pending' },
    taskName: { type: String, trim: true },
    taskId: { type: String, trim: true },
    selectedMissionId: { type: String, trim: true },
    overallScore: { type: String, trim: true },
    scores: {
      understanding: { type: Number, default: 0 },
      conceptualClarity: { type: Number, default: 0 },
      execution: { type: Number, default: 0 },
      nepCompliance: { type: Number, default: 0 },
      careerRelevance: { type: Number, default: 0 },
      nepRubricScore: { type: Number, default: 0 },
    },
    highestArea: { type: String, trim: true },
    lackedArea: { type: String, trim: true },
    feedback: { type: String, trim: true },
  },
  { timestamps: true }
);

submissionSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<ISubmission>('Submission', submissionSchema);
