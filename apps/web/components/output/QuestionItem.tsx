import { DifficultyBadge } from '@/components/ui/Badge';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

interface QuestionItemProps {
  number: number;
  text: string;
  difficulty: string;
  marks: number;
  questionType?: string;
  options?: string[];
}

export function QuestionItem({ number, text, difficulty, marks, options }: QuestionItemProps) {
  const hasMcqOptions = options && options.length > 0;

  return (
    <li className="py-3 border-b border-[rgba(0,0,0,0.05)] last:border-b-0">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 font-semibold text-[#303030]">{number}.</span>
        <div className="flex-1 min-w-0">
          {/* Badge + marks row */}
          <div className="flex items-center gap-2 mb-1">
            <DifficultyBadge difficulty={difficulty} />
            <span className="ml-auto text-xs text-[#5E5E5E] whitespace-nowrap flex-shrink-0">
              [{marks} Mark{marks > 1 ? 's' : ''}]
            </span>
          </div>

          {/* Question stem */}
          <p className="text-sm text-[#303030] leading-relaxed">{text}</p>

          {/* MCQ options */}
          {hasMcqOptions && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
              {options.map((opt, i) => (
                <p key={i} className="text-sm text-[#303030] leading-relaxed">
                  <span className="font-medium">({OPTION_LABELS[i]})</span> {opt}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
