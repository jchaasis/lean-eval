import { cn } from "@/lib/utils";

interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
}

/**
 * PrimaryButton Component
 * Reusable primary action button with consistent styling
 */
export function PrimaryButton({
  text,
  onClick,
  disabled = false,
  type = "button",
  isLoading = false,
}: PrimaryButtonProps) {
  const isDisabled = disabled || isLoading;
  const displayText = isLoading ? "Loading..." : text;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "bg-[#030213] text-white rounded-lg h-10 text-sm font-medium leading-5 tracking-[-0.1504px] flex items-center justify-center transition-opacity",
        !isDisabled
          ? "opacity-100 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#030213] focus:ring-offset-2"
          : "opacity-50 cursor-not-allowed"
      )}
      aria-disabled={isDisabled}
    >
      {displayText}
    </button>
  );
}

