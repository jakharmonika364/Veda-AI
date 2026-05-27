import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  fileUrl: string | null;
  pastedText: string | null;
  schoolName: string | null;
  dueDate: Date;
  questionTypes: Array<{
    type: 'MCQ' | 'Short' | 'Diagram' | 'Numerical';
    count: number;
    marksPerQuestion: number;
  }>;
  additionalInfo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionTypeSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['MCQ', 'Short', 'Diagram', 'Numerical'],
      required: true,
    },
    count: { type: Number, required: true, min: 1 },
    marksPerQuestion: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, default: null },
    pastedText: { type: String, default: null },
    schoolName: { type: String, default: null },
    dueDate: { type: Date, required: true },
    questionTypes: { type: [QuestionTypeSchema], required: true },
    additionalInfo: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    jobId: { type: String, default: null },
  },
  { timestamps: true },
);

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);
