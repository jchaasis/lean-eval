import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Card Component
 * White card container with border and rounded corners matching Figma design
 */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-[10px]",
        className
      )}
    >
      {children}
    </div>
  );
}

