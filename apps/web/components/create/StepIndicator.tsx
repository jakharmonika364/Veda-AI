interface StepIndicatorProps {
  currentStep: 1 | 2;
  totalSteps?: number;
}

export function StepIndicator({ currentStep, totalSteps = 2 }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const step = i + 1;
        const isActive = step <= currentStep;
        const isCurrent = step === currentStep;

        return (
          <div key={step} className="flex flex-1 items-center gap-2">
            <div className="flex-1">
              <div
                className={`h-1.5 rounded-[100px] transition-all duration-300 ${
                  isActive ? 'bg-[#181818]' : 'bg-[rgba(0,0,0,0.1)]'
                }`}
              />
            </div>
            {step < totalSteps && (
              <div
                className={`h-2 w-2 rounded-full flex-shrink-0 transition-all duration-300 ${
                  isCurrent ? 'bg-[#FF5623]' : isActive ? 'bg-[#181818]' : 'bg-[rgba(0,0,0,0.1)]'
                }`}
              />
            )}
          </div>
        );
      })}

      <div className="ml-2 flex-shrink-0 text-sm text-[#5E5E5E]">
        <span className="font-semibold text-[#303030]">{currentStep}</span>/{totalSteps}
      </div>
    </div>
  );
}
