'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { AIResponseBanner } from '@/components/output/AIResponseBanner';
import { QuestionPaper } from '@/components/output/QuestionPaper';
import { Spinner } from '@/components/ui/Spinner';
import api from '@/lib/api';
import type { ApiAssignment, ApiQuestionPaper } from '@/types';

export default function AssignmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [assignment, setAssignment] = useState<ApiAssignment | null>(null);
  const [paper, setPaper] = useState<ApiQuestionPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [assignmentRes, paperRes] = await Promise.all([
          api.get<ApiAssignment>(`/api/assignments/${id}`),
          api.get<ApiQuestionPaper>(`/api/assignments/${id}/paper`),
        ]);
        setAssignment(assignmentRes.data);
        setPaper(paperRes.data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <TopBar title="Assignment" showBack />
        <main className="flex flex-1 items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" className="text-brand" />
            <p className="text-sm text-text-secondary">Loading question paper...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !paper || !assignment) {
    return (
      <>
        <TopBar title="Assignment" showBack />
        <main className="flex flex-1 items-center justify-center py-20 text-center px-4">
          <div>
            <p className="text-lg font-semibold text-text-primary">
              {assignment?.status === 'processing'
                ? 'Question paper is being generated...'
                : assignment?.status === 'failed'
                  ? 'Generation failed'
                  : 'Question paper not found'}
            </p>
            <p className="mt-2 text-sm text-text-secondary">
              {assignment?.status === 'processing'
                ? 'Check back in a moment.'
                : error ?? 'The question paper may still be generating.'}
            </p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar title={assignment.title} showBack />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 max-w-4xl mx-auto w-full">
        <AIResponseBanner
          assignmentId={id}
          schoolName={paper.schoolName}
          subject={paper.subject}
        />
        <QuestionPaper paper={paper} />
      </main>
    </>
  );
}
