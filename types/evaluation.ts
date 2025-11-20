/**
 * Core type definitions for LeanEval evaluation system
 * All types follow strict TypeScript standards with readonly arrays where appropriate
 */

/**
 * User's initial idea description
 */
export interface IdeaInput {
  description: string;
}

/**
 * Static follow-up question template
 */
export interface ClarifierQuestion {
  id: string;
  label: string;
  placeholder?: string;
}

/**
 * User's response to a clarifier question
 */
export interface ClarifierResponse {
  questionId: string;
  answer: string;
}

/**
 * Complete input payload for evaluation
 */
export interface EvaluationInput {
  idea: IdeaInput;
  clarifiers: readonly ClarifierResponse[];
}

/**
 * Problem statement and target persona
 */
export interface ProblemAndPersona {
  problem: string;
  persona: string;
}

/**
 * MVP scope definition
 */
export interface MVPScope {
  description: string;
  features: readonly string[];
  timeline: string;
}

/**
 * Validation experiment
 */
export interface Experiment {
  name: string;
  description: string;
  metric: string;
  timeline: string;
}

/**
 * Risk assessment
 */
export interface Risk {
  category: string;
  description: string;
  mitigation: string;
}

/**
 * Key performance indicators
 */
export interface KPI {
  name: string;
  target: string;
  measurement: string;
}

/**
 * Scoring dimensions with weights
 */
export interface ScoringDimensions {
  feasibility: number; // 0-100, weight: 35%
  marketPull: number; // 0-100, weight: 35%
  speedToSignal: number; // 0-100, weight: 20%
  novelty: number; // 0-100, weight: 10%
}

/**
 * Complete evaluation result
 */
export interface EvaluationResult {
  problemAndPersona: ProblemAndPersona;
  mvpScope: MVPScope;
  experiments: readonly Experiment[];
  risks: readonly Risk[];
  kpis: readonly KPI[];
  scoring: ScoringDimensions;
  compositeScore: number; // Weighted average × 100
  timestamp: string; // ISO 8601 timestamp
}

/**
 * Discriminated union for EvaluationCard data
 * Provides type-safe rendering without type assertions
 */
export type EvaluationCardData =
  | { type: "problemAndPersona"; data: ProblemAndPersona }
  | { type: "mvpScope"; data: MVPScope }
  | { type: "experiments"; data: readonly Experiment[] }
  | { type: "risks"; data: readonly Risk[] }
  | { type: "kpis"; data: readonly KPI[] };

