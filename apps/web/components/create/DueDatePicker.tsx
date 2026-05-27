'use client';

import { useRef } from 'react';

interface DueDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary" htmlFor="due-date">
        Due Date
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id="due-date"
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full rounded-[100px] border border-[rgba(0,0,0,0.12)] bg-white px-4 py-2.5 pr-12 text-sm text-text-primary focus:border-[#FF5623] focus:outline-none focus:ring-1 focus:ring-[#FF5623] transition-colors h-[44px]"
          required
        />
        <button
          type="button"
          onClick={() => inputRef.current?.showPicker?.()}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Open calendar"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
