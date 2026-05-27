'use client';

import type { QuestionTypeRow as QuestionTypeRowType } from '@/store/createFormStore';

const QUESTION_TYPE_OPTIONS = [
  { value: 'MCQ', label: 'Multiple Choice Questions' },
  { value: 'Short', label: 'Short Questions' },
  { value: 'Diagram', label: 'Diagram/Graph-Based Questions' },
  { value: 'Numerical', label: 'Numerical Problems' },
] as const;

interface QuestionTypeRowProps {
  row: QuestionTypeRowType;
  onRemove: () => void;
  onUpdate: (field: keyof Omit<QuestionTypeRowType, 'id'>, value: string | number) => void;
  canRemove: boolean;
}

export function QuestionTypeRow({ row, onRemove, onUpdate, canRemove }: QuestionTypeRowProps) {
  return (
    <>
      {/* Desktop row — matches column headers */}
      <div className="hidden sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center gap-x-4 py-2 border-b border-[rgba(0,0,0,0.06)] last:border-b-0">
        {/* Type dropdown + remove */}
        <div className="flex items-center gap-2">
          <select
            value={row.type}
            onChange={(e) => onUpdate('type', e.target.value)}
            className="flex-1 rounded-full border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] px-4 py-2 text-sm text-[#303030] focus:border-[#FF5623] focus:outline-none focus:ring-1 focus:ring-[#FF5623] appearance-none cursor-pointer"
          >
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {canRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(0,0,0,0.1)] text-[#5E5E5E] hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Remove question type"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <div className="w-7 flex-shrink-0" />
          )}
        </div>

        {/* No. of Questions */}
        <div className="flex justify-center">
          <Counter
            value={row.count}
            min={1}
            max={50}
            onChange={(v) => onUpdate('count', v)}
            label="number of questions"
          />
        </div>

        {/* Marks */}
        <div className="flex justify-center">
          <Counter
            value={row.marksPerQuestion}
            min={1}
            max={20}
            onChange={(v) => onUpdate('marksPerQuestion', v)}
            label="marks per question"
          />
        </div>
      </div>

      {/* Mobile card */}
      <div className="sm:hidden rounded-2xl border border-[rgba(0,0,0,0.1)] bg-white p-3 space-y-3">
        {/* Header: type name + remove */}
        <div className="flex items-center justify-between gap-2">
          <select
            value={row.type}
            onChange={(e) => onUpdate('type', e.target.value)}
            className="flex-1 rounded-full border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] px-3 py-1.5 text-sm text-[#303030] focus:border-[#FF5623] focus:outline-none"
          >
            {QUESTION_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-[rgba(0,0,0,0.1)] text-[#5E5E5E] hover:bg-red-50 hover:text-red-500 transition-colors"
              aria-label="Remove"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5E5E5E]">No. of Questions</span>
          <Counter value={row.count} min={1} max={50} onChange={(v) => onUpdate('count', v)} label="number of questions" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5E5E5E]">Marks</span>
          <Counter value={row.marksPerQuestion} min={1} max={20} onChange={(v) => onUpdate('marksPerQuestion', v)} label="marks per question" />
        </div>
      </div>
    </>
  );
}

interface CounterProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
}

function Counter({ value, min, max, onChange, label }: CounterProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] text-base font-medium text-[#5E5E5E] hover:bg-gray-200 disabled:opacity-30 transition-colors"
        aria-label={`Decrease ${label}`}
      >
        −
      </button>
      <span className="w-7 text-center text-sm font-semibold text-[#303030]">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] text-base font-medium text-[#5E5E5E] hover:bg-gray-200 disabled:opacity-30 transition-colors"
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  );
}
