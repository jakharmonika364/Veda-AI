'use client';

import { useCreateFormStore } from '@/store/createFormStore';
import { QuestionTypeRow } from './QuestionTypeRow';

export function QuestionTypeList() {
  const questionTypes = useCreateFormStore((s) => s.questionTypes);
  const addQuestionType = useCreateFormStore((s) => s.addQuestionType);
  const removeQuestionType = useCreateFormStore((s) => s.removeQuestionType);
  const updateQuestionType = useCreateFormStore((s) => s.updateQuestionType);

  const totalQuestions = questionTypes.reduce((s, qt) => s + qt.count, 0);
  const totalMarks = questionTypes.reduce((s, qt) => s + qt.count * qt.marksPerQuestion, 0);

  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-text-primary">Question Type</label>

      {/* Table — desktop only */}
      <div className="hidden sm:block rounded-2xl border border-[rgba(0,0,0,0.1)] overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 bg-[#f9f9f9] border-b border-[rgba(0,0,0,0.08)] px-4 py-2.5">
          <span className="text-xs font-semibold text-[#5E5E5E] uppercase tracking-wide">Question Type</span>
          <span className="text-xs font-semibold text-[#5E5E5E] uppercase tracking-wide w-[88px] text-center">No. of Questions</span>
          <span className="text-xs font-semibold text-[#5E5E5E] uppercase tracking-wide w-[88px] text-center">Marks</span>
        </div>

        {/* Rows */}
        <div className="px-4 divide-y divide-[rgba(0,0,0,0.06)]">
          {questionTypes.map((row) => (
            <QuestionTypeRow
              key={row.id}
              row={row}
              canRemove={questionTypes.length > 1}
              onRemove={() => removeQuestionType(row.id)}
              onUpdate={(field, value) => updateQuestionType(row.id, field, value)}
            />
          ))}
        </div>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-2">
        {questionTypes.map((row) => (
          <QuestionTypeRow
            key={row.id}
            row={row}
            canRemove={questionTypes.length > 1}
            onRemove={() => removeQuestionType(row.id)}
            onUpdate={(field, value) => updateQuestionType(row.id, field, value)}
          />
        ))}
      </div>

      {/* Add button */}
      <button
        type="button"
        onClick={addQuestionType}
        disabled={questionTypes.length >= 4}
        className="flex items-center gap-2 text-sm font-medium text-[#5E5E5E] hover:text-[#303030] disabled:opacity-40 transition-colors"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#181818] text-white text-sm leading-none">
          +
        </span>
        Add Question Type
      </button>

      {/* Totals */}
      <div className="flex justify-end gap-6 rounded-2xl bg-[#f5f5f5] px-4 py-2.5 text-sm">
        <span>
          <span className="text-[#5E5E5E]">Total Questions:</span>{' '}
          <span className="font-semibold text-[#303030]">{totalQuestions}</span>
        </span>
        <span>
          <span className="text-[#5E5E5E]">Total Marks:</span>{' '}
          <span className="font-semibold text-[#303030]">{totalMarks}</span>
        </span>
      </div>
    </div>
  );
}
