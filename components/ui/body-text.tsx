import { cn } from "@/lib/utils";

interface BodyTextProps {
  text: string;
  className?: string;
}

/**
 * BodyText Component
 * Reusable component for body text with consistent styling
 */
export function BodyText({ text, className }: BodyTextProps) {
  return (
    <p
      className={cn(
        "text-sm font-normal text-[#45556c] leading-5 tracking-[-0.1504px]",
        className
      )}
    >
      {text}
    </p>
  );
}

