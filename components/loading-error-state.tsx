"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

interface LoadingErrorStateProps {
  error: string;
  onRetry: () => void;
}

/**
 * LoadingErrorState Component
 * Displays error state when evaluation fails
 */
export function LoadingErrorState({ error, onRetry }: LoadingErrorStateProps) {
  const router = useRouter();

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
          {error}
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={onRetry}
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

