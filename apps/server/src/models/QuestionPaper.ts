import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
  number: number;
  text: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  marks: number;
  options?: string[];
}

export interface ISection {
  title: string;
  instruction: string;
  questionType: string;
  questions: IQuestion[];
}

export interface IAnswerKeyEntry {
  questionNumber: number;
  answer: string;
}

export interface IQuestionPaper extends Document {
  assignmentId: mongoose.Types.ObjectId;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  sections: ISection[];
  answerKey: IAnswerKeyEntry[];
  rawPrompt: string;
  createdAt: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    number: { type: Number, required: true },
    text: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['Easy', 'Moderate', 'Challenging'],
      required: true,
    },
    marks: { type: Number, required: true },
    options: { type: [String], default: undefined },
  },
  { _id: false },
);

const SectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questionType: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false },
);

const AnswerKeySchema = new Schema<IAnswerKeyEntry>(
  {
    questionNumber: { type: Number, required: true },
    answer: { type: String, required: true },
  },
  { _id: false },
);

const QuestionPaperSchema = new Schema<IQuestionPaper>(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
      required: true,
    },
    schoolName: { type: String, required: true },
    subject: { type: String, required: true },
    className: { type: String, required: true },
    timeAllowed: { type: String, required: true },
    maxMarks: { type: Number, required: true },
    sections: { type: [SectionSchema], required: true },
    answerKey: { type: [AnswerKeySchema], required: true },
    rawPrompt: { type: String, required: true },
  },
  { timestamps: true },
);

export const QuestionPaper = mongoose.model<IQuestionPaper>('QuestionPaper', QuestionPaperSchema);
