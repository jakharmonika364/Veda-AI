'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TopBar } from '@/components/layout/TopBar';
import { EmptyState } from '@/components/assignments/EmptyState';
import { FilterBar } from '@/components/assignments/FilterBar';
import { AssignmentGrid } from '@/components/assignments/AssignmentGrid';
import { useAssignments } from '@/hooks/useAssignments';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function AssignmentsPage() {
  const { assignments, loading, fetchAssignments } = useAssignments();
  const [search, setSearch] = useState('');
  useWebSocket();

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()),
  );

  const hasAssignments = assignments.length > 0;

  return (
    <>
      <TopBar
        title="Assignments"
        subtitle={hasAssignments ? 'Manage and create assignments for your classes.' : undefined}
        showGreenDot={hasAssignments}
      />

      <main className="flex flex-1 flex-col">
        {!loading && !hasAssignments ? (
          <EmptyState />
        ) : (
          <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
            <FilterBar search={search} onSearch={setSearch} />
            {filtered.length === 0 && !loading ? (
              <div className="flex flex-1 items-center justify-center py-16 text-center">
                <div>
                  <p className="text-lg font-semibold text-text-primary">No results found</p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Try a different search term.
                  </p>
                </div>
              </div>
            ) : (
              <AssignmentGrid assignments={filtered} loading={loading} />
            )}
          </div>
        )}
      </main>

      {/* Sticky create button — desktop */}
      <div className="hidden lg:flex fixed bottom-0 inset-x-0 justify-center pointer-events-none">
        {/* Blur + gradient backdrop */}
        <div className="absolute left-0 lg:left-[304px] right-0 bottom-0 h-28 bg-gradient-to-t from-[#d0d0d0]/80 via-[#d0d0d0]/40 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_top,black_40%,transparent)]" />
        <div className="relative mb-6 pointer-events-auto">
          <Link
            href="/create"
            className="flex items-center gap-2 rounded-[100px] bg-[#181818] border-[1.5px] border-[rgba(255,255,255,0.15)] px-6 py-3 text-sm font-medium text-white shadow-lg hover:bg-[#252525] transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Assignment
          </Link>
        </div>
      </div>

      {/* FAB — mobile */}
      <Link
        href="/create"
        className="lg:hidden fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FF5623] text-white shadow-lg hover:bg-[#E04010] transition-colors"
        aria-label="Create Assignment"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </>
  );
}
