"use server";

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { env } from "@/lib/env";
import {
  evaluationResponseSchema,
  buildEvaluationPrompt,
  calculateCompositeScore,
} from "@/lib/evaluation-utils";
import type {
  EvaluationInput,
  EvaluationResult,
  ProblemAndPersona,
  MVPScope,
  Experiment,
  Risk,
  KPI,
  ScoringDimensions,
} from "@/types/evaluation";

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

/**
 * Server Action to generate evaluation using Anthropic Claude
 * Validates response against Zod schema and retries once on failure
 */
export async function generateEvaluation(
  input: EvaluationInput
): Promise<EvaluationResult> {
  const prompt = buildEvaluationPrompt(input);
  console.log("prompt", prompt);
  let lastError: Error | null = null;
  // TODO: add to env
  let model = "claude-sonnet-4-5-20250929";
  // Retry once on schema validation failure
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      console.log("attempt number ", attempt);
      const response = await anthropic.messages.create({
        model,
        max_tokens: 4000,
        temperature: 0.3, // Lower temperature for more deterministic output
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      console.log("response", response);

      const content = response.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type from Anthropic API");
      }

      // Parse JSON from response
      let jsonText = content.text.trim();
      
      // Remove markdown code blocks if present (handles ```json, ```, or other variants)
      // Match code blocks that may be at the start or anywhere in the text
      const codeBlockMatch = jsonText.match(/```(?:json)?\s*\n([\s\S]*?)\n```/);
      if (codeBlockMatch) {
        jsonText = codeBlockMatch[1].trim();
      }
      
      // If text doesn't start with {, find the first { to extract JSON
      if (!jsonText.startsWith("{")) {
        const firstBrace = jsonText.indexOf("{");
        if (firstBrace !== -1) {
          jsonText = jsonText.slice(firstBrace);
        }
      }
      
      // Try to parse JSON. If it fails with "unexpected character after JSON",
      // try to find the valid JSON substring by attempting progressively shorter slices
      let parsed: unknown;
      try {
        parsed = JSON.parse(jsonText);
      } catch (error) {
        if (
          error instanceof SyntaxError &&
          error.message.includes("after JSON")
        ) {
          // There's trailing text after valid JSON
          // Try to find the end of valid JSON by testing progressively shorter substrings
          let found = false;
          for (let end = jsonText.length; end > 0 && !found; end--) {
            try {
              const candidate = jsonText.slice(0, end).trim();
              // Ensure it ends with } (valid JSON object)
              if (candidate.endsWith("}")) {
                parsed = JSON.parse(candidate);
                found = true;
                jsonText = candidate;
              }
            } catch {
              // Continue trying shorter substrings
            }
          }
          if (!found) {
            throw error;
          }
        } else {
          throw error;
        }
      }

      const validated = evaluationResponseSchema.parse(parsed);

      // Calculate composite score
      const compositeScore = calculateCompositeScore(validated.scoring);

      // Build result object
      const result: EvaluationResult = {
        problemAndPersona: validated.problemAndPersona as ProblemAndPersona,
        mvpScope: validated.mvpScope as MVPScope,
        experiments: validated.experiments as readonly Experiment[],
        risks: validated.risks as readonly Risk[],
        kpis: validated.kpis as readonly KPI[],
        scoring: validated.scoring as ScoringDimensions,
        compositeScore,
        timestamp: new Date().toISOString(),
      };

      return result;
    } catch (error) {
      lastError =
        error instanceof Error
          ? error
          : new Error("Unknown error during evaluation");

      // If it's a validation error and we have retries left, continue
      if (error instanceof z.ZodError && attempt === 0) {
        console.warn("Schema validation failed, retrying...", error.errors);
        continue;
      }

      console.error("Error during evaluation", error);

      // Otherwise, throw
      throw lastError;
    }
  }

  // Should never reach here, but TypeScript needs this
  throw lastError || new Error("Failed to generate evaluation");
}

