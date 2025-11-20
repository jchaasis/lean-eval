"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import type {
  ProblemAndPersona,
  MVPScope,
  Experiment,
  Risk,
  KPI,
} from "@/types/evaluation";
import { ProblemPersonaContent } from "@/components/evaluation-card-content/problem-persona-content";
import { MVPScopeContent } from "@/components/evaluation-card-content/mvp-scope-content";
import { ExperimentsContent } from "@/components/evaluation-card-content/experiments-content";
import { RisksContent } from "@/components/evaluation-card-content/risks-content";
import { KPIsContent } from "@/components/evaluation-card-content/kpis-content";

type EvaluationCardData =
  | ProblemAndPersona
  | MVPScope
  | readonly Experiment[]
  | readonly Risk[]
  | readonly KPI[];

type EvaluationCardSection =
  | "problemAndPersona"
  | "mvpScope"
  | "experiments"
  | "risks"
  | "kpis";

interface EvaluationCardProps {
  title: string;
  section: EvaluationCardSection;
  data: EvaluationCardData;
}

/**
 * Evaluation Card Component
 * Reusable collapsible card for displaying evaluation sections
 */
export function EvaluationCard({ title, section, data }: EvaluationCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderContent = () => {
    switch (section) {
      case "problemAndPersona":
        return <ProblemPersonaContent data={data as ProblemAndPersona} />;
      case "mvpScope":
        return <MVPScopeContent data={data as MVPScope} />;
      case "experiments":
        return <ExperimentsContent data={data as readonly Experiment[]} />;
      case "risks":
        return <RisksContent data={data as readonly Risk[]} />;
      case "kpis":
        return <KPIsContent data={data as readonly KPI[]} />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full h-[75px] px-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
        aria-expanded={isExpanded}
        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${title} section`}
      >
        <h3 className="text-lg font-medium text-[#0f172b] leading-[27px] tracking-[-0.4395px]">
          {title}
        </h3>
        {isExpanded ? (
          <ChevronUp className="size-5 text-[#0f172b]" />
        ) : (
          <ChevronDown className="size-5 text-[#0f172b]" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {renderContent()}
        </div>
      )}
    </Card>
  );
}

