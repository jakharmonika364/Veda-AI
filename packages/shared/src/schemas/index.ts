import { z } from 'zod';

// ─── Question Types ───────────────────────────────────────────────────────────

export const QuestionTypeEnum = z.enum([
  'MCQ',
  'Short',
  'Diagram',
  'Numerical',
]);

export const QuestionTypeSchema = z.object({
  type: QuestionTypeEnum,
  count: z.number().int().min(1).max(50),
  marksPerQuestion: z.number().int().min(1).max(20),
});

export type QuestionType = z.infer<typeof QuestionTypeSchema>;

// ─── Assignment ───────────────────────────────────────────────────────────────

export const AssignmentStatusEnum = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
]);

export const AssignmentSchema = z.object({
  _id: z.string(),
  title: z.string(),
  fileUrl: z.string().nullable(),
  dueDate: z.string().datetime(),
  questionTypes: z.array(QuestionTypeSchema),
  additionalInfo: z.string(),
  status: AssignmentStatusEnum,
  jobId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Assignment = z.infer<typeof AssignmentSchema>;

// ─── Create Assignment Input ──────────────────────────────────────────────────

export const CreateAssignmentInputSchema = z.object({
  dueDate: z.string().datetime(),
  questionTypes: z.array(QuestionTypeSchema).min(1, 'At least one question type required'),
  additionalInfo: z.string().max(1000),
  title: z.string().optional(),
});

export type CreateAssignmentInput = z.infer<typeof CreateAssignmentInputSchema>;

// ─── Question Paper ───────────────────────────────────────────────────────────

export const DifficultyEnum = z.enum(['Easy', 'Moderate', 'Challenging']);

export const QuestionSchema = z.object({
  number: z.number().int().min(1),
  text: z.string().min(1),
  difficulty: DifficultyEnum,
  marks: z.number().int().min(1),
  options: z.array(z.string()).optional(), // MCQ only — 4 answer choices
});

export const SectionSchema = z.object({
  title: z.string(),
  instruction: z.string(),
  questionType: z.string(),
  questions: z.array(QuestionSchema),
});

export const AnswerKeyEntrySchema = z.object({
  questionNumber: z.number().int().min(1),
  answer: z.string(),
});

export const QuestionPaperSchema = z.object({
  _id: z.string(),
  assignmentId: z.string(),
  schoolName: z.string(),
  subject: z.string(),
  className: z.string(),
  timeAllowed: z.string(),
  maxMarks: z.number().int().min(1),
  sections: z.array(SectionSchema),
  answerKey: z.array(AnswerKeyEntrySchema),
  createdAt: z.string().datetime(),
});

export type Question = z.infer<typeof QuestionSchema>;
export type Section = z.infer<typeof SectionSchema>;
export type AnswerKeyEntry = z.infer<typeof AnswerKeyEntrySchema>;
export type QuestionPaper = z.infer<typeof QuestionPaperSchema>;
export type Difficulty = z.infer<typeof DifficultyEnum>;
export type AssignmentStatus = z.infer<typeof AssignmentStatusEnum>;

// ─── LLM Output (raw, before saving) ─────────────────────────────────────────

export const LLMQuestionPaperOutputSchema = z.object({
  schoolName: z.string(),
  subject: z.string(),
  className: z.string(),
  timeAllowed: z.string(),
  maxMarks: z.number().int().min(1),
  sections: z.array(SectionSchema),
  answerKey: z.array(AnswerKeyEntrySchema),
});

export type LLMQuestionPaperOutput = z.infer<typeof LLMQuestionPaperOutputSchema>;

// ─── Job Status ───────────────────────────────────────────────────────────────

export const JobStatusEnum = z.enum([
  'waiting',
  'active',
  'completed',
  'failed',
  'delayed',
]);

export const JobStatusSchema = z.object({
  jobId: z.string(),
  assignmentId: z.string(),
  status: JobStatusEnum,
  percent: z.number().min(0).max(100),
  message: z.string().optional(),
  paperId: z.string().optional(),
  error: z.string().optional(),
});

export type JobStatus = z.infer<typeof JobStatusSchema>;

// ─── WebSocket Events ─────────────────────────────────────────────────────────

export const WsEventEnum = z.enum([
  'job:queued',
  'job:started',
  'job:progress',
  'job:completed',
  'job:failed',
]);

export type WsEvent = z.infer<typeof WsEventEnum>;

export interface WsMessage<T = unknown> {
  event: WsEvent;
  data: T;
}

export interface WsJobQueuedData {
  assignmentId: string;
  jobId: string;
  position: number;
}

export interface WsJobStartedData {
  assignmentId: string;
  jobId: string;
}

export interface WsJobProgressData {
  assignmentId: string;
  jobId: string;
  percent: number;
  message: string;
}

export interface WsJobCompletedData {
  assignmentId: string;
  jobId: string;
  paperId: string;
}

export interface WsJobFailedData {
  assignmentId: string;
  jobId: string;
  error: string;
}
