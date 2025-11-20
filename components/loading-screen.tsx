"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoadingTask } from "@/components/ui/loading-task";
import { useEvaluation } from "@/contexts/evaluation-context";
import { generateEvaluation } from "@/app/actions/evaluation";

const MIN_LOAD_TIME_MS = 8000; // 8 seconds minimum

const TASKS = [
  {
    id: "problem-fit",
    icon: Target,
    text: "Analyzing problem-market fit...",
  },
  {
    id: "mvp-scope",
    icon: Lightbulb,
    text: "Defining MVP scope...",
  },
  {
    id: "metrics",
    icon: TrendingUp,
    text: "Calculating validation metrics...",
  },
  {
    id: "insights",
    icon: Sparkles,
    text: "Generating insights...",
  },
] as const;

/**
 * LoadingScreen Component
 * Client component that displays loading animation and triggers AI evaluation
 */
export function LoadingScreen() {
  const router = useRouter();
  const { idea, clarifiers, setEvaluationResult } = useEvaluation();
  const [progress, setProgress] = useState(0);
  const [activeTaskIndex, setActiveTaskIndex] = useState<number | null>(null);
  const [_isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Use refs to store interval/timeout IDs to prevent closure issues
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const taskTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isEvaluatingRef = useRef(false);

  // Validate required data - compute error state instead of setting in effect
  const validationError = useMemo(
    () =>
      !idea || clarifiers.length === 0
        ? "Missing required data. Please go back and complete the form."
        : null,
    [idea, clarifiers]
  );

  // Combine validation error with async error for display
  const displayError = validationError || error;

  useEffect(() => {
    // If validation fails, don't run the effect
    // Use setTimeout to defer state update and avoid synchronous setState in effect
    if (validationError) {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    // Prevent multiple simultaneous evaluations
    if (isEvaluatingRef.current) {
      return;
    }

    // Reset state for new evaluation
    // Use setTimeout to defer state updates and avoid synchronous setState in effect
    setTimeout(() => {
      setProgress(0);
      setActiveTaskIndex(null);
      setError(null);
      setIsLoading(true);
    }, 0);
    isEvaluatingRef.current = true;

    // Clear any existing intervals/timeouts
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    taskTimeoutsRef.current.forEach(clearTimeout);
    taskTimeoutsRef.current = [];

    // Start progress animation
    // To reach 90% over ~8 seconds: 90 increments of 1% each at ~89ms intervals
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          return 90;
        }
        return prev + 1; // Increment by 1% every ~89ms to reach 90% in ~8 seconds
      });
    }, 89);

    // Animate tasks sequentially
    TASKS.forEach((_, index) => {
      const delay = (index + 1) * 2000; // 2000ms (2s) between each task, spread over 8 seconds
      const timeout = setTimeout(() => {
        setActiveTaskIndex(index);
      }, delay);
      taskTimeoutsRef.current.push(timeout);
    });

    // Trigger evaluation
    const evaluateIdea = async () => {
      try {
        const evaluationStartTime = Date.now();
        // At this point, we know idea is not null due to validation check above
        const result = await generateEvaluation({
          idea: idea!,
          clarifiers,
        });

        const evaluationDuration = Date.now() - evaluationStartTime;
        const remainingTime = Math.max(
          0,
          MIN_LOAD_TIME_MS - evaluationDuration
        );

        // Wait for minimum load time
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
        // Complete progress
        setProgress(90);
        setActiveTaskIndex(TASKS.length - 1);

        // Store result in context
        setEvaluationResult(result);

        // Navigate to dashboard
        router.push("/dashboard");
      } catch (err) {
        console.error("Evaluation error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to generate evaluation. Please try again."
        );
        setIsLoading(false);
        isEvaluatingRef.current = false;
        
        // Clean up intervals/timeouts on error
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        taskTimeoutsRef.current.forEach(clearTimeout);
        taskTimeoutsRef.current = [];
      }
    };

    evaluateIdea();

    return () => {
      // Cleanup on unmount or when dependencies change
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      taskTimeoutsRef.current.forEach(clearTimeout);
      taskTimeoutsRef.current = [];
      isEvaluatingRef.current = false;
    };
  }, [idea, clarifiers, router, setEvaluationResult, retryCount, validationError]);

  const handleRetry = () => {
    // Reset evaluation flag to allow new evaluation
    isEvaluatingRef.current = false;
    // Clear any existing intervals/timeouts
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    taskTimeoutsRef.current.forEach(clearTimeout);
    taskTimeoutsRef.current = [];
    
    // Reset state
    setError(null);
    setIsLoading(true);
    setProgress(0);
    setActiveTaskIndex(null);
    // Increment retry count to trigger effect re-run
    setRetryCount((prev) => prev + 1);
  };

  if (displayError) {
    return (
      <Card className="flex flex-col gap-6 pt-[49px] px-[208px] pb-4 min-h-[518px] items-center justify-center">
        <div className="flex flex-col gap-4 items-center text-center max-w-md">
          <div className="size-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl" aria-hidden="true">
              ⚠️
            </span>
          </div>
          <h2 className="text-base font-normal text-[#0f172b] leading-6">
            Evaluation Failed
          </h2>
          <p className="text-sm font-normal text-[#45556c] leading-5">
            {displayError}
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-[#030213] text-white rounded-lg hover:opacity-90 transition-opacity text-sm"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/questions")}
              className="px-4 py-2 bg-white border border-slate-200 text-[#0f172b] rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col pt-[49px] px-[208px] pb-1 min-h-[518px]">
      <div className="h-[420px] relative shrink-0 w-full flex flex-col items-center">
        {/* Loading Icon */}
        <div className="relative size-24 mb-8">
          <div className="absolute border-4 border-[#a4f4cf] rounded-full size-[102px] -left-[3px] -top-[3px] animate-ring-pulse" />
          <div className="absolute bg-[#d0fae5] opacity-[0.924] rounded-full size-[72px] left-3 top-3 flex items-center justify-center">
            <Sparkles className="size-8 text-white" aria-hidden="true" />
          </div>
        </div>

        {/* Status Text */}
        <h2 className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] text-center mb-2">
          Evaluating your idea...
        </h2>
        <p className="text-base font-normal text-[#45556c] leading-6 tracking-[-0.3125px] text-center mb-8">
          This will take just a moment
        </p>

        {/* Tasks List */}
        <div className="flex flex-col gap-3 w-full mb-8">
          {TASKS.map((task, index) => (
            <LoadingTask
              key={task.id}
              icon={task.icon}
              text={task.text}
              isActive={activeTaskIndex === index}
              isCompleted={activeTaskIndex !== null && activeTaskIndex > index}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="bg-slate-100 rounded-full h-2 w-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00bc7d] to-[#009966] h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Evaluation progress"
          />
        </div>
      </div>
    </Card>
  );
}

