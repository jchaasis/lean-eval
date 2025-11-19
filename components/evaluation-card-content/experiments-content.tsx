import { AlertCircle } from "lucide-react";
import type { Experiment } from "@/types/evaluation";

interface ExperimentsContentProps {
  data: readonly Experiment[];
}

/**
 * Validation Experiments Card Content
 * Displays experiment details and "Next Step" callout
 */
export function ExperimentsContent({ data }: ExperimentsContentProps) {
  return (
    <div className="flex flex-col gap-4 pb-16">
      {data.map((experiment, index) => (
        <div key={index} className="flex flex-col gap-2">
          <p className="text-base font-bold text-[#314158] leading-6 tracking-[-0.3125px]">
            {experiment.name}
          </p>
          <div className="flex flex-col gap-1 pl-4">
            <p className="text-base font-normal text-[#314158] leading-6 tracking-[-0.3125px]">
              <span className="font-semibold">Description:</span> {experiment.description}
            </p>
            <p className="text-base font-normal text-[#314158] leading-6 tracking-[-0.3125px]">
              <span className="font-semibold">Success Metric:</span> {experiment.metric}
            </p>
            <p className="text-base font-normal text-[#314158] leading-6 tracking-[-0.3125px]">
              <span className="font-semibold">Timeline:</span> {experiment.timeline}
            </p>
          </div>
        </div>
      ))}

      {/* Next Step Callout */}
      <div className="bg-pink-50 border border-[#fccee8] rounded-[10px] pt-[17px] px-[17px] pb-0 mt-2">
        <div className="flex gap-3 items-start pb-4">
          <AlertCircle className="size-5 text-[#0f172b] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] mb-1">
              Next Step
            </p>
            <p className="text-sm font-normal text-[#314158] leading-5 tracking-[-0.1504px]">
              Run Experiment 2 THIS WEEK. Commit to shipping the landing page in 48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

