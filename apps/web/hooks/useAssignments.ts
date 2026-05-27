'use client';

import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { useAssignmentStore } from '@/store/assignmentStore';

export function useAssignments() {
  const assignments = useAssignmentStore((s) => s.assignments);
  const loading = useAssignmentStore((s) => s.loading);
  const error = useAssignmentStore((s) => s.error);
  // Zustand actions are stable references — safe to use as effect deps
  const fetchAssignments = useAssignmentStore((s) => s.fetchAssignments);
  const deleteAssignmentAction = useAssignmentStore((s) => s.deleteAssignment);

  const deleteAssignment = useCallback(
    async (id: string) => {
      try {
        await deleteAssignmentAction(id);
        toast.success('Assignment deleted');
      } catch {
        toast.error('Failed to delete assignment');
      }
    },
    [deleteAssignmentAction],
  );

  return { assignments, loading, error, fetchAssignments, deleteAssignment };
}
