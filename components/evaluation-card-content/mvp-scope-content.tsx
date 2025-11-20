import { CheckCircle } from "lucide-react";
import type { MVPScope } from "@/types/evaluation";
import { NextStepCallout } from "@/components/ui/next-step-callout";

interface MVPScopeContentProps {
  data: MVPScope;
}

/**
 * MVP Scope Card Content
 * Displays MVP description, features, timeline, and "Next Step" callout
 */
export function MVPScopeContent({ data }: MVPScopeContentProps) {
  return (
    <div className="flex flex-col gap-4 pb-16">
      {/* Description */}
      <div>
        <p className="text-base font-bold text-[#0f172b] leading-6 tracking-[-0.3125px] mb-2">
          MVP Description:
        </p>
        <p className="text-base font-normal text-[#314158] leading-6 tracking-[-0.3125px]">
          {data.description}
        </p>
      </div>

      {/* Core Features */}
      <div>
        <p className="text-base font-bold text-[#0f172b] leading-6 tracking-[-0.3125px] mb-2">
          Core Features (In Scope):
        </p>
        <ul className="list-none space-y-2">
          {data.features.map((feature, index) => (
            <li key={index} className="flex gap-2 items-start">
              <span className="text-base font-normal text-[#314158] leading-6 tracking-[-0.3125px]">
                •
              </span>
              <span className="text-base font-normal text-[#314158] leading-6 tracking-[-0.3125px] flex-1">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Build Timeline */}
      <div className="flex gap-4">
        <p className="text-base font-bold text-[#0f172b] leading-6 tracking-[-0.3125px] shrink-0 w-[114px]">
          Build Timeline:
        </p>
        <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] flex-1">
          {data.timeline}
        </p>
      </div>

      {/* Next Step Callout */}
      <NextStepCallout
        variant="success"
        icon={CheckCircle}
        content="Build a landing page with email capture. Goal: 50 signups before writing any code."
      />
    </div>
  );
}

