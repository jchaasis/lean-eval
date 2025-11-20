import { describe, it, expect } from "vitest";
import { z } from "zod";
import {
  evaluationResponseSchema,
  buildEvaluationPrompt,
  calculateCompositeScore,
} from "../evaluation-utils";
import type { EvaluationInput, ScoringDimensions } from "@/types/evaluation";

describe("Schema Validation", () => {
  describe("evaluationResponseSchema", () => {
    it("should validate a correct evaluation response", () => {
      const validResponse = {
        problemAndPersona: {
          problem: "This is a test problem that is long enough",
          persona: "This is a test persona description that is long enough",
        },
        mvpScope: {
          description: "This is a test MVP description that is long enough to pass validation",
          features: ["Feature one that is long enough", "Feature two that is also long enough"],
          timeline: "2-3 months",
        },
        experiments: [
          {
            name: "Test Experiment One",
            description: "This is a test experiment description that is long enough",
            metric: "Success metric test",
            timeline: "2 weeks",
          },
          {
            name: "Test Experiment Two",
            description: "This is another test experiment description that is long enough",
            metric: "Another success metric",
            timeline: "3 weeks",
          },
        ],
        risks: [
          {
            category: "High Risk",
            description: "This is a test risk description that is long enough",
            mitigation: "This is a test mitigation strategy that is long enough",
          },
          {
            category: "Medium Risk",
            description: "This is another test risk description that is long enough",
            mitigation: "This is another test mitigation strategy that is long enough",
          },
        ],
        kpis: [
          {
            name: "Test KPI One",
            target: "100 users",
            measurement: "Track via analytics dashboard",
          },
          {
            name: "Test KPI Two",
            target: "50% conversion",
            measurement: "Track via signup form",
          },
        ],
        scoring: {
          feasibility: 75,
          marketPull: 80,
          speedToSignal: 70,
          novelty: 60,
        },
      };

      const result = evaluationResponseSchema.parse(validResponse);
      expect(result).toEqual(validResponse);
    });

    it("should reject response with problem that is too short", () => {
      const invalidResponse = {
        problemAndPersona: {
          problem: "Short",
          persona: "This is a test persona description that is long enough",
        },
        mvpScope: {
          description: "This is a test MVP description that is long enough to pass validation",
          features: ["Feature one", "Feature two"],
          timeline: "2-3 months",
        },
        experiments: [
          {
            name: "Test Experiment",
            description: "This is a test experiment description that is long enough",
            metric: "Success metric",
            timeline: "2 weeks",
          },
          {
            name: "Test Experiment 2",
            description: "This is another test experiment description that is long enough",
            metric: "Another metric",
            timeline: "3 weeks",
          },
        ],
        risks: [
          {
            category: "Risk",
            description: "This is a test risk description that is long enough",
            mitigation: "This is a test mitigation strategy that is long enough",
          },
          {
            category: "Risk 2",
            description: "This is another test risk description that is long enough",
            mitigation: "This is another test mitigation strategy that is long enough",
          },
        ],
        kpis: [
          {
            name: "Test KPI",
            target: "100",
            measurement: "Track via dashboard",
          },
          {
            name: "Test KPI 2",
            target: "50%",
            measurement: "Track via form",
          },
        ],
        scoring: {
          feasibility: 75,
          marketPull: 80,
          speedToSignal: 70,
          novelty: 60,
        },
      };

      expect(() => evaluationResponseSchema.parse(invalidResponse)).toThrow(z.ZodError);
    });

    it("should reject response with too few experiments", () => {
      const invalidResponse = {
        problemAndPersona: {
          problem: "This is a test problem that is long enough",
          persona: "This is a test persona description that is long enough",
        },
        mvpScope: {
          description: "This is a test MVP description that is long enough to pass validation",
          features: ["Feature one that is long enough", "Feature two that is also long enough"],
          timeline: "2-3 months",
        },
        experiments: [
          {
            name: "Test Experiment",
            description: "This is a test experiment description that is long enough",
            metric: "Success metric",
            timeline: "2 weeks",
          },
        ],
        risks: [
          {
            category: "Risk",
            description: "This is a test risk description that is long enough",
            mitigation: "This is a test mitigation strategy that is long enough",
          },
          {
            category: "Risk 2",
            description: "This is another test risk description that is long enough",
            mitigation: "This is another test mitigation strategy that is long enough",
          },
        ],
        kpis: [
          {
            name: "Test KPI",
            target: "100",
            measurement: "Track via dashboard",
          },
          {
            name: "Test KPI 2",
            target: "50%",
            measurement: "Track via form",
          },
        ],
        scoring: {
          feasibility: 75,
          marketPull: 80,
          speedToSignal: 70,
          novelty: 60,
        },
      };

      expect(() => evaluationResponseSchema.parse(invalidResponse)).toThrow(z.ZodError);
    });

    it("should reject response with scoring outside valid range", () => {
      const invalidResponse = {
        problemAndPersona: {
          problem: "This is a test problem that is long enough",
          persona: "This is a test persona description that is long enough",
        },
        mvpScope: {
          description: "This is a test MVP description that is long enough to pass validation",
          features: ["Feature one that is long enough", "Feature two that is also long enough"],
          timeline: "2-3 months",
        },
        experiments: [
          {
            name: "Test Experiment",
            description: "This is a test experiment description that is long enough",
            metric: "Success metric",
            timeline: "2 weeks",
          },
          {
            name: "Test Experiment 2",
            description: "This is another test experiment description that is long enough",
            metric: "Another metric",
            timeline: "3 weeks",
          },
        ],
        risks: [
          {
            category: "Risk",
            description: "This is a test risk description that is long enough",
            mitigation: "This is a test mitigation strategy that is long enough",
          },
          {
            category: "Risk 2",
            description: "This is another test risk description that is long enough",
            mitigation: "This is another test mitigation strategy that is long enough",
          },
        ],
        kpis: [
          {
            name: "Test KPI",
            target: "100",
            measurement: "Track via dashboard",
          },
          {
            name: "Test KPI 2",
            target: "50%",
            measurement: "Track via form",
          },
        ],
        scoring: {
          feasibility: 150, // Invalid: > 100
          marketPull: 80,
          speedToSignal: 70,
          novelty: 60,
        },
      };

      expect(() => evaluationResponseSchema.parse(invalidResponse)).toThrow(z.ZodError);
    });
  });
});

describe("Scoring Math", () => {
  describe("calculateCompositeScore", () => {
    it("should calculate composite score correctly with standard weights", () => {
      const scoring: ScoringDimensions = {
        feasibility: 80,
        marketPull: 70,
        speedToSignal: 60,
        novelty: 50,
      };

      const expected =
        80 * 0.35 + 70 * 0.35 + 60 * 0.2 + 50 * 0.1; // 28 + 24.5 + 12 + 5 = 69.5
      const result = calculateCompositeScore(scoring);

      expect(result).toBe(69.5);
    });

    it("should handle perfect scores (100)", () => {
      const scoring: ScoringDimensions = {
        feasibility: 100,
        marketPull: 100,
        speedToSignal: 100,
        novelty: 100,
      };

      const result = calculateCompositeScore(scoring);
      expect(result).toBe(100);
    });

    it("should handle zero scores", () => {
      const scoring: ScoringDimensions = {
        feasibility: 0,
        marketPull: 0,
        speedToSignal: 0,
        novelty: 0,
      };

      const result = calculateCompositeScore(scoring);
      expect(result).toBe(0);
    });

    it("should round to 2 decimal places", () => {
      const scoring: ScoringDimensions = {
        feasibility: 75,
        marketPull: 83,
        speedToSignal: 67,
        novelty: 51,
      };

      const result = calculateCompositeScore(scoring);
      // 75*0.35 + 83*0.35 + 67*0.2 + 51*0.1 = 26.25 + 29.05 + 13.4 + 5.1 = 73.8
      expect(result).toBe(73.8);
    });

    it("should correctly apply weights (feasibility and marketPull have highest weight)", () => {
      const scoring1: ScoringDimensions = {
        feasibility: 100,
        marketPull: 0,
        speedToSignal: 0,
        novelty: 0,
      };

      const scoring2: ScoringDimensions = {
        feasibility: 0,
        marketPull: 100,
        speedToSignal: 0,
        novelty: 0,
      };

      const scoring3: ScoringDimensions = {
        feasibility: 0,
        marketPull: 0,
        speedToSignal: 100,
        novelty: 0,
      };

      const result1 = calculateCompositeScore(scoring1); // 35
      const result2 = calculateCompositeScore(scoring2); // 35
      const result3 = calculateCompositeScore(scoring3); // 20

      expect(result1).toBe(35);
      expect(result2).toBe(35);
      expect(result3).toBe(20);
      expect(result1).toBeGreaterThan(result3);
      expect(result2).toBeGreaterThan(result3);
    });
  });
});

describe("Prompt Serialization", () => {
  describe("buildEvaluationPrompt", () => {
    it("should include idea description in prompt", () => {
      const input: EvaluationInput = {
        idea: {
          description: "A mobile app for meal planning",
        },
        clarifiers: [],
      };

      const prompt = buildEvaluationPrompt(input);
      expect(prompt).toContain("A mobile app for meal planning");
    });

    it("should format clarifier responses correctly", () => {
      const input: EvaluationInput = {
        idea: {
          description: "Test idea",
        },
        clarifiers: [
          {
            questionId: "target-user",
            answer: "Busy parents",
          },
          {
            questionId: "pain-point",
            answer: "Time management",
          },
          {
            questionId: "pricing",
            answer: "$10/month",
          },
        ],
      };

      const prompt = buildEvaluationPrompt(input);
      expect(prompt).toContain("Who is your target user or customer?");
      expect(prompt).toContain("Busy parents");
      expect(prompt).toContain("What specific pain point or frustration does this solve?");
      expect(prompt).toContain("Time management");
      expect(prompt).toContain("How might you charge for this?");
      expect(prompt).toContain("$10/month");
    });

    it("should handle unknown question IDs", () => {
      const input: EvaluationInput = {
        idea: {
          description: "Test idea",
        },
        clarifiers: [
          {
            questionId: "unknown-question",
            answer: "Unknown answer",
          },
        ],
      };

      const prompt = buildEvaluationPrompt(input);
      expect(prompt).toContain("unknown-question");
      expect(prompt).toContain("Unknown answer");
    });

    it("should include all required prompt sections", () => {
      const input: EvaluationInput = {
        idea: {
          description: "Test idea description",
        },
        clarifiers: [],
      };

      const prompt = buildEvaluationPrompt(input);
      expect(prompt).toContain("Idea Description:");
      expect(prompt).toContain("Clarifying Questions & Answers:");
      expect(prompt).toContain("Evaluation Framework:");
      expect(prompt).toContain("Problem & Persona");
      expect(prompt).toContain("MVP Scope");
      expect(prompt).toContain("Validation Experiments");
      expect(prompt).toContain("Risks & Mitigation");
      expect(prompt).toContain("KPIs");
      expect(prompt).toContain("Scoring");
      expect(prompt).toContain("IMPORTANT: Return your evaluation as valid JSON");
    });

    it("should handle empty clarifiers array", () => {
      const input: EvaluationInput = {
        idea: {
          description: "Test idea",
        },
        clarifiers: [],
      };

      const prompt = buildEvaluationPrompt(input);
      expect(prompt).toBeTruthy();
      expect(prompt.length).toBeGreaterThan(0);
    });
  });
});

