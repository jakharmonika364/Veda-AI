import { create } from 'zustand';

export interface QuestionTypeRow {
  id: string;
  type: 'MCQ' | 'Short' | 'Diagram' | 'Numerical';
  count: number;
  marksPerQuestion: number;
}

export interface JobProgressState {
  percent: number;
  message: string;
  status: 'idle' | 'queued' | 'processing' | 'completed' | 'failed';
}

interface CreateFormState {
  title: string;
  file: File | null;
  pastedText: string;
  dueDate: string;
  questionTypes: QuestionTypeRow[];
  additionalInfo: string;
  jobId: string | null;
  assignmentId: string | null;
  jobProgress: JobProgressState;

  setTitle: (title: string) => void;
  setFile: (file: File | null) => void;
  setPastedText: (text: string) => void;
  setDueDate: (date: string) => void;
  addQuestionType: () => void;
  removeQuestionType: (id: string) => void;
  updateQuestionType: (id: string, field: keyof Omit<QuestionTypeRow, 'id'>, value: string | number) => void;
  setAdditionalInfo: (info: string) => void;
  setJobId: (jobId: string) => void;
  setAssignmentId: (id: string) => void;
  setJobProgress: (progress: Partial<JobProgressState>) => void;
  reset: () => void;
}

const defaultJobProgress: JobProgressState = {
  percent: 0,
  message: '',
  status: 'idle',
};

const defaultQuestionType = (): QuestionTypeRow => ({
  id: Math.random().toString(36).slice(2),
  type: 'MCQ',
  count: 5,
  marksPerQuestion: 2,
});

export const useCreateFormStore = create<CreateFormState>((set) => ({
  title: '',
  file: null,
  pastedText: '',
  dueDate: '',
  questionTypes: [defaultQuestionType()],
  additionalInfo: '',
  jobId: null,
  assignmentId: null,
  jobProgress: defaultJobProgress,

  setTitle: (title) => set({ title }),
  setFile: (file) => set({ file }),
  setPastedText: (pastedText) => set({ pastedText }),
  setDueDate: (dueDate) => set({ dueDate }),

  addQuestionType: () =>
    set((s) => ({
      questionTypes: [...s.questionTypes, defaultQuestionType()],
    })),

  removeQuestionType: (id) =>
    set((s) => ({
      questionTypes: s.questionTypes.filter((qt) => qt.id !== id),
    })),

  updateQuestionType: (id, field, value) =>
    set((s) => ({
      questionTypes: s.questionTypes.map((qt) =>
        qt.id === id ? { ...qt, [field]: value } : qt,
      ),
    })),

  setAdditionalInfo: (additionalInfo) => set({ additionalInfo }),
  setJobId: (jobId) => set({ jobId }),
  setAssignmentId: (assignmentId) => set({ assignmentId }),

  setJobProgress: (progress) =>
    set((s) => ({ jobProgress: { ...s.jobProgress, ...progress } })),

  reset: () =>
    set({
      title: '',
      file: null,
      pastedText: '',
      dueDate: '',
      questionTypes: [defaultQuestionType()],
      additionalInfo: '',
      jobId: null,
      assignmentId: null,
      jobProgress: defaultJobProgress,
    }),
}));
