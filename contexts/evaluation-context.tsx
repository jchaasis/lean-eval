"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { IdeaInput, ClarifierResponse } from "@/types/evaluation";

interface EvaluationContextValue {
  idea: IdeaInput | null;
  clarifiers: readonly ClarifierResponse[];
  setIdea: (idea: IdeaInput) => void;
  setClarifiers: (clarifiers: readonly ClarifierResponse[]) => void;
  clearEvaluation: () => void;
}

const EvaluationContext = createContext<EvaluationContextValue | undefined>(
  undefined
);

/**
 * Evaluation Context Provider
 * Manages in-memory state for idea and clarifier responses during the evaluation flow
 */
export function EvaluationProvider({ children }: { children: ReactNode }) {
  const [idea, setIdeaState] = useState<IdeaInput | null>(null);
  const [clarifiers, setClarifiersState] = useState<
    readonly ClarifierResponse[]
  >([]);

  const setIdea = (newIdea: IdeaInput) => {
    setIdeaState(newIdea);
  };

  const setClarifiers = (newClarifiers: readonly ClarifierResponse[]) => {
    setClarifiersState(newClarifiers);
  };

  const clearEvaluation = () => {
    setIdeaState(null);
    setClarifiersState([]);
  };

  return (
    <EvaluationContext.Provider
      value={{
        idea,
        clarifiers,
        setIdea,
        setClarifiers,
        clearEvaluation,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
}

/**
 * Hook to access evaluation context
 * Throws error if used outside EvaluationProvider
 */
export function useEvaluation() {
  const context = useContext(EvaluationContext);
  if (context === undefined) {
    throw new Error("useEvaluation must be used within an EvaluationProvider");
  }
  return context;
}

