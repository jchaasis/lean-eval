import type { EvaluationResult, IdeaInput } from "@/types/evaluation";

/**
 * Get status badge text based on composite score
 */
function getStatusText(score: number): string {
  if (score >= 8.0) {
    return "Strong";
  } else if (score >= 6.0) {
    return "Moderate";
  } else {
    return "Weak";
  }
}

/**
 * Group risks by category for markdown formatting
 */
function groupRisksByCategory(
  risks: readonly { category: string; description: string; mitigation: string }[]
): Record<string, typeof risks> {
  return risks.reduce(
    (acc, risk) => {
      const category = risk.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category] = [...acc[category], risk];
      return acc;
    },
    {} as Record<string, typeof risks>
  );
}

/**
 * Generate markdown export from evaluation result
 * Formats as a concise investor memo with all evaluation sections
 */
export function generateMarkdownExport(
  idea: IdeaInput,
  evaluationResult: EvaluationResult
): string {
  const compositeScore = evaluationResult.compositeScore / 10; // Convert from 0-100 to 0-10
  const status = getStatusText(compositeScore);
  const date = new Date(evaluationResult.timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const risksByCategory = groupRisksByCategory(evaluationResult.risks);
  const preferredOrder = ["High Risk", "Medium Risk", "Low Risk"];
  const allCategories = Object.keys(risksByCategory);
  const sortedCategories = [
    ...preferredOrder.filter((cat) => allCategories.includes(cat)),
    ...allCategories
      .filter((cat) => !preferredOrder.includes(cat))
      .sort((a, b) => a.localeCompare(b)),
  ];

  return `# Lean Evaluation Report

**Idea:** ${idea.description}

**Date:** ${date}

---

## Executive Summary

**Composite Score:** ${compositeScore.toFixed(1)}/10 - **${status}**

Overall viability based on weighted scoring across four key dimensions:

- **Feasibility:** ${(evaluationResult.scoring.feasibility / 10).toFixed(1)}/10 (Weight: 35%)
  - Technical & resource viability

- **Market Pull:** ${(evaluationResult.scoring.marketPull / 10).toFixed(1)}/10 (Weight: 35%)
  - Demand strength & urgency

- **Speed-to-Signal:** ${(evaluationResult.scoring.speedToSignal / 10).toFixed(1)}/10 (Weight: 20%)
  - Time to validate/invalidate

- **Novelty:** ${(evaluationResult.scoring.novelty / 10).toFixed(1)}/10 (Weight: 10%)
  - Differentiation & uniqueness

---

## Problem & Persona

### Core Problem
${evaluationResult.problemAndPersona.problem}

### Target Persona
${evaluationResult.problemAndPersona.persona}

> **Next Step:** Interview 5-10 people matching this persona. Ask: "How do you currently solve [problem]? How much time/money does it cost you?"

---

## MVP Scope

### Description
${evaluationResult.mvpScope.description}

### Core Features (In Scope)
${evaluationResult.mvpScope.features.length > 0
    ? evaluationResult.mvpScope.features.map((feature) => `- ${feature}`).join("\n")
    : "- No features specified"}

### Build Timeline
${evaluationResult.mvpScope.timeline}

> **Next Step:** Build a landing page with email capture. Goal: 50 signups before writing any code.

---

## Validation Experiments

${evaluationResult.experiments.length > 0
    ? evaluationResult.experiments
        .map(
          (experiment) => `### ${experiment.name}

**Description:** ${experiment.description}

**Success Metric:** ${experiment.metric}

**Timeline:** ${experiment.timeline}
`
        )
        .join("\n")
    : "No validation experiments defined."}

> **Next Step:** Run Experiment 2 THIS WEEK. Commit to shipping the landing page in 48 hours.

---

## Risks & Mitigation

${sortedCategories.length > 0
    ? sortedCategories
        .map((category) => {
          const risks = risksByCategory[category];
          if (!risks || risks.length === 0) return "";

          return `### ${category}

${risks
            .map(
              (risk) => `- **${risk.description}** → *${risk.mitigation}*`
            )
            .join("\n")}
`;
        })
        .filter((section) => section.length > 0)
        .join("\n")
    : "No risks identified."}

> **Next Step:** Document mitigation plans. Set up weekly risk review. Talk to 3 users about privacy concerns.

---

## Key Performance Indicators

### North Star Metric
Evaluations completed per week

### Primary Metrics (Track from Day 1)
${evaluationResult.kpis.length > 0
    ? evaluationResult.kpis
        .map((kpi) => `- **${kpi.name}** (target: ${kpi.target})
  - ${kpi.measurement}`)
        .join("\n")
    : "- No primary metrics defined"}

> **Next Step:** Set up PostHog or Mixpanel TODAY. Track these 3 events: \`evaluation_started\`, \`section_regenerated\`, \`report_exported\`.

---

## Scoring Methodology

The composite score is calculated using weighted averages across four dimensions:

- **Feasibility (35%):** Assesses technical complexity, resource requirements, and execution risk
- **Market Pull (35%):** Evaluates demand strength, user urgency, and market readiness
- **Speed-to-Signal (20%):** Measures how quickly you can validate or invalidate key assumptions
- **Novelty (10%):** Considers differentiation, competitive landscape, and unique value proposition

Each dimension is scored on a 0-10 scale, then weighted and combined to produce the final composite score.

---

*Generated by LeanEval on ${date}*

`.trim();
}

