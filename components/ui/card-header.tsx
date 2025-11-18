import { BodyText } from "@/components/ui/body-text";
import type { ReactNode } from "react";

interface CardHeaderProps {
  icon: ReactNode;
  headerText: string;
  subheaderText: string;
}

/**
 * CardHeader Component
 * Reusable header section for cards with icon, title, and subtitle
 */
export function CardHeader({
  icon,
  headerText,
  subheaderText,
}: CardHeaderProps) {
  return (
    <div className="flex gap-3 items-center">
      <div className="bg-[#d0fae5] rounded-full size-12 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex flex-col">
        <h2 className="text-base font-normal text-[#0f172b] leading-6 tracking-[-0.3125px]">
          {headerText}
        </h2>
        <BodyText text={subheaderText} />
      </div>
    </div>
  );
}

