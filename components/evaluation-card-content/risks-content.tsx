import { AlertTriangle } from "lucide-react";
import type { Risk } from "@/types/evaluation";
import { NextStepCallout } from "@/components/ui/next-step-callout";

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

  // Define preferred category order, but include all categories
  const preferredOrder = ["High Risk", "Medium Risk", "Low Risk"];
  const allCategories = Object.keys(risksByCategory);
  
  // Sort categories: preferred order first, then others alphabetically
  const sortedCategories = [
    ...preferredOrder.filter((cat) => allCategories.includes(cat)),
    ...allCategories
      .filter((cat) => !preferredOrder.includes(cat))
      .sort((a, b) => a.localeCompare(b)),
  ];

  return (
    <div className="flex flex-col gap-4 pb-16">
      {sortedCategories.length > 0 ? (
        sortedCategories.map((category) => {
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
        })
      ) : (
        <p className="text-base font-normal text-[#314158] leading-6 tracking-[-0.3125px]">
          No risks identified.
        </p>
      )}

      {/* Next Step Callout */}
      <NextStepCallout
        variant="danger"
        icon={AlertTriangle}
        content="Document mitigation plans. Set up weekly risk review. Talk to 3 users about privacy concerns."
      />
    </div>
  );
}

