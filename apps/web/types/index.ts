export type {
  Assignment,
  AssignmentStatus,
  QuestionType,
  QuestionPaper,
  Question,
  Section,
  AnswerKeyEntry,
  Difficulty,
  JobStatus,
  WsEvent,
  WsMessage,
  WsJobQueuedData,
  WsJobStartedData,
  WsJobProgressData,
  WsJobCompletedData,
  WsJobFailedData,
} from '@vedaai/shared';

export interface ApiAssignment {
  _id: string;
  title: string;
  fileUrl: string | null;
  dueDate: string;
  questionTypes: Array<{
    type: 'MCQ' | 'Short' | 'Diagram' | 'Numerical';
    count: number;
    marksPerQuestion: number;
  }>;
  additionalInfo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiQuestionPaper {
  _id: string;
  assignmentId: string;
  schoolName: string;
  subject: string;
  className: string;
  timeAllowed: string;
  maxMarks: number;
  sections: Array<{
    title: string;
    instruction: string;
    questionType: string;
    questions: Array<{
      number: number;
      text: string;
      difficulty: 'Easy' | 'Moderate' | 'Challenging';
      marks: number;
      options?: string[];
    }>;
  }>;
  answerKey: Array<{ questionNumber: number; answer: string }>;
  createdAt: string;
}

export interface CreateAssignmentPayload {
  dueDate: string;
  questionTypes: Array<{
    type: 'MCQ' | 'Short' | 'Diagram' | 'Numerical';
    count: number;
    marksPerQuestion: number;
  }>;
  additionalInfo: string;
  title?: string;
}

export interface JobProgressState {
  percent: number;
  message: string;
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
}
