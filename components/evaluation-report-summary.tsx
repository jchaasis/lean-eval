"use client";

import { Lightbulb, Download, Plus, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScoreCard } from "@/components/score-card";
import type { EvaluationResult } from "@/types/evaluation";

interface EvaluationReportSummaryProps {
  idea: string;
  evaluationResult: EvaluationResult;
  onNewEvaluation: () => void;
}

/**
 * Get status badge text and color based on composite score
 */
function getStatusBadge(score: number): { text: string; bgColor: string; textColor: string } {
  if (score >= 8.0) {
    return { text: "Strong", bgColor: "bg-green-100", textColor: "text-[#008236]" };
  } else if (score >= 6.0) {
    return { text: "Moderate", bgColor: "bg-yellow-100", textColor: "text-yellow-800" };
  } else {
    return { text: "Weak", bgColor: "bg-red-100", textColor: "text-red-800" };
  }
}

/**
 * Evaluation Report Summary Card
 * Displays the composite score, dimension scores, and action buttons
 */
export function EvaluationReportSummary({
  idea,
  evaluationResult,
  onNewEvaluation,
}: EvaluationReportSummaryProps) {
  const compositeScore = evaluationResult.compositeScore / 10; // Convert from 0-100 to 0-10
  const statusBadge = getStatusBadge(compositeScore);

  const handleExportMarkdown = () => {
    // TODO: Implement markdown export
    console.log("Export markdown");
  };

  return (
    <Card className="pt-[33px] px-[33px] pb-0">
      {/* Card Header */}
      <div className="flex gap-3 items-center mb-6">
        <div className="bg-[#d0fae5] rounded-full size-12 flex items-center justify-center shrink-0">
          <Lightbulb className="size-6 text-[#0f172b]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px]">
            Lean Evaluation Report
          </h2>
          <p className="text-sm font-normal text-[#45556c] leading-5 tracking-[-0.1504px] mt-1">
            {idea}
          </p>
        </div>
      </div>

      {/* Score Breakdown Container */}
      <div className="flex flex-col gap-6 mb-6">
        {/* Composite Score Section */}
        <div className="border border-slate-200 rounded-[10px] pt-[25px] px-[25px] pb-[25px]">
          <div className="flex gap-4 items-center">
            {/* Circular Score Badge */}
            <div className="bg-white rounded-full shadow-md size-20 flex items-center justify-center shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px]">
                  {compositeScore.toFixed(1)}
                </span>
                <span className="text-xs font-normal text-[#62748e] leading-4">
                  / 10
                </span>
              </div>
            </div>

            {/* Score Label */}
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 items-center mb-1">
                <TrendingUp className="size-5 text-[#0f172b]" />
                <h3 className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px]">
                  Composite Score
                </h3>
              </div>
              <p className="text-sm font-normal text-[#45556c] leading-5 tracking-[-0.1504px]">
                Overall viability based on all factors
              </p>
            </div>

            {/* Status Badge */}
            <div className={`${statusBadge.bgColor} h-7 rounded-full px-3 flex items-center shrink-0`}>
              <span className={`${statusBadge.textColor} text-sm font-normal leading-5 tracking-[-0.1504px]`}>
                {statusBadge.text}
              </span>
            </div>
          </div>
        </div>

        {/* Dimension Score Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          <ScoreCard
            name="Feasibility"
            description="Technical & resource viability"
            score={evaluationResult.scoring.feasibility / 10}
            iconColor="bg-emerald-50"
            progressColor="bg-[#00bc7d]"
          />
          <ScoreCard
            name="Market Pull"
            description="Demand strength & urgency"
            score={evaluationResult.scoring.marketPull / 10}
            iconColor="bg-teal-50"
            progressColor="bg-[#00bba7]"
          />
          <ScoreCard
            name="Novelty"
            description="Differentiation & uniqueness"
            score={evaluationResult.scoring.novelty / 10}
            iconColor="bg-cyan-50"
            progressColor="bg-[#00b8db]"
          />
          <ScoreCard
            name="Speed-to-Signal"
            description="Time to validate/invalidate"
            score={evaluationResult.scoring.speedToSignal / 10}
            iconColor="bg-green-50"
            progressColor="bg-[#00c950]"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pb-[33px]">
        <button
          onClick={handleExportMarkdown}
          className="bg-white border border-[rgba(0,0,0,0.1)] h-9 rounded-lg px-4 flex items-center gap-2 hover:bg-slate-50 transition-colors"
          aria-label="Export as Markdown"
        >
          <Download className="size-4 text-neutral-950" />
          <span className="text-sm font-medium text-neutral-950 leading-5 tracking-[-0.1504px]">
            Export as Markdown
          </span>
        </button>
        <button
          onClick={onNewEvaluation}
          className="bg-white border border-[rgba(0,0,0,0.1)] h-9 rounded-lg px-4 flex items-center gap-2 hover:bg-slate-50 transition-colors"
          aria-label="New Evaluation"
        >
          <Plus className="size-4 text-neutral-950" />
          <span className="text-sm font-medium text-neutral-950 leading-5 tracking-[-0.1504px]">
            New Evaluation
          </span>
        </button>
      </div>
    </Card>
  );
}

