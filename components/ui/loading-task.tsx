"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface LoadingTaskProps {
  icon: LucideIcon;
  text: string;
  isActive?: boolean;
  isCompleted?: boolean;
}

/**
 * LoadingTask Component
 * Individual task item in the loading screen with icon and text
 */
export function LoadingTask({
  icon: Icon,
  text,
  isActive = false,
  isCompleted = false,
}: LoadingTaskProps) {
  return (
    <div className="flex gap-3 h-8 items-center relative shrink-0 w-full">
      <div
        className={cn(
          "bg-slate-100 relative rounded-full shrink-0 size-8 flex items-center justify-center",
          isActive && "bg-[#d0fae5]",
          isCompleted && "bg-[#d0fae5]"
        )}
      >
        <Icon
          className={cn(
            "size-4",
            isActive || isCompleted ? "text-[#009966]" : "text-[#314158]"
          )}
          aria-hidden="true"
        />
      </div>
      <p
        className={cn(
          "text-sm font-normal text-[#314158] leading-5 tracking-[-0.1504px]",
          (isActive || isCompleted) && "text-[#009966]"
        )}
      >
        {text}
      </p>
    </div>
  );
}

