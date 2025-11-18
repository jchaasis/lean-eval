"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lightbulb, RefreshCw } from "lucide-react";
import { useEvaluation } from "@/contexts/evaluation-context";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import { PrimaryButton } from "@/components/ui/primary-button";
import type { IdeaInput } from "@/types/evaluation";

const MIN_IDEA_LENGTH = 10;
const MAX_IDEA_LENGTH = 500;

const EXAMPLE_IDEAS = [
  "A Chrome extension that summarizes meeting notes using AI",
  "A marketplace connecting local farmers directly with restaurants",
  "An app that gamifies learning to code for kids",
] as const;

/**
 * Idea Intake Form Component
 * Client component for capturing user's startup idea with validation
 */
export function IdeaIntakeForm() {
  const [ideaText, setIdeaText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { setIdea } = useEvaluation();

  const characterCount = ideaText.length;
  const isValid = characterCount >= MIN_IDEA_LENGTH && characterCount <= MAX_IDEA_LENGTH;

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= MAX_IDEA_LENGTH) {
      setIdeaText(newValue);
    }
  };

  const handleExampleClick = (example: string) => {
    setIdeaText(example);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    const ideaInput: IdeaInput = {
      description: ideaText.trim(),
    };
    setIdea(ideaInput);
    router.push("/questions");
  };

  return (
    <Card className="flex flex-col gap-6 pt-[33px] px-[33px] pb-1">
      {/* Icon + Heading Section */}
      <CardHeader
        icon={<Lightbulb className="size-6 text-[#0f172b]" aria-hidden="true" />}
        headerText="Describe Your Idea"
        subheaderText="In 1-3 sentences, what are you building and why?"
      />

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Textarea Section */}
        <div className="flex flex-col gap-2">
          <textarea
            id="idea-description"
            value={ideaText}
            onChange={handleTextChange}
            placeholder="Example: A mobile app that helps busy parents plan weekly meals based on their family's dietary preferences, reducing food waste and saving time on grocery shopping..."
            className="bg-[#f3f3f5] border-0 rounded-lg h-40 px-3 py-2 text-sm text-[#0f172b] placeholder:text-[#90a1b9] leading-5 tracking-[-0.1504px] resize-none focus:outline-none focus:ring-2 focus:ring-[#009966] focus:ring-offset-2"
            aria-label="Describe your startup idea"
            aria-describedby="character-count"
          />
          <div
            id="character-count"
            className="text-sm text-[#62748e] tracking-[-0.1504px]"
            aria-live="polite"
          >
            {characterCount}/{MAX_IDEA_LENGTH} characters
          </div>
        </div>

        {/* Inspiration Section */}
        <div className="bg-slate-50 border border-slate-200 rounded-[10px] px-[17px] pt-[17px] pb-1 flex flex-col gap-2">
          <p className="text-sm font-normal text-[#45556c] leading-5 tracking-[-0.1504px]">
            Need inspiration? Try these examples:
          </p>
          <div className="flex flex-col gap-2 pb-4">
            {EXAMPLE_IDEAS.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleExampleClick(example)}
                className="text-left text-sm font-normal text-[#009966] leading-5 tracking-[-0.1504px] hover:underline focus:outline-none focus:ring-2 focus:ring-[#009966] focus:ring-offset-2 rounded px-2 py-1 -mx-2 -my-1"
                aria-label={`Use example: ${example}`}
              >
                &quot;{example}&quot;
              </button>
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <PrimaryButton
          type="submit"
          text="Continue to Questions →"
          disabled={!isValid}
          isLoading={isSubmitting}
        />
      </form>
    </Card>
  );
}

/**
 * Refresh Button Component
 * Resets the form and clears state
 */
export function RefreshButton() {
  const { clearEvaluation } = useEvaluation();
  const router = useRouter();

  const handleRefresh = () => {
    clearEvaluation();
    router.push("/");
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      className="rounded-full size-9 flex items-center justify-center hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors"
      aria-label="Refresh and start over"
    >
      <RefreshCw className="size-4 text-[#0f172b]" aria-hidden="true" />
    </button>
  );
}

