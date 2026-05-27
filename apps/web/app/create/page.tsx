'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { TopBar } from '@/components/layout/TopBar';
import { FileUpload } from '@/components/create/FileUpload';
import { DueDatePicker } from '@/components/create/DueDatePicker';
import { QuestionTypeList } from '@/components/create/QuestionTypeList';
import { AdditionalInfo } from '@/components/create/AdditionalInfo';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useCreateFormStore } from '@/store/createFormStore';
import { useUserSettingsStore } from '@/store/userSettingsStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import api from '@/lib/api';

type SourceTab = 'file' | 'paste';

export default function CreatePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [sourceTab, setSourceTab] = useState<SourceTab>('file');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const title = useCreateFormStore((s) => s.title);
  const file = useCreateFormStore((s) => s.file);
  const pastedText = useCreateFormStore((s) => s.pastedText);
  const dueDate = useCreateFormStore((s) => s.dueDate);
  const questionTypes = useCreateFormStore((s) => s.questionTypes);
  const additionalInfo = useCreateFormStore((s) => s.additionalInfo);
  const assignmentId = useCreateFormStore((s) => s.assignmentId);
  const jobProgress = useCreateFormStore((s) => s.jobProgress);
  const setTitle = useCreateFormStore((s) => s.setTitle);
  const setFile = useCreateFormStore((s) => s.setFile);
  const setPastedText = useCreateFormStore((s) => s.setPastedText);
  const setDueDate = useCreateFormStore((s) => s.setDueDate);
  const setAdditionalInfo = useCreateFormStore((s) => s.setAdditionalInfo);
  const setJobId = useCreateFormStore((s) => s.setJobId);
  const setAssignmentId = useCreateFormStore((s) => s.setAssignmentId);
  const setJobProgress = useCreateFormStore((s) => s.setJobProgress);
  const reset = useCreateFormStore((s) => s.reset);

  const { subscribe, connected } = useWebSocket();
  const schoolName = useUserSettingsStore((s) => s.schoolName);

  // Always start fresh when the create page is opened
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fill title from filename when a new file is selected
  useEffect(() => {
    if (file) {
      const name = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(name);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  // Poll as WebSocket fallback
  useEffect(() => {
    const isActive = jobProgress.status === 'queued' || jobProgress.status === 'processing';
    if (!assignmentId || !isActive) {
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
      return;
    }
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await api.get<{ status: string }>(`/api/assignments/${assignmentId}`);
        if (data.status === 'completed') {
          setJobProgress({ status: 'completed', percent: 100, message: 'Done!' });
        } else if (data.status === 'failed') {
          setJobProgress({ status: 'failed', percent: 0, message: 'Generation failed.' });
        } else if (data.status === 'processing') {
          setJobProgress({ status: 'processing', percent: 50, message: 'Generating questions with AI...' });
        }
      } catch { /* ignore */ }
    }, 3000);
    return () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };
  }, [assignmentId, jobProgress.status, setJobProgress]);

  // Navigate when completed
  useEffect(() => {
    if (jobProgress.status === 'completed' && assignmentId) {
      router.push(`/assignments/${assignmentId}`);
    }
  }, [jobProgress.status, assignmentId, router]);

  async function handleSubmit() {
    if (questionTypes.length === 0) {
      toast.error('Add at least one question type');
      return;
    }
    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }
    if (sourceTab === 'paste' && !pastedText.trim()) {
      toast.error('Please paste some text or switch to file upload');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      if (sourceTab === 'file' && file) {
        formData.append('file', file);
      }
      if (sourceTab === 'paste' && pastedText.trim()) {
        formData.append('pastedText', pastedText.trim());
      }
      if (title.trim()) formData.append('title', title.trim());
      if (schoolName.trim()) formData.append('schoolName', schoolName.trim());
      formData.append('dueDate', new Date(dueDate).toISOString());
      formData.append(
        'questionTypes',
        JSON.stringify(
          questionTypes.map(({ type, count, marksPerQuestion }) => ({ type, count, marksPerQuestion })),
        ),
      );
      formData.append('additionalInfo', additionalInfo);

      const { data } = await api.post<{ assignmentId: string; jobId: string }>(
        '/api/assignments',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      setAssignmentId(data.assignmentId);
      setJobId(data.jobId);
      setJobProgress({ status: 'queued', percent: 0, message: 'Queued for generation...' });

      if (connected) subscribe(data.assignmentId);
    } catch (err) {
      toast.error((err as Error).message);
      setSubmitting(false);
    }
  }

  const isGenerating = jobProgress.status === 'queued' || jobProgress.status === 'processing';

  return (
    <>
      <TopBar title="Create Assignment" showBack />
      <main className="flex flex-1 flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <div className="rounded-[32px] bg-white p-6 sm:p-8 shadow-card space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-xl font-bold text-text-primary">Assignment Details</h2>
              <p className="mt-1 text-sm text-text-secondary">Basic information about your assignment</p>
            </div>

            {/* Paper title */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-text-primary" htmlFor="paper-title">
                Paper Title
              </label>
              <input
                id="paper-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 5 — Pandas & NumPy"
                className="w-full rounded-full border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] px-4 py-2.5 text-sm text-[#303030] placeholder-[#9e9e9e] focus:border-[#FF5623] focus:outline-none focus:ring-1 focus:ring-[#FF5623]"
              />
            </div>

            {/* Source material — tab switcher */}
            <div className="space-y-3">
              <div className="flex items-center gap-1 rounded-full bg-[#f0f0f0] p-1 w-fit">
                <button
                  type="button"
                  onClick={() => setSourceTab('file')}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    sourceTab === 'file'
                      ? 'bg-white text-[#303030] shadow-sm'
                      : 'text-[#5E5E5E] hover:text-[#303030]'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setSourceTab('paste')}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    sourceTab === 'paste'
                      ? 'bg-white text-[#303030] shadow-sm'
                      : 'text-[#5E5E5E] hover:text-[#303030]'
                  }`}
                >
                  Paste Text
                </button>
              </div>

              {sourceTab === 'file' ? (
                <FileUpload file={file} onChange={setFile} />
              ) : (
                <div className="space-y-1.5">
                  <p className="text-xs text-[#5E5E5E]">Paste your study material, chapter notes, or any text content</p>
                  <textarea
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste your text here — chapter content, notes, syllabus, or any material you want questions generated from..."
                    rows={10}
                    className="w-full rounded-[20px] border border-[rgba(0,0,0,0.12)] bg-[#f5f5f5] px-4 py-3 text-sm text-[#303030] placeholder-[#9e9e9e] resize-none focus:border-[#FF5623] focus:outline-none focus:ring-1 focus:ring-[#FF5623]"
                  />
                  {pastedText.length > 0 && (
                    <p className="text-right text-xs text-[#5E5E5E]">
                      {pastedText.length.toLocaleString()} characters
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Due date */}
            <DueDatePicker value={dueDate} onChange={setDueDate} />

            {/* Question types */}
            <QuestionTypeList />

            {/* Additional info */}
            <AdditionalInfo value={additionalInfo} onChange={setAdditionalInfo} />

            {/* Generation progress */}
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl bg-[#f5f5f5] p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Spinner size="sm" className="text-brand" />
                    <p className="text-sm font-medium text-text-primary">
                      {jobProgress.message || 'Generating question paper...'}
                    </p>
                    <span className="ml-auto text-sm font-semibold text-brand">
                      {jobProgress.percent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      className="h-full rounded-full bg-brand"
                      animate={{ width: `${jobProgress.percent}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                  {!connected && (
                    <p className="text-xs text-text-secondary">Polling for updates...</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Failed state */}
            {jobProgress.status === 'failed' && (
              <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-700">
                  Generation failed: {jobProgress.message}. Please try again.
                </p>
                <button
                  onClick={() => { reset(); setSubmitting(false); }}
                  className="mt-2 text-sm font-medium text-red-700 underline"
                >
                  Start over
                </button>
              </div>
            )}

            {/* Actions */}
            {!isGenerating && jobProgress.status !== 'failed' && (
              <div className="flex items-center justify-between pt-2">
                <Button variant="ghost" onClick={() => router.back()}>
                  ← Back
                </Button>
                <Button onClick={handleSubmit} loading={submitting}>
                  ✦ Generate Paper
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
