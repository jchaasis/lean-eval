"use client";

const EXAMPLE_IDEAS = [
  "A Chrome extension that summarizes meeting notes using AI",
  "A marketplace connecting local farmers directly with restaurants",
  "An app that gamifies learning to code for kids",
] as const;

/**
 * Example Ideas Section Component
 * Displays example ideas that users can click to use as inspiration
 */
interface ExampleIdeasSectionProps {
  onExampleClick: (example: string) => void;
}

export function ExampleIdeasSection({ onExampleClick }: ExampleIdeasSectionProps) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[10px] px-[17px] pt-[17px] pb-1 flex flex-col gap-2">
      <p className="text-sm font-normal text-[#45556c] leading-5 tracking-[-0.1504px]">
        Need inspiration? Try these examples:
      </p>
      <div className="flex flex-col gap-2 pb-4">
        {EXAMPLE_IDEAS.map((example, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onExampleClick(example)}
            className="text-left text-sm font-normal text-[#009966] leading-5 tracking-[-0.1504px] hover:underline focus:outline-none focus:ring-2 focus:ring-[#009966] focus:ring-offset-2 rounded px-2 py-1 -mx-2 -my-1"
            aria-label={`Use example: ${example}`}
          >
            &quot;{example}&quot;
          </button>
        ))}
      </div>
    </div>
  );
}
