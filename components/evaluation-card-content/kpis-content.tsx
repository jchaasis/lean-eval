import { Target } from "lucide-react";
import type { KPI } from "@/types/evaluation";

interface KPIsContentProps {
  data: readonly KPI[];
}

/**
 * Key Performance Indicators Card Content
 * Displays KPIs with targets and measurement methods, and "Next Step" callout
 */
export function KPIsContent({ data }: KPIsContentProps) {
  return (
    <div className="flex flex-col gap-4 pb-16">
      {/* North Star Metric */}
      <div>
        <p className="text-base font-bold text-[#0f172b] leading-6 tracking-[-0.3125px] mb-2">
          North Star Metric:
        </p>
        <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px]">
          Evaluations completed per week
        </p>
      </div>

      {/* Primary Metrics */}
      <div>
        <p className="text-base font-bold text-[#0f172b] leading-6 tracking-[-0.3125px] mb-2">
          Primary Metrics (Track from Day 1):
        </p>
        <ul className="list-none space-y-2 pl-4">
          {data.map((kpi, index) => (
            <li key={index} className="flex flex-col gap-1">
              <p className="text-base font-normal text-[#314158] leading-6 tracking-[-0.3125px]">
                • <span className="font-semibold">{kpi.name}</span> (target: {kpi.target})
              </p>
              <p className="text-sm font-normal text-[#62748e] leading-5 pl-4">
                {kpi.measurement}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Step Callout */}
      <div className="bg-orange-50 border border-[#ffd6a7] rounded-[10px] pt-[17px] px-[17px] pb-0 mt-2">
        <div className="flex gap-3 items-start pb-4">
          <Target className="size-5 text-[#0f172b] shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] mb-1">
              Next Step
            </p>
            <p className="text-sm font-normal text-[#314158] leading-5 tracking-[-0.1504px]">
              Set up PostHog or Mixpanel TODAY. Track these 3 events: evaluation_started, section_regenerated, report_exported.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

