'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/Badge';
import { AssignmentMenu } from './AssignmentMenu';
import type { ApiAssignment } from '@/types';

interface AssignmentCardProps {
  assignment: ApiAssignment;
}

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col gap-3 rounded-[24px] bg-white p-5 shadow-card hover:shadow-card-hover transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/assignments/${assignment._id}`}
          className="flex-1 min-w-0"
        >
          <h3 className="font-semibold text-[#303030] underline underline-offset-2 decoration-gray-300 hover:decoration-[#FF5623] transition-colors truncate">
            {assignment.title}
          </h3>
        </Link>
        <AssignmentMenu assignmentId={assignment._id} />
      </div>

      {/* Meta */}
      <div className="space-y-1.5 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-text-primary">Assigned on:</span>
          <span className="text-text-secondary">{formatDate(assignment.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-text-primary">Due:</span>
          <span className="text-text-secondary">{formatDate(assignment.dueDate)}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[rgba(0,0,0,0.08)]">
        <StatusBadge status={assignment.status} />
        <span className="text-xs text-text-secondary">
          {assignment.questionTypes.reduce((s, qt) => s + qt.count, 0)} Qs ·{' '}
          {assignment.questionTypes.reduce((s, qt) => s + qt.count * qt.marksPerQuestion, 0)} Marks
        </span>
      </div>
    </motion.div>
  );
}

export function AssignmentCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-[24px] bg-white p-5 shadow-card">
      <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-1/2 rounded bg-gray-100 animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-gray-100 animate-pulse" />
      </div>
      <div className="flex justify-between pt-1 border-t border-border">
        <div className="h-5 w-20 rounded-pill bg-gray-100 animate-pulse" />
        <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}
