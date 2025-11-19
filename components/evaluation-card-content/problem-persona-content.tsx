import { Info } from "lucide-react";
import type { ProblemAndPersona } from "@/types/evaluation";

interface ProblemPersonaContentProps {
  data: ProblemAndPersona;
}

/**
 * Problem & Persona Card Content
 * Displays problem statement and persona information with "Next Step" callout
 */
export function ProblemPersonaContent({ data }: ProblemPersonaContentProps) {
  // Parse the problem and persona text to extract structured information
  // For now, we'll display them as-is. In the future, we might want to parse
  // them into more structured fields if the AI response format changes.

  return (
    <div className="flex flex-col gap-2 pb-16">
      {/* Core Problem */}
      <div className="flex gap-4">
        <p className="text-base font-bold text-[#0f172b] leading-6 tracking-[-0.3125px] shrink-0 w-[110px]">
          Core Problem:
        </p>
        <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] flex-1">
          {data.problem}
        </p>
      </div>

      {/* Target Persona */}
      <div className="flex gap-4">
        <p className="text-base font-bold text-[#0f172b] leading-6 tracking-[-0.3125px] shrink-0 w-[110px]">
          Target Persona:
        </p>
        <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] flex-1">
          {data.persona}
        </p>
      </div>

      {/* Next Step Callout */}
      <div className="bg-blue-50 border border-[#bedbff] rounded-[10px] pt-[17px] px-[17px] pb-0 mt-4">
        <div className="flex gap-3 items-start pb-4">
          <Info className="size-5 text-[#0f172b] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] mb-1">
              Next Step
            </p>
            <p className="text-sm font-normal text-[#314158] leading-5 tracking-[-0.1504px]">
              Interview 5-10 people matching this persona. Ask: "How do you currently solve [problem]? How much time/money does it cost you?"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

