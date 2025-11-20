import { AlertCircle } from "lucide-react";
import type { Experiment } from "@/types/evaluation";
import { NextStepCallout } from "@/components/ui/next-step-callout";

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
      <NextStepCallout
        variant="warning"
        icon={AlertCircle}
        content="Run Experiment 2 THIS WEEK. Commit to shipping the landing page in 48 hours."
      />
    </div>
  );
}

