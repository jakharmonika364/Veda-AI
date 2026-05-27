import { StudentInfoSection } from './StudentInfoSection';
import { PaperSection } from './PaperSection';
import { AnswerKey } from './AnswerKey';
import type { ApiQuestionPaper } from '@/types';

interface QuestionPaperProps {
  paper: ApiQuestionPaper;
}

export function QuestionPaper({ paper }: QuestionPaperProps) {
  return (
    <div className="space-y-4">
      {/* Paper card */}
      <div className="rounded-[32px] bg-white p-6 sm:p-10 shadow-card space-y-5">

        {/* School header — centred, print-style */}
        <div className="text-center space-y-0.5 border-b border-[rgba(0,0,0,0.1)] pb-4">
          <h2 className="text-2xl font-extrabold text-[#181818] tracking-tight">{paper.schoolName}</h2>
          <p className="text-base font-bold text-[#303030]">
            Subject: {paper.subject}
          </p>
          <p className="text-base font-bold text-[#303030]">
            Class: {paper.className}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-sm text-[#303030] font-medium">
          <span>Time Allowed: {paper.timeAllowed}</span>
          <span>Maximum Marks: {paper.maxMarks}</span>
        </div>

        {/* General instruction */}
        <p className="text-sm font-semibold text-[#303030]">
          All questions are compulsory unless stated otherwise.
        </p>

        {/* Student info */}
        <StudentInfoSection />

        {/* Sections */}
        <div className="space-y-8 pt-2">
          {paper.sections.map((section, i) => (
            <PaperSection key={i} section={section} />
          ))}
        </div>

        {/* End line */}
        <p className="text-center text-sm font-bold text-[#303030] border-t border-[rgba(0,0,0,0.1)] pt-4">
          End of Question Paper
        </p>
      </div>

      {/* Answer key */}
      <AnswerKey answerKey={paper.answerKey} />
    </div>
  );
}
