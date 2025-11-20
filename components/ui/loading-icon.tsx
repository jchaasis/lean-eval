import { Sparkles } from "lucide-react";

/**
 * LoadingIcon Component
 * Displays an animated loading icon with a sparkle symbol on a teal-green gradient background
 */
export function LoadingIcon() {
  return (
    <div className="relative size-24 mb-8">
      <div className="absolute border-4 border-[#a4f4cf] rounded-full size-[102px] -left-[3px] -top-[3px] animate-ring-pulse" />
      <div className="absolute bg-gradient-to-r from-[#00bc7d] to-[#009966] rounded-full size-[72px] left-3 top-3 flex items-center justify-center">
        <Sparkles className="size-8 text-white" aria-hidden="true" />
      </div>
    </div>
  );
}

