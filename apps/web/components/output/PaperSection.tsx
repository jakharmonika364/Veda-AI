import { QuestionItem } from './QuestionItem';
import type { ApiQuestionPaper } from '@/types';

type Section = ApiQuestionPaper['sections'][number];

interface PaperSectionProps {
  section: Section;
}

export function PaperSection({ section }: PaperSectionProps) {
  return (
    <div className="space-y-2">
      <div className="text-center">
        <h3 className="text-base font-bold text-[#181818] uppercase tracking-wide">
          {section.title}
        </h3>
      </div>
      <div>
        <p className="text-sm font-semibold text-[#303030]">{section.questionType}</p>
        <p className="text-sm italic text-[#5E5E5E]">{section.instruction}</p>
      </div>
      <ol className="space-y-0 mt-3">
        {section.questions.map((q) => (
          <QuestionItem
            key={q.number}
            number={q.number}
            text={q.text}
            difficulty={q.difficulty}
            marks={q.marks}
            questionType={section.questionType}
            options={q.options}
          />
        ))}
      </ol>
    </div>
  );
}
