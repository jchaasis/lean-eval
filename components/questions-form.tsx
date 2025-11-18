"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { useEvaluation } from "@/contexts/evaluation-context";
import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card-header";
import { QuestionField } from "@/components/ui/question-field";
import { PrimaryButton } from "@/components/ui/primary-button";
import { BackButton } from "@/components/ui/back-button";
import type { ClarifierResponse } from "@/types/evaluation";

const MIN_ANSWER_LENGTH = 5;

/**
 * Questions Form Component
 * Client component for collecting follow-up clarifier questions
 */
export function QuestionsForm() {
  const router = useRouter();
  const { idea, setClarifiers } = useEvaluation();

  const [question1, setQuestion1] = useState("");
  const [question2, setQuestion2] = useState("");
  const [question3, setQuestion3] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isQuestion1Valid = question1.trim().length >= MIN_ANSWER_LENGTH;
  const isQuestion2Valid = question2.trim().length >= MIN_ANSWER_LENGTH;
  const isFormValid = isQuestion1Valid && isQuestion2Valid;

  // Store responses in context as user types
  useEffect(() => {
    const responses: ClarifierResponse[] = [];

    if (question1.trim()) {
      responses.push({
        questionId: "target-user",
        answer: question1.trim(),
      });
    }

    if (question2.trim()) {
      responses.push({
        questionId: "pain-point",
        answer: question2.trim(),
      });
    }

    if (question3.trim()) {
      responses.push({
        questionId: "pricing",
        answer: question3.trim(),
      });
    }

    setClarifiers(responses);
  }, [question1, question2, question3, setClarifiers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);

    // Final clarifier responses
    const responses: ClarifierResponse[] = [
      {
        questionId: "target-user",
        answer: question1.trim(),
      },
      {
        questionId: "pain-point",
        answer: question2.trim(),
      },
    ];

    if (question3.trim()) {
      responses.push({
        questionId: "pricing",
        answer: question3.trim(),
      });
    }

    setClarifiers(responses);
    router.push("/loading");
  };

  if (!idea) {
    // Redirect to home if no idea is set
    router.push("/");
    return null;
  }

  return (
    <Card className="flex flex-col gap-6 pt-[33px] px-[33px] pb-[33px]">
      {/* Card Header */}
      <CardHeader
        icon={
          <MessageCircle className="size-6 text-[#0f172b]" aria-hidden="true" />
        }
        headerText="A Few Quick Questions"
        subheaderText="Help us understand your idea better"
      />

      {/* Your Idea Section */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-normal text-[#0f172b] leading-5">
          Your idea:
        </label>
        <div className="text-sm text-[#45556c] leading-5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
          {idea.description}
        </div>
      </div>

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <QuestionField
            questionNumber={1}
            questionText="Who is your target user or customer?"
            isRequired={true}
            placeholder="e.g., Busy working parents with kids under 10"
            guidanceText="Be specific: demographics, behaviors, or shared characteristics"
            value={question1}
            onChange={setQuestion1}
          />

          <QuestionField
            questionNumber={2}
            questionText="What specific pain point or frustration does this solve?"
            isRequired={true}
            placeholder="e.g., Spending 2+ hours weekly on meal planning and grocery lists"
            guidanceText="What problem keeps them up at night?"
            value={question2}
            onChange={setQuestion2}
          />

          <QuestionField
            questionNumber={3}
            questionText="How might you charge for this? (Optional)"
            isRequired={false}
            placeholder="e.g., $10/month subscription or free with premium tier"
            guidanceText="Just a rough idea — we'll help you test it"
            value={question3}
            onChange={setQuestion3}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <BackButton />
          <PrimaryButton
            type="submit"
            text="Generate Evaluation"
            disabled={!isFormValid}
            isLoading={isSubmitting}
            showArrow={true}
          />
        </div>
      </form>
    </Card>
  );
}

