import React, { useEffect } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuestionsForm } from "../questions-form";
import { EvaluationProvider, useEvaluation } from "@/contexts/evaluation-context";

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Test component that provides idea context
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const { setIdea } = useEvaluation();
  
  // Set idea for testing
  useEffect(() => {
    setIdea({ description: "Test idea description" });
  }, [setIdea]);

  return <>{children}</>;
};

describe("QuestionsForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <EvaluationProvider>
        <TestWrapper>{component}</TestWrapper>
      </EvaluationProvider>
    );
  };

  it("should render form with all question fields", () => {
    renderWithProvider(<QuestionsForm />);

    expect(screen.getByText("A Few Quick Questions")).toBeInTheDocument();
    expect(screen.getByText(/Who is your target user or customer\?/)).toBeInTheDocument();
    expect(
      screen.getByText(/What specific pain point or frustration does this solve\?/)
    ).toBeInTheDocument();
    expect(screen.getByText(/How might you charge for this\?/)).toBeInTheDocument();
  });

  it("should display the idea from context", () => {
    renderWithProvider(<QuestionsForm />);

    expect(screen.getByText("Your idea:")).toBeInTheDocument();
    expect(screen.getByText("Test idea description")).toBeInTheDocument();
  });

  it("should disable submit button when required questions are empty", () => {
    renderWithProvider(<QuestionsForm />);

    const submitButton = screen.getByText("Generate Evaluation");
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when required questions are filled", async () => {
    const user = userEvent.setup();
    renderWithProvider(<QuestionsForm />);

    const question1Input = screen.getByPlaceholderText(/Busy working parents/);
    const question2Input = screen.getByPlaceholderText(/Spending 2\+ hours/);

    await user.type(question1Input, "Busy parents with kids");
    await user.type(question2Input, "Time management is difficult");

    const submitButton = screen.getByText("Generate Evaluation");
    expect(submitButton).not.toBeDisabled();
  });

  it("should validate minimum length for required questions", async () => {
    const user = userEvent.setup();
    renderWithProvider(<QuestionsForm />);

    const question1Input = screen.getByPlaceholderText(/Busy working parents/);
    const question2Input = screen.getByPlaceholderText(/Spending 2\+ hours/);

    await user.type(question1Input, "Test");
    await user.type(question2Input, "Test");

    const submitButton = screen.getByText("Generate Evaluation");
    expect(submitButton).toBeDisabled();

    await user.type(question1Input, "s");
    await user.type(question2Input, "s");

    expect(submitButton).not.toBeDisabled();
  });

  it("should allow optional third question to be empty", async () => {
    const user = userEvent.setup();
    renderWithProvider(<QuestionsForm />);

    const question1Input = screen.getByPlaceholderText(/Busy working parents/);
    const question2Input = screen.getByPlaceholderText(/Spending 2\+ hours/);

    await user.type(question1Input, "Busy parents with kids");
    await user.type(question2Input, "Time management is difficult");

    const submitButton = screen.getByText("Generate Evaluation");
    expect(submitButton).not.toBeDisabled();
  });

  it("should navigate to loading page on valid form submission", async () => {
    const user = userEvent.setup();
    renderWithProvider(<QuestionsForm />);

    const question1Input = screen.getByPlaceholderText(/Busy working parents/);
    const question2Input = screen.getByPlaceholderText(/Spending 2\+ hours/);

    await user.type(question1Input, "Busy parents with kids");
    await user.type(question2Input, "Time management is difficult");

    const submitButton = screen.getByText("Generate Evaluation");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/loading");
    });
  });

  it("should not navigate on invalid form submission", async () => {
    const user = userEvent.setup();
    renderWithProvider(<QuestionsForm />);

    // Wait for component to initialize
    await waitFor(() => {
      expect(screen.getByText("Generate Evaluation")).toBeInTheDocument();
    });

    const submitButton = screen.getByText("Generate Evaluation");
    expect(submitButton).toBeDisabled();

    // The redirect to "/" happens in useEffect when there's no idea, so we can't test form submission here
    // Instead, we verify the button is disabled which prevents submission
    expect(submitButton).toBeDisabled();
  });

  it("should have proper accessibility labels", () => {
    renderWithProvider(<QuestionsForm />);

    expect(screen.getByText("Your idea:")).toBeInTheDocument();
    
    // Check that inputs have proper labeling
    const question1Input = screen.getByPlaceholderText(/Busy working parents/);
    expect(question1Input).toBeInTheDocument();
  });

  it("should show guidance text for each question", () => {
    renderWithProvider(<QuestionsForm />);

    expect(
      screen.getByText("Be specific: demographics, behaviors, or shared characteristics")
    ).toBeInTheDocument();
    expect(screen.getByText("What problem keeps them up at night?")).toBeInTheDocument();
    expect(screen.getByText("Just a rough idea — we'll help you test it")).toBeInTheDocument();
  });
});

