import { CheckCircle2, TrendingUp, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  name: string;
  description: string;
  score: number; // 0-10 scale
  iconColor: string;
  progressColor: string;
}

function DimensionIcon({ name }: { name: string }) {
  const className = "size-4 text-[#0f172b]";

  if (name === "Feasibility") {
    return <CheckCircle2 className={className} />;
  } else if (name === "Market Pull") {
    return <TrendingUp className={className} />;
  } else if (name === "Novelty") {
    return <Sparkles className={className} />;
  } else if (name === "Speed-to-Signal") {
    return <Zap className={className} />;
  }
  return <CheckCircle2 className={className} />;
}

/**
 * Score Card Component
 * Displays a dimension score with icon, name, description, score, and progress bar
 */
export function ScoreCard({
  name,
  description,
  score,
  iconColor,
  progressColor,
}: ScoreCardProps) {
  const progressPercentage = (score / 10) * 100;

  return (
    <div className="bg-white border border-slate-200 rounded-[10px] pt-[17px] px-[17px] pb-[17px] flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex gap-2 items-center flex-1 min-w-0">
          {/* Icon */}
          <div className={cn("rounded-[10px] size-8 flex items-center justify-center shrink-0", iconColor)}>
            <DimensionIcon name={name} />
          </div>

          {/* Name and Description */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-normal text-[#0f172b] leading-5 tracking-[-0.1504px]">
              {name}
            </p>
            <p className="text-xs font-normal text-[#62748e] leading-4">
              {description}
            </p>
          </div>
        </div>

        {/* Score */}
        <div className="shrink-0">
          <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px]">
            {score.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className={cn("h-2 rounded-full transition-all", progressColor)}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

