interface QuestionFieldProps {
  questionNumber: number;
  questionText: string;
  isRequired: boolean;
  placeholder: string;
  guidanceText: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * QuestionField Component
 * Reusable question input field with label, placeholder, and guidance text
 */
export function QuestionField({
  questionNumber,
  questionText,
  isRequired,
  placeholder,
  guidanceText,
  value,
  onChange,
}: QuestionFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={`question-${questionNumber}`}
        className="text-sm font-medium text-[#0f172b] leading-[14px] tracking-[-0.1504px]"
      >
        {questionNumber}. {questionText}
        {isRequired && (
          <span className="text-[#fb2c36] ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      <input
        id={`question-${questionNumber}`}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#f3f3f5] border-0 rounded-lg h-9 px-3 py-1 text-sm text-[#0f172b] placeholder:text-[#717182] leading-normal tracking-[-0.1504px] focus:outline-none focus:ring-2 focus:ring-[#009966] focus:ring-offset-2"
        aria-required={isRequired}
        aria-describedby={`guidance-${questionNumber}`}
      />
      <div
        id={`guidance-${questionNumber}`}
        className="text-xs text-[#62748e] leading-4"
      >
        {guidanceText}
      </div>
    </div>
  );
}

