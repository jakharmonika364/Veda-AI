'use client';

import { useEffect } from 'react';
import { useSocketStore } from '@/store/socketStore';
import { useCreateFormStore } from '@/store/createFormStore';

export function useJobStatus(assignmentId: string | null) {
  const subscribe = useSocketStore((s) => s.subscribe);
  const unsubscribe = useSocketStore((s) => s.unsubscribe);
  const jobProgress = useCreateFormStore((s) => s.jobProgress);

  useEffect(() => {
    if (!assignmentId) return;
    subscribe(assignmentId);
    return () => unsubscribe(assignmentId);
  }, [assignmentId, subscribe, unsubscribe]);

  return jobProgress;
}
