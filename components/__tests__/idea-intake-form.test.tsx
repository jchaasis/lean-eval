import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IdeaIntakeForm } from "../idea-intake-form";
import { EvaluationProvider } from "@/contexts/evaluation-context";

// Mock Next.js router
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("IdeaIntakeForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(<EvaluationProvider>{component}</EvaluationProvider>);
  };

  it("should render form with all elements", () => {
    renderWithProvider(<IdeaIntakeForm />);

    expect(screen.getByText("Describe Your Idea")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Describe your startup idea")
    ).toBeInTheDocument();
    expect(screen.getByText("Continue to Questions →")).toBeInTheDocument();
    expect(screen.getByText("Need inspiration? Try these examples:")).toBeInTheDocument();
  });

  it("should disable submit button when textarea is empty", () => {
    renderWithProvider(<IdeaIntakeForm />);

    const submitButton = screen.getByText("Continue to Questions →");
    expect(submitButton).toBeDisabled();
  });

  it("should enable submit button when textarea has valid length", async () => {
    const user = userEvent.setup();
    renderWithProvider(<IdeaIntakeForm />);

    const textarea = screen.getByLabelText("Describe your startup idea");
    await user.type(textarea, "This is a valid idea description that is long enough");

    const submitButton = screen.getByText("Continue to Questions →");
    expect(submitButton).not.toBeDisabled();
  });

  it("should update character count as user types", async () => {
    const user = userEvent.setup();
    renderWithProvider(<IdeaIntakeForm />);

    const textarea = screen.getByLabelText("Describe your startup idea");
    await user.type(textarea, "Test idea");

    expect(screen.getByText("9/500 characters")).toBeInTheDocument();
  });

  it("should not allow input beyond 500 characters", async () => {
    const user = userEvent.setup();
    renderWithProvider(<IdeaIntakeForm />);

    const textarea = screen.getByLabelText("Describe your startup idea");
    const longText = "a".repeat(500);
    
    // Type up to the limit
    await user.type(textarea, longText);
    
    // Try to type one more character
    fireEvent.change(textarea, { target: { value: longText + "a" } });

    // Should still be at 500 characters due to max length enforcement
    expect(textarea).toHaveValue(longText);
    expect(screen.getByText("500/500 characters")).toBeInTheDocument();
  });

  it("should populate textarea when example is clicked", async () => {
    const user = userEvent.setup();
    renderWithProvider(<IdeaIntakeForm />);

    const exampleButton = screen.getByLabelText(
      /Use example: A Chrome extension that summarizes meeting notes using AI/
    );
    await user.click(exampleButton);

    const textarea = screen.getByLabelText("Describe your startup idea");
    expect(textarea).toHaveValue(
      "A Chrome extension that summarizes meeting notes using AI"
    );
  });

  it("should navigate to questions page on valid form submission", async () => {
    const user = userEvent.setup();
    renderWithProvider(<IdeaIntakeForm />);

    const textarea = screen.getByLabelText("Describe your startup idea");
    await user.type(
      textarea,
      "This is a valid idea description that is long enough to pass validation"
    );

    const submitButton = screen.getByText("Continue to Questions →");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/questions");
    });
  });

  it("should not navigate on invalid form submission", async () => {
    const user = userEvent.setup();
    renderWithProvider(<IdeaIntakeForm />);

    const textarea = screen.getByLabelText("Describe your startup idea");
    await user.type(textarea, "Short");

    const submitButton = screen.getByText("Continue to Questions →");
    expect(submitButton).toBeDisabled();

    const form = screen.getByText("Continue to Questions →").closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should have proper accessibility attributes", () => {
    renderWithProvider(<IdeaIntakeForm />);

    const textarea = screen.getByLabelText("Describe your startup idea");
    expect(textarea).toHaveAttribute("aria-label", "Describe your startup idea");
    expect(textarea).toHaveAttribute("aria-describedby", "character-count");

    const characterCount = screen.getByText("0/500 characters");
    expect(characterCount).toHaveAttribute("id", "character-count");
    expect(characterCount).toHaveAttribute("aria-live", "polite");
  });

  it("should validate minimum length requirement", async () => {
    const user = userEvent.setup();
    renderWithProvider(<IdeaIntakeForm />);

    const textarea = screen.getByLabelText("Describe your startup idea");
    await user.type(textarea, "Short");

    const submitButton = screen.getByText("Continue to Questions →");
    expect(submitButton).toBeDisabled();

    await user.type(textarea, "This is now long enough");
    expect(submitButton).not.toBeDisabled();
  });
});

