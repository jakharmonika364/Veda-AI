'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface AIResponseBannerProps {
  assignmentId: string;
  schoolName: string;
  subject: string;
}

export function AIResponseBanner({ assignmentId, schoolName, subject }: AIResponseBannerProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      await api.post(`/api/assignments/${assignmentId}/pdf`);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/uploads/pdfs/${assignmentId}.pdf`;
      const link = document.createElement('a');
      link.href = url;
      link.download = `question-paper-${assignmentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('PDF downloaded successfully');
    } catch {
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-[32px] bg-[#5e5e5e] p-2">
      <div className="rounded-[24px] bg-[rgba(24,24,24,0.8)] backdrop-blur-sm px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#FF5623]/20">
              <svg className="h-4 w-4 text-[#FF7950]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white/90 leading-relaxed tracking-tight">
                Here is your customized Question Paper for{' '}
                <span className="font-semibold text-white">{subject}</span> —{' '}
                <span className="font-semibold text-white">{schoolName}</span>. Review it below and download as PDF when ready.
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={loading}
            className="flex flex-shrink-0 items-center gap-2 rounded-[100px] border-[1.5px] border-[rgba(255,255,255,0.5)] bg-[#181818] px-4 py-2 text-sm font-medium text-white hover:bg-[#252525] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Spinner size="sm" className="text-white" />
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" />
              </svg>
            )}
            Download as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
