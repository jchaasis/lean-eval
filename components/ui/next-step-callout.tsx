import type { LucideIcon } from "lucide-react";

interface NextStepCalloutProps {
  content: string;
  icon: LucideIcon;
  variant?: "info" | "success" | "warning" | "danger";
}

const variantStyles = {
  info: { bg: "bg-blue-50", border: "border-[#bedbff]" },
  success: { bg: "bg-green-50", border: "border-[#b9f8cf]" },
  warning: { bg: "bg-pink-50", border: "border-[#fccee8]" },
  danger: { bg: "bg-red-50", border: "border-[#ffc9c9]" },
} as const;

/**
 * Next Step Callout Component
 * Reusable callout component for displaying next steps with different variants
 */
export function NextStepCallout({
  content,
  icon: Icon,
  variant = "info",
}: NextStepCalloutProps) {
  const styles = variantStyles[variant];
  return (
    <div
      className={`${styles.bg} border ${styles.border} rounded-[10px] pt-[17px] px-[17px] pb-0 mt-2`}
    >
      <div className="flex gap-3 items-start pb-4">
        <Icon className="size-5 text-[#0f172b] shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px] mb-1">
            Next Step
          </p>
          <p className="text-sm font-normal text-[#314158] leading-5 tracking-[-0.1504px]">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
}

