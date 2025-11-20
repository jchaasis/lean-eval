"use client";

import { useRouter } from "next/navigation";
import { useEvaluation } from "@/contexts/evaluation-context";
import { useEffect } from "react";
import { EvaluationReportSummary } from "@/components/evaluation-report-summary";
import { EvaluationCard } from "@/components/evaluation-card";
import { ReadyToIterate } from "@/components/ready-to-iterate";

/**
 * Dashboard Client Component
 * Handles client-side logic for dashboard including data retrieval and navigation
 */
export function DashboardClient() {
  const router = useRouter();
  const { evaluationResult, idea, clearEvaluation } = useEvaluation();

  // Redirect if no evaluation data
  useEffect(() => {
    if (!evaluationResult) {
      router.push("/");
    }
  }, [evaluationResult, router]);

  // Don't render if no data
  if (!evaluationResult || !idea) {
    return null;
  }

  const handleNewEvaluation = () => {
    clearEvaluation();
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-12 w-full">
      {/* Evaluation Report Summary Card */}
      <EvaluationReportSummary
        idea={idea}
        evaluationResult={evaluationResult}
        onNewEvaluation={handleNewEvaluation}
      />

      {/* Evaluation Cards Container */}
      <div className="flex flex-col gap-6 w-full">
        {/* Problem & Persona Card */}
        <EvaluationCard
          title="Problem & Persona"
          section="problemAndPersona"
          data={evaluationResult.problemAndPersona}
        />

        {/* MVP Scope Card */}
        <EvaluationCard
          title="MVP Scope"
          section="mvpScope"
          data={evaluationResult.mvpScope}
        />

        {/* Validation Experiments Card */}
        <EvaluationCard
          title="Validation Experiments"
          section="experiments"
          data={evaluationResult.experiments}
        />

        {/* Risks & Mitigation Card */}
        <EvaluationCard
          title="Risks & Mitigation"
          section="risks"
          data={evaluationResult.risks}
        />

        {/* Key Performance Indicators Card */}
        <EvaluationCard
          title="Key Performance Indicators"
          section="kpis"
          data={evaluationResult.kpis}
        />
      </div>

      {/* Ready to Iterate Section */}
      <ReadyToIterate onNewEvaluation={handleNewEvaluation} />
    </div>
  );
}

