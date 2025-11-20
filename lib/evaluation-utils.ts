import type { EvaluationInput, ScoringDimensions } from "@/types/evaluation";
import { z } from "zod";

/**
 * Zod schema for validating evaluation response from AI
 * Exported for testing
 */
export const evaluationResponseSchema = z.object({
  problemAndPersona: z.object({
    problem: z.string().min(10),
    persona: z.string().min(10),
  }),
  mvpScope: z.object({
    description: z.string().min(20),
    features: z.array(z.string().min(5)).min(2).max(5),
    timeline: z.string().min(5),
  }),
  experiments: z
    .array(
      z.object({
        name: z.string().min(5),
        description: z.string().min(20),
        metric: z.string().min(5),
        timeline: z.string().min(5),
      })
    )
    .min(2)
    .max(5),
  risks: z
    .array(
      z.object({
        category: z.string().min(3),
        description: z.string().min(10),
        mitigation: z.string().min(10),
      })
    )
    .min(2)
    .max(5),
  kpis: z
    .array(
      z.object({
        name: z.string().min(5),
        target: z.string().min(3),
        measurement: z.string().min(5),
      })
    )
    .min(2)
    .max(5),
  scoring: z.object({
    feasibility: z.number().min(0).max(100),
    marketPull: z.number().min(0).max(100),
    speedToSignal: z.number().min(0).max(100),
    novelty: z.number().min(0).max(100),
  }),
});

/**
 * Builds the evaluation prompt from user input
 * Exported for testing
 */
export function buildEvaluationPrompt(input: EvaluationInput): string {
  const clarifierText = input.clarifiers
    .map((c) => {
      const questionMap: Record<string, string> = {
        "target-user": "Who is your target user or customer?",
        "pain-point": "What specific pain point or frustration does this solve?",
        pricing: "How might you charge for this?",
      };
      return `Q: ${questionMap[c.questionId] || c.questionId}\nA: ${c.answer}`;
    })
    .join("\n\n");

  return `You are an expert Lean Startup advisor evaluating an early-stage startup idea. Provide a structured, actionable evaluation grounded in Lean Startup principles.

**Idea Description:**
${input.idea.description}

**Clarifying Questions & Answers:**
${clarifierText}

**Evaluation Framework:**
Evaluate this idea across the following dimensions:

1. **Problem & Persona**: Clearly articulate the problem being solved and the target persona (demographics, behaviors, characteristics).

2. **MVP Scope**: Define a minimal viable product that tests core assumptions. Include:
   - A concise description (2-3 sentences)
   - 2-5 key features (prioritized by validation value)
   - Realistic timeline (e.g., "2-3 months", "4-6 weeks")

3. **Validation Experiments**: Suggest 2-5 concrete experiments to test key assumptions. Each should include:
   - Name of the experiment
   - Description of what to test
   - Success metric
   - Timeline

4. **Risks & Mitigation**: Identify 2-5 key risks (technical, market, execution) and suggest mitigation strategies.

5. **KPIs**: Define 2-5 key performance indicators with targets and measurement methods.

6. **Scoring**: Rate the idea on a 0-100 scale for each dimension:
   - **Feasibility** (35% weight): Can this realistically be built by a small team?
   - **Market Pull** (35% weight): Is there clear user pain and willingness to pay?
   - **Speed to Signal** (20% weight): How quickly can early validation occur?
   - **Novelty** (10% weight): How differentiated is the idea?

**Output Requirements:**
- Be specific and actionable
- Focus on validation and learning, not perfection
- Keep MVP scope minimal and testable
- Ensure experiments are concrete and measurable
- Provide realistic timelines and targets


IMPORTANT: Return your evaluation as valid JSON (not Markdown) matching this exact structure, and do not include any additional text:
{
  "problemAndPersona": {
    "problem": "Clear problem statement",
    "persona": "Detailed target persona description"
  },
  "mvpScope": {
    "description": "MVP description",
    "features": ["feature1", "feature2"],
    "timeline": "timeline estimate"
  },
  "experiments": [
    {
      "name": "Experiment name",
      "description": "What to test",
      "metric": "Success metric",
      "timeline": "Timeline"
    }
  ],
  "risks": [
    {
      "category": "Risk category",
      "description": "Risk description",
      "mitigation": "Mitigation strategy"
    }
  ],
  "kpis": [
    {
      "name": "KPI name",
      "target": "Target value",
      "measurement": "How to measure"
    }
  ],
  "scoring": {
    "feasibility": 75,
    "marketPull": 80,
    "speedToSignal": 70,
    "novelty": 60
  }
}`;
}

/**
 * Calculates composite score from weighted dimensions
 * Exported for testing
 */
export function calculateCompositeScore(scoring: ScoringDimensions): number {
  const weights = {
    feasibility: 0.35,
    marketPull: 0.35,
    speedToSignal: 0.2,
    novelty: 0.1,
  };

  const composite =
    scoring.feasibility * weights.feasibility +
    scoring.marketPull * weights.marketPull +
    scoring.speedToSignal * weights.speedToSignal +
    scoring.novelty * weights.novelty;

  return Math.round(composite * 100) / 100;
}

