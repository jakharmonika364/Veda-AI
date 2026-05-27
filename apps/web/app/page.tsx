'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/layout/TopBar';
import { AssignmentGrid } from '@/components/assignments/AssignmentGrid';
import { useAssignments } from '@/hooks/useAssignments';
import { useWebSocket } from '@/hooks/useWebSocket';
import api from '@/lib/api';
import type { ApiQuestionPaper, ApiAssignment } from '@/types';
import { QuestionPaper } from '@/components/output/QuestionPaper';
import { AIResponseBanner } from '@/components/output/AIResponseBanner';
import { Spinner } from '@/components/ui/Spinner';

export default function HomePage() {
  const router = useRouter();
  const { assignments, loading, fetchAssignments } = useAssignments();
  const [latestPaper, setLatestPaper] = useState<{ paper: ApiQuestionPaper; assignment: ApiAssignment } | null>(null);
  const [paperLoading, setPaperLoading] = useState(false);
  useWebSocket();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Load the most recently completed paper
  useEffect(() => {
    const latest = assignments.find((a) => a.status === 'completed');
    if (!latest) { setLatestPaper(null); return; }

    setPaperLoading(true);
    api.get<ApiQuestionPaper>(`/api/assignments/${latest._id}/paper`)
      .then((res) => setLatestPaper({ paper: res.data, assignment: latest }))
      .catch(() => setLatestPaper(null))
      .finally(() => setPaperLoading(false));
  }, [assignments]);

  const recentAssignments = assignments.slice(0, 6);

  return (
    <>
      <TopBar title="Home" />
      <main className="flex flex-1 flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto w-full">

        {/* Hero CTA — only when no assignments yet */}
        {!loading && assignments.length === 0 && (
          <div className="rounded-[32px] bg-white shadow-card p-8 flex flex-col items-center text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF5623]/10">
              <svg className="h-8 w-8 text-[#FF5623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#303030]">Create your first question paper</h2>
              <p className="mt-1 text-sm text-[#5E5E5E]">Upload study material or paste text and let AI generate a complete paper in seconds.</p>
            </div>
            <Link
              href="/create"
              className="flex items-center gap-2 rounded-full bg-[#181818] px-6 py-3 text-sm font-semibold text-white hover:bg-[#252525] transition-colors"
            >
              ✦ Create Assignment
            </Link>
          </div>
        )}

        {/* Latest generated paper */}
        {paperLoading && (
          <div className="flex items-center justify-center py-10">
            <Spinner size="lg" className="text-brand" />
          </div>
        )}

        {!paperLoading && latestPaper && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#303030]">Latest Paper</h2>
              <button
                onClick={() => router.push(`/assignments/${latestPaper.assignment._id}`)}
                className="text-sm font-medium text-[#FF5623] hover:underline"
              >
                View full page →
              </button>
            </div>
            <AIResponseBanner
              assignmentId={latestPaper.assignment._id}
              schoolName={latestPaper.paper.schoolName}
              subject={latestPaper.paper.subject}
            />
            <QuestionPaper paper={latestPaper.paper} />
          </div>
        )}

        {/* Recent assignments */}
        {recentAssignments.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#303030]">Recent Assignments</h2>
              <Link href="/assignments" className="text-sm font-medium text-[#FF5623] hover:underline">
                View all →
              </Link>
            </div>
            <AssignmentGrid assignments={recentAssignments} loading={loading} />
          </div>
        )}
      </main>
    </>
  );
}
