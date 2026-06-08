import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface IQuiz extends Document {
  topicId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: IQuestion[];
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
});

const QuizSchema = new Schema<IQuiz>(
  {
    topicId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    questions: [QuestionSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>('Quiz', QuizSchema);