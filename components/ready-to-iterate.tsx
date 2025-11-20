"use client";

interface ReadyToIterateProps {
  onNewEvaluation: () => void;
}

/**
 * Ready to Iterate Section
 * Bottom CTA section encouraging users to iterate or start fresh
 */
export function ReadyToIterate({ onNewEvaluation }: ReadyToIterateProps) {
  return (
    <div
      className="border border-[#a4f4cf] rounded-[10px] pt-[25px] px-[25px] pb-[25px]"
      style={{
        background: "linear-gradient(to right, #ecfdf5, #f0fdfa)",
      }}
    >
      <h3 className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] mb-4">
        Ready to Iterate?
      </h3>
      <p className="text-base font-normal text-[#45556c] leading-6 tracking-[-0.3125px] mb-6">
        Start fresh with a refined version of your idea to explore alternative angles.
      </p>
      <button
        onClick={onNewEvaluation}
        className="bg-white border border-[rgba(0,0,0,0.1)] h-9 rounded-lg px-4 text-sm font-medium text-neutral-950 leading-5 tracking-[-0.1504px] hover:bg-slate-50 transition-colors"
        aria-label="Evaluate Another Idea"
      >
        Evaluate Another Idea
      </button>
    </div>
  );
}

