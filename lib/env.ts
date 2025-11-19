import "server-only";

import { z } from "zod";

/**
 * Environment variable schema validation
 * Ensures all required environment variables are present and valid
 * 
 * This file is server-only and cannot be imported in client components.
 * This prevents sensitive environment variables from being exposed to the browser.
 */
const envSchema = z.object({
  // Anthropic API configuration
  ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY is required"),
  
  // Optional: Node environment
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

/**
 * Validated environment variables
 * Throws error if validation fails
 */
function getEnv() {
  try {
    return envSchema.parse({
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(
        `Invalid environment variables:\n${missingVars}\n\nPlease check your .env file.`
      );
    }
    throw error;
  }
}

export const env = getEnv();

