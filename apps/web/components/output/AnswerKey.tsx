'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ApiQuestionPaper } from '@/types';

interface AnswerKeyProps {
  answerKey: ApiQuestionPaper['answerKey'];
}

export function AnswerKey({ answerKey }: AnswerKeyProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[32px] border border-[rgba(0,0,0,0.08)] bg-white overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 hover:bg-[#f9f9f9] transition-colors"
        aria-expanded={open}
        aria-controls="answer-key-content"
      >
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-[#FF5623]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM5 20a8 8 0 1 1 14.93-3M9 12l2 2 4-4" />
          </svg>
          <span className="font-semibold text-[#303030] tracking-tight">Answer Key</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg className="h-4 w-4 text-[#5E5E5E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="answer-key-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-[rgba(0,0,0,0.08)] px-5 py-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {answerKey.map((entry) => (
                  <div
                    key={entry.questionNumber}
                    className="flex gap-3 rounded-[12px] bg-[#f5f5f5] px-3 py-2"
                  >
                    <span className="flex-shrink-0 font-semibold text-[#303030] text-sm">
                      Q{entry.questionNumber}.
                    </span>
                    <span className="text-sm text-[#5E5E5E]">{entry.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
