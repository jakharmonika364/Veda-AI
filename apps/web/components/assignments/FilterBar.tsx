'use client';

import { useCallback, useRef } from 'react';

interface FilterBarProps {
  search: string;
  onSearch: (value: string) => void;
}

export function FilterBar({ search, onSearch }: FilterBarProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onSearch(val), 300);
    },
    [onSearch],
  );

  return (
    <div className="flex items-center justify-between gap-4 rounded-[16px] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      {/* Filter label */}
      <div className="flex items-center gap-2 text-sm text-[#5E5E5E]">
        <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h2" />
        </svg>
        <span className="font-medium tracking-tight">Filter By</span>
      </div>

      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5E5E5E] pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          defaultValue={search}
          onChange={handleChange}
          placeholder="Search assignments..."
          className="w-full rounded-[100px] border border-[rgba(0,0,0,0.12)] bg-[#f9f9f9] py-2 pl-9 pr-4 text-sm text-[#303030] placeholder:text-[#5E5E5E] focus:border-[#FF5623] focus:outline-none focus:ring-1 focus:ring-[#FF5623] transition-colors"
        />
      </div>
    </div>
  );
}
