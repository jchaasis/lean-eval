import { AlertTriangle } from "lucide-react";
import type { Risk } from "@/types/evaluation";

interface RisksContentProps {
  data: readonly Risk[];
}

/**
 * Risks & Mitigation Card Content
 * Displays categorized risks with mitigation strategies and "Next Step" callout
 */
export function RisksContent({ data }: RisksContentProps) {
  // Group risks by category
  const risksByCategory = data.reduce(
    (acc, risk) => {
      const category = risk.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(risk);
      return acc;
    },
    {} as Record<string, Risk[]>
  );

  const categoryOrder = ["High Risk", "Medium Risk", "Low Risk"];

  return (
    <div className="flex flex-col gap-4 pb-16">
      {categoryOrder.map((category) => {
        const risks = risksByCategory[category];
        if (!risks || risks.length === 0) return null;

        return (
          <div key={category}>
            <p className="text-base font-bold text-[#0f172b] leading-6 tracking-[-0.3125px] mb-2">
              {category}:
            </p>
            <ul className="list-none space-y-3 pl-4">
              {risks.map((risk, index) => (
                <li key={index} className="flex flex-col gap-1">
                  <p className="text-base font-normal text-[#314158] leading-6 tracking-[-0.3125px]">
                    <span className="font-bold">• {risk.description}</span>
                    {" → "}
                    <span className="italic">{risk.mitigation}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {/* Next Step Callout */}
      <div className="bg-red-50 border border-[#ffc9c9] rounded-[10px] pt-[17px] px-[17px] pb-0 mt-2">
        <div className="flex gap-3 items-start pb-4">
          <AlertTriangle className="size-5 text-[#0f172b] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] mb-1">
              Next Step
            </p>
            <p className="text-sm font-normal text-[#314158] leading-5 tracking-[-0.1504px]">
              Document mitigation plans. Set up weekly risk review. Talk to 3 users about privacy concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

