'use client';

interface AdditionalInfoProps {
  value: string;
  onChange: (value: string) => void;
}

export function AdditionalInfo({ value, onChange }: AdditionalInfoProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary" htmlFor="additional-info">
        Additional Information
      </label>
      <div className="relative">
        <textarea
          id="additional-info"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="E.g. Focus on chapters 5-8, include real-world application questions, avoid lengthy calculations..."
          rows={4}
          maxLength={1000}
          className="w-full resize-none rounded-[16px] border border-[rgba(0,0,0,0.12)] bg-white px-4 py-3 pb-8 text-sm text-text-primary placeholder:text-text-secondary focus:border-[#FF5623] focus:outline-none focus:ring-1 focus:ring-[#FF5623] transition-colors"
        />
        {/* Mic icon */}
        <button
          type="button"
          className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 transition-colors"
          aria-label="Voice input"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
          </svg>
        </button>
      </div>
      <p className="text-right text-xs text-text-secondary">{value.length}/1000</p>
    </div>
  );
}
