'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { useAssignments } from '@/hooks/useAssignments';

interface AssignmentMenuProps {
  assignmentId: string;
}

export function AssignmentMenu({ assignmentId }: AssignmentMenuProps) {
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { deleteAssignment } = useAssignments();

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteAssignment(assignmentId);
      setDeleteOpen(false);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div ref={ref} className="relative">
        <button
          onClick={(e) => { e.preventDefault(); setOpen((o) => !o); }}
          className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary hover:bg-gray-100 transition-colors"
          aria-label="Assignment options"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-[16px] bg-white shadow-lg border border-[rgba(0,0,0,0.08)]"
              role="menu"
            >
              <button
                onClick={() => { setOpen(false); router.push(`/assignments/${assignmentId}`); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-text-primary hover:bg-gray-50 transition-colors"
                role="menuitem"
              >
                <svg className="h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Assignment
              </button>
              <div className="h-px bg-[rgba(0,0,0,0.06)]" />
              <button
                onClick={() => { setOpen(false); setDeleteOpen(true); }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                role="menuitem"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Assignment"
        description="This will permanently delete the assignment and its generated question paper. This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="destructive"
        loading={deleting}
      />
    </>
  );
}
