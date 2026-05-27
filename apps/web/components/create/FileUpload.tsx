'use client';

import { useRef, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  file: File | null;
  onChange: (file: File | null) => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function isTextFile(f: File) {
  return f.type === 'text/plain' || f.name.endsWith('.txt');
}

function FileIcon({ file }: { file: File }) {
  if (isTextFile(file)) {
    return (
      <svg className="h-8 w-8 flex-shrink-0 text-[#FF5623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z" />
      </svg>
    );
  }
  return (
    <svg className="h-8 w-8 flex-shrink-0 text-[#FF5623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2 1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
    </svg>
  );
}

export function FileUpload({ file, onChange }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  function validate(f: File): string | null {
    if (!ACCEPTED_TYPES.includes(f.type) && !f.name.endsWith('.txt')) {
      return 'Only JPEG, PNG, and TXT files are supported.';
    }
    if (f.size > MAX_SIZE) return 'File must be under 10MB.';
    return null;
  }

  const handleFile = useCallback(
    (f: File) => {
      const err = validate(f);
      if (err) { setError(err); return; }
      setError(null);
      onChange(f);
    },
    [onChange],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[#5E5E5E]">Upload study material (image or text file)</p>

      {file ? (
        <div className="flex items-center gap-3 rounded-[24px] border border-[rgba(0,0,0,0.12)] bg-white p-4">
          <FileIcon file={file} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#303030]">{file.name}</p>
            <p className="text-xs text-[#5E5E5E]">
              {isTextFile(file) ? 'Text file' : 'Image'} · {(file.size / 1024).toFixed(0)} KB
            </p>
          </div>
          <button
            onClick={() => onChange(null)}
            className="flex h-6 w-6 items-center justify-center rounded-full text-[#5E5E5E] hover:bg-gray-100 transition-colors"
            aria-label="Remove file"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center gap-3 rounded-[24px] border-[1.75px] border-dashed p-8 transition-colors bg-white',
            dragging
              ? 'border-[#FF5623] bg-[#FF5623]/5'
              : 'border-[rgba(0,0,0,0.2)] hover:border-[rgba(0,0,0,0.3)]',
          )}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          aria-label="Upload file"
        >
          <svg className="h-10 w-10 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6L16 6a5 5 0 0 1 1 9.9M15 13l-3-3m0 0-3 3m3-3v12" />
          </svg>
          <div className="text-center">
            <p className="text-sm font-medium text-[#303030]">
              Choose a file or drag & drop it here
            </p>
            <p className="mt-1 text-xs text-[#5E5E5E]">JPEG, PNG, TXT · up to 10MB</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            className="rounded-[100px] border border-[rgba(0,0,0,0.15)] bg-white px-4 py-1.5 text-sm font-medium text-[#303030] hover:bg-gray-50 transition-colors"
          >
            Browse Files
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,.txt,text/plain"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}
