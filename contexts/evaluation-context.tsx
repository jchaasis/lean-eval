"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  IdeaInput,
  ClarifierResponse,
  EvaluationResult,
} from "@/types/evaluation";

interface EvaluationContextValue {
  idea: IdeaInput | null;
  clarifiers: readonly ClarifierResponse[];
  evaluationResult: EvaluationResult | null;
  setIdea: (idea: IdeaInput) => void;
  setClarifiers: (clarifiers: readonly ClarifierResponse[]) => void;
  setEvaluationResult: (result: EvaluationResult) => void;
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
  const [evaluationResult, setEvaluationResultState] =
    useState<EvaluationResult | null>(null);

  const setIdea = useCallback((newIdea: IdeaInput) => {
    setIdeaState(newIdea);
  }, []);

  const setClarifiers = useCallback(
    (newClarifiers: readonly ClarifierResponse[]) => {
      setClarifiersState(newClarifiers);
    },
    []
  );

  const setEvaluationResult = useCallback((result: EvaluationResult) => {
    setEvaluationResultState(result);
  }, []);

  const clearEvaluation = useCallback(() => {
    setIdeaState(null);
    setClarifiersState([]);
    setEvaluationResultState(null);
  }, []);

  const value = useMemo(
    () => ({
      idea,
      clarifiers,
      evaluationResult,
      setIdea,
      setClarifiers,
      setEvaluationResult,
      clearEvaluation,
    }),
    [idea, clarifiers, evaluationResult, setIdea, setClarifiers, setEvaluationResult, clearEvaluation]
  );

  return (
    <EvaluationContext.Provider value={value}>
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

