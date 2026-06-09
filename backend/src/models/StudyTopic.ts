import mongoose, { Document, Schema } from 'mongoose';

export interface IStudyTopic extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  subject?: string;
  level?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  resources?: Array<{
    title: string;
    url?: string;
    type: 'article' | 'video' | 'course' | 'book';
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const studyTopicSchema = new Schema<IStudyTopic>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    subject: { type: String, trim: true },
    level: { type: String, trim: true },
    status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    resources: {
      type: [
        {
          title: { type: String },
          url: { type: String },
          type: { type: String, enum: ['article', 'video', 'course', 'book'] },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IStudyTopic>('StudyTopic', studyTopicSchema);
