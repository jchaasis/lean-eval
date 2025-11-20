# Code Review: LeanEval React/Next.js Project

**Reviewer:** Claude (Elite React & Next.js Developer)
**Date:** 2025-11-20
**Project:** LeanEval - AI-Powered Startup Idea Validation Tool

---

## Executive Summary

The LeanEval codebase demonstrates **strong architectural decisions** and follows modern Next.js 16 best practices. The code is well-structured, type-safe, and leverages React Server Components effectively. However, there are opportunities for improvement in **code reusability, performance optimization, testing coverage, and error handling**.

**Overall Grade:** B+ (Very Good with room for excellence)

---

## 1. Code Duplication & Reusability

### 🔴 Critical: Duplicate "Next Step" Callout Components

**Location:** `components/evaluation-card-content/*.tsx`

**Issue:**
Each content component (problem-persona, mvp-scope, experiments, risks) contains duplicated "Next Step" callout markup with only styling variations.

**Current Code Pattern:**
```tsx
// Repeated 4 times with different colors/icons
<div className="bg-blue-50 border border-[#bedbff] rounded-[10px] pt-[17px] px-[17px] pb-0 mt-2">
  <div className="flex gap-3 items-start pb-4">
    <Info className="size-5 text-[#0f172b] shrink-0 mt-0.5" />
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
```

**Recommendation:**
Create a reusable `NextStepCallout` component:

```tsx
// components/ui/next-step-callout.tsx
import { type LucideIcon } from "lucide-react";

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

export function NextStepCallout({ content, icon: Icon, variant = "info" }: NextStepCalloutProps) {
  const styles = variantStyles[variant];
  return (
    <div className={`${styles.bg} border ${styles.border} rounded-[10px] pt-[17px] px-[17px] pb-0 mt-2`}>
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
```

**Impact:** Reduces ~120 lines of duplicated code, improves maintainability.

---

### 🟡 Medium: Duplicate Risk Grouping Logic

**Location:**
- `components/evaluation-card-content/risks-content.tsx:14-36`
- `lib/markdown-export.ts:19-33`

**Issue:**
Risk grouping and sorting logic is duplicated in two places.

**Recommendation:**
Extract to shared utility:

```tsx
// lib/utils/risks.ts
export function groupAndSortRisks(
  risks: readonly { category: string; description: string; mitigation: string }[]
): [string, typeof risks][] {
  const risksByCategory = risks.reduce((acc, risk) => {
    if (!acc[risk.category]) {
      acc[risk.category] = [];
    }
    acc[risk.category] = [...acc[risk.category], risk];
    return acc;
  }, {} as Record<string, typeof risks>);

  const preferredOrder = ["High Risk", "Medium Risk", "Low Risk"];
  const allCategories = Object.keys(risksByCategory);

  const sortedCategories = [
    ...preferredOrder.filter((cat) => allCategories.includes(cat)),
    ...allCategories
      .filter((cat) => !preferredOrder.includes(cat))
      .sort((a, b) => a.localeCompare(b)),
  ];

  return sortedCategories.map(category => [category, risksByCategory[category]]);
}
```

---

### 🟡 Medium: Duplicate Status Badge Logic

**Location:**
- `components/evaluation-report-summary.tsx:19-27`
- `lib/markdown-export.ts:6-14`

**Issue:**
Status text calculation is duplicated.

**Recommendation:**
Extract to shared utility:

```tsx
// lib/utils/scoring.ts
export function getStatusFromScore(score: number): "Strong" | "Moderate" | "Weak" {
  if (score >= 8.0) return "Strong";
  if (score >= 6.0) return "Moderate";
  return "Weak";
}

export function getStatusBadgeStyles(score: number) {
  const status = getStatusFromScore(score);
  const styles = {
    Strong: { bg: "bg-green-100", text: "text-[#008236]" },
    Moderate: { bg: "bg-yellow-100", text: "text-yellow-800" },
    Weak: { bg: "bg-red-100", text: "text-red-800" },
  };
  return { status, ...styles[status] };
}
```

---

## 2. Type Safety Issues

### 🔴 Critical: Unsafe Type Assertions in EvaluationCard

**Location:** `components/evaluation-card.tsx:46-60`

**Issue:**
Using type assertions (`as`) defeats TypeScript's type checking:

```tsx
case "problemAndPersona":
  return <ProblemPersonaContent data={data as ProblemAndPersona} />;
```

**Recommendation:**
Use discriminated unions for type-safe rendering:

```tsx
// types/evaluation.ts
export type EvaluationCardData =
  | { type: "problemAndPersona"; data: ProblemAndPersona }
  | { type: "mvpScope"; data: MVPScope }
  | { type: "experiments"; data: readonly Experiment[] }
  | { type: "risks"; data: readonly Risk[] }
  | { type: "kpis"; data: readonly KPI[] };

// components/evaluation-card.tsx
interface EvaluationCardProps {
  title: string;
  data: EvaluationCardData;
}

export function EvaluationCard({ title, data }: EvaluationCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const renderContent = () => {
    switch (data.type) {
      case "problemAndPersona":
        return <ProblemPersonaContent data={data.data} />;
      case "mvpScope":
        return <MVPScopeContent data={data.data} />;
      case "experiments":
        return <ExperimentsContent data={data.data} />;
      case "risks":
        return <RisksContent data={data.data} />;
      case "kpis":
        return <KPIsContent data={data.data} />;
    }
  };

  // ...
}
```

---

### 🟡 Medium: Missing Error Type Definitions

**Location:** Throughout the codebase

**Issue:**
Error handling uses generic `Error` type without domain-specific error types.

**Recommendation:**
Create custom error classes:

```tsx
// lib/errors.ts
export class EvaluationError extends Error {
  constructor(
    message: string,
    public readonly code: "VALIDATION_FAILED" | "AI_ERROR" | "NETWORK_ERROR",
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = "EvaluationError";
  }
}

export class ValidationError extends EvaluationError {
  constructor(message: string, public readonly errors: z.ZodError) {
    super(message, "VALIDATION_FAILED", true);
    this.name = "ValidationError";
  }
}

// Usage in app/actions/evaluation.ts
catch (error) {
  if (error instanceof z.ZodError && attempt === 0) {
    throw new ValidationError("Schema validation failed", error);
  }
  // ...
}
```

---

### 🟡 Medium: Context Memoization Dependency Issue

**Location:** `contexts/evaluation-context.tsx:64-75`

**Issue:**
The `useMemo` dependency array includes functions, which are already memoized with `useCallback`. This creates unnecessary dependency tracking.

**Current Code:**
```tsx
const value = useMemo(
  () => ({
    idea,
    clarifiers,
    evaluationResult,
    setIdea,
    setClarifiers,
    setEvaluationResult,
    clearEvaluation,
  }),
  [idea, clarifiers, evaluationResult, setIdea, setClarifiers, setEvaluationResult, clearEvaluation]
);
```

**Recommendation:**
Only include state values in dependencies (callbacks from `useCallback` are stable):

```tsx
const value = useMemo(
  () => ({
    idea,
    clarifiers,
    evaluationResult,
    setIdea,
    setClarifiers,
    setEvaluationResult,
    clearEvaluation,
  }),
  [idea, clarifiers, evaluationResult] // Functions are stable from useCallback
);
```

---

## 3. Performance Optimizations

### 🟡 Medium: Unnecessary Context Updates on Every Keystroke

**Location:** `components/questions-form.tsx:40-66`

**Issue:**
The form updates the global context state on every keystroke via `useEffect`, causing unnecessary re-renders across the component tree.

**Current Code:**
```tsx
useEffect(() => {
  const responses: ClarifierResponse[] = [];
  // ... builds responses array
  setClarifiers(responses);
}, [question1, question2, question3, setClarifiers]);
```

**Recommendation:**
Only update context on form submission:

```tsx
// Remove the useEffect that updates on every keystroke

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!isFormValid || isSubmitting) return;

  setIsSubmitting(true);

  // Build responses array once on submit
  const responses: ClarifierResponse[] = [
    { questionId: "target-user", answer: question1.trim() },
    { questionId: "pain-point", answer: question2.trim() },
  ];

  if (question3.trim()) {
    responses.push({ questionId: "pricing", answer: question3.trim() });
  }

  setClarifiers(responses);
  router.push("/loading");
};
```

**Impact:** Reduces unnecessary re-renders, improves form responsiveness.

---

### 🟢 Low: Add React.memo for Pure Components

**Location:** Various UI components

**Issue:**
Pure presentational components re-render unnecessarily when parent context changes.

**Recommendation:**
Wrap pure components with `React.memo`:

```tsx
// components/ui/card.tsx
export const Card = React.memo(function Card({ className, ...props }: CardProps) {
  return (
    <div className={cn("bg-white rounded-xl shadow-md", className)} {...props} />
  );
});

// components/score-card.tsx
export const ScoreCard = React.memo(function ScoreCard({ name, description, score, iconColor, progressColor }: ScoreCardProps) {
  // ...
});
```

---

### 🟢 Low: Optimize Large Component Bundles

**Location:** `components/loading-screen.tsx` (289 lines)

**Issue:**
Large, complex component with multiple responsibilities.

**Recommendation:**
Split into smaller, focused components:

```tsx
// components/loading-screen/index.tsx
export { LoadingScreen } from "./loading-screen";

// components/loading-screen/loading-screen.tsx
export function LoadingScreen() {
  // Only orchestration logic
  return (
    <Card>
      <LoadingContent progress={progress} activeTaskIndex={activeTaskIndex} />
    </Card>
  );
}

// components/loading-screen/loading-content.tsx
export function LoadingContent({ progress, activeTaskIndex }: LoadingContentProps) {
  return (
    <>
      <LoadingIcon />
      <LoadingTasks activeIndex={activeTaskIndex} />
      <ProgressBar progress={progress} />
    </>
  );
}

// components/loading-screen/use-evaluation-loader.ts
export function useEvaluationLoader() {
  // Extract all loading logic into custom hook
}
```

---

## 4. State Management & Side Effects

### 🔴 Critical: Complex useEffect Logic in LoadingScreen

**Location:** `components/loading-screen.tsx:66-185`

**Issue:**
Massive `useEffect` with multiple responsibilities:
- Progress animation
- Task sequencing
- API calls
- Navigation
- Cleanup

This violates the single responsibility principle and makes the code hard to test and debug.

**Recommendation:**
Split into custom hooks:

```tsx
// hooks/use-progress-animation.ts
export function useProgressAnimation(isActive: boolean) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 2, 100));
    }, 60);

    return () => clearInterval(interval);
  }, [isActive]);

  return progress;
}

// hooks/use-task-sequencer.ts
export function useTaskSequencer(tasks: readonly Task[], isActive: boolean) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const timeouts = tasks.map((_, index) =>
      setTimeout(() => setActiveIndex(index), (index + 1) * 750)
    );

    return () => timeouts.forEach(clearTimeout);
  }, [tasks, isActive]);

  return activeIndex;
}

// hooks/use-evaluation.ts
export function useEvaluation(input: EvaluationInput | null) {
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Simplified async logic

  return { result, error, isLoading, retry };
}
```

---

### 🟡 Medium: Unused State Variable

**Location:** `components/loading-screen.tsx:45`

**Issue:**
```tsx
const [_isLoading, setIsLoading] = useState(true);
```

The underscore prefix indicates intentionally unused, but `setIsLoading` is still called. This is confusing.

**Recommendation:**
Either use the variable or remove it:

```tsx
const [isLoading, setIsLoading] = useState(true);

// Then use it in conditional rendering
if (isLoading) {
  return <LoadingAnimation />;
}
```

---

### 🟡 Medium: Missing Error Boundaries

**Location:** Project-wide

**Issue:**
No error boundaries to catch and handle React component errors gracefully.

**Recommendation:**
Add error boundaries:

```tsx
// components/error-boundary.tsx
"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// app/layout.tsx
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <EvaluationProvider>{children}</EvaluationProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## 5. Code Quality & Maintainability

### 🔴 Critical: TODO Comments and Console.logs in Production

**Location:**
- `app/actions/evaluation.ts:200-203, 132-143`
- `components/evaluation-report-summary.tsx:70-71, 74`

**Issue:**
Production code contains TODO comments and console.log statements:

```tsx
// TODO: add to env
let model = "claude-sonnet-4-5-20250929";

console.log("prompt", prompt);
console.log("evaluation done"); // TODO: remove
console.log("result", result); // TODO: remove

// TODO: Instrumentation hook - log export event
// TODO: Show user-friendly error message
```

**Recommendation:**
1. Move model to environment variables:
```tsx
// lib/env.ts
export const env = {
  ANTHROPIC_API_KEY: envSchema.parse(process.env).ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929",
} as const;
```

2. Replace console.logs with proper logging:
```tsx
// lib/logger.ts
export const logger = {
  info: (message: string, data?: unknown) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] ${message}`, error);
    // Add error tracking service (Sentry, LogRocket, etc.)
  },
};
```

3. Implement instrumentation:
```tsx
// lib/analytics.ts
export const analytics = {
  track: (event: string, properties?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", event, properties);
    }
  },
};

// Then use it:
analytics.track("report_exported", { timestamp: new Date().toISOString() });
```

---

### 🟡 Medium: Magic Numbers and Hardcoded Values

**Location:** Throughout the codebase

**Issue:**
Magic numbers make code harder to understand and maintain:

```tsx
// idea-intake-form.tsx
const MIN_IDEA_LENGTH = 10;
const MAX_IDEA_LENGTH = 500;

// loading-screen.tsx
const MIN_LOAD_TIME_MS = 3000;

// questions-form.tsx
const MIN_ANSWER_LENGTH = 5;
```

**Recommendation:**
Consolidate into configuration:

```tsx
// config/validation.ts
export const VALIDATION_RULES = {
  idea: {
    minLength: 10,
    maxLength: 500,
  },
  answer: {
    minLength: 5,
    maxLength: 1000,
  },
  loading: {
    minDurationMs: 3000,
    taskDelayMs: 750,
    progressIntervalMs: 60,
  },
} as const;

// config/scoring.ts
export const SCORING_WEIGHTS = {
  feasibility: 0.35,
  marketPull: 0.35,
  speedToSignal: 0.2,
  novelty: 0.1,
} as const;

export const SCORE_THRESHOLDS = {
  strong: 8.0,
  moderate: 6.0,
} as const;
```

---

### 🟡 Medium: Inconsistent File Organization

**Location:** Project structure

**Issue:**
Some components are in root `/components`, others in subdirectories. No clear pattern.

**Recommendation:**
Organize by feature:

```
components/
├── ui/               # Shared UI primitives
│   ├── button/
│   │   ├── primary-button.tsx
│   │   ├── back-button.tsx
│   │   └── index.ts
│   ├── card/
│   │   ├── card.tsx
│   │   ├── card-header.tsx
│   │   └── index.ts
│   └── ...
├── features/         # Feature-specific components
│   ├── idea-intake/
│   │   ├── idea-intake-form.tsx
│   │   ├── use-idea-validation.ts
│   │   └── index.ts
│   ├── evaluation/
│   │   ├── evaluation-card.tsx
│   │   ├── evaluation-report-summary.tsx
│   │   ├── content/
│   │   │   ├── problem-persona-content.tsx
│   │   │   └── ...
│   │   └── index.ts
│   └── ...
└── shared/           # Shared components across features
    ├── loading-screen.tsx
    ├── ready-to-iterate.tsx
    └── index.ts
```

---

## 6. Testing

### 🔴 Critical: Zero Test Coverage

**Location:** Project-wide

**Issue:**
No tests exist for any component, hook, or utility function.

**Recommendation:**
Set up testing infrastructure:

```bash
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest @vitejs/plugin-react jsdom
```

**vitest.config.ts:**
```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

**Example test:**
```tsx
// components/ui/primary-button.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrimaryButton } from "./primary-button";

describe("PrimaryButton", () => {
  it("renders with text", () => {
    render(<PrimaryButton text="Click me" />);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<PrimaryButton text="Click me" onClick={onClick} />);

    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<PrimaryButton text="Click me" disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows loading text when isLoading is true", () => {
    render(<PrimaryButton text="Submit" isLoading />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
```

**Priority Test Coverage:**
1. UI Components (PrimaryButton, Card, QuestionField)
2. Form Components (IdeaIntakeForm, QuestionsForm)
3. Utilities (markdown-export, scoring calculations)
4. Context (EvaluationContext)
5. Server Actions (evaluation.ts - use MSW for API mocking)

---

## 7. Error Handling & User Experience

### 🟡 Medium: Generic Error Messages

**Location:** `components/loading-screen.tsx:155-159`

**Issue:**
```tsx
setError(
  err instanceof Error
    ? err.message
    : "Failed to generate evaluation. Please try again."
);
```

Generic error messages don't help users understand what went wrong.

**Recommendation:**
Provide contextual error messages:

```tsx
// lib/errors.ts
export function getErrorMessage(error: unknown): string {
  if (error instanceof ValidationError) {
    return "The AI response was invalid. We're trying again automatically.";
  }

  if (error instanceof Error && error.message.includes("rate limit")) {
    return "We're experiencing high demand. Please try again in a few moments.";
  }

  if (error instanceof Error && error.message.includes("network")) {
    return "Network connection lost. Please check your internet and try again.";
  }

  return "Something went wrong. Please try again or contact support if the issue persists.";
}
```

---

### 🟡 Medium: No Network Retry Logic

**Location:** `app/actions/evaluation.ts:196-318`

**Issue:**
Only retries on validation errors, not on network failures.

**Recommendation:**
Add exponential backoff for network errors:

```tsx
// lib/retry.ts
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: Error) => boolean;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = () => true,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxAttempts - 1 || !shouldRetry(lastError)) {
        throw lastError;
      }

      const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

// Usage in evaluation.ts
const response = await retryWithBackoff(
  () => anthropic.messages.create({ model, max_tokens: 4000, messages: [...] }),
  {
    maxAttempts: 3,
    shouldRetry: (error) => {
      // Retry on network errors, not on validation errors
      return !error.message.includes("validation");
    },
  }
);
```

---

### 🟢 Low: Missing Loading States in Buttons

**Location:** `components/evaluation-report-summary.tsx:169-195`

**Issue:**
Export button doesn't show loading state during file generation.

**Recommendation:**
Add loading state:

```tsx
const [isExporting, setIsExporting] = useState(false);

const handleExportMarkdown = async () => {
  setIsExporting(true);
  try {
    // ... export logic
  } catch (error) {
    console.error("Failed to export markdown:", error);
  } finally {
    setIsExporting(false);
  }
};

<button
  onClick={handleExportMarkdown}
  disabled={isExporting}
  className={cn(
    "bg-white border ...",
    isExporting && "opacity-50 cursor-not-allowed"
  )}
>
  {isExporting ? (
    <>
      <Loader2 className="size-4 animate-spin" />
      <span>Exporting...</span>
    </>
  ) : (
    <>
      <Download className="size-4" />
      <span>Export as Markdown</span>
    </>
  )}
</button>
```

---

## 8. Security & Data Validation

### 🟡 Medium: No Input Sanitization

**Location:** Form components

**Issue:**
User input is not sanitized before being sent to the API or displayed.

**Recommendation:**
Add input sanitization:

```tsx
// lib/sanitize.ts
import DOMPurify from "isomorphic-dompurify";

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  }).trim();
}

// Usage in forms
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const ideaInput: IdeaInput = {
    description: sanitizeInput(ideaText),
  };
  setIdea(ideaInput);
};
```

---

### 🟢 Low: Environment Variable Validation Could Be Stricter

**Location:** `lib/env.ts`

**Issue:**
Only validates presence, not format.

**Recommendation:**
Add format validation:

```tsx
const envSchema = z.object({
  ANTHROPIC_API_KEY: z
    .string()
    .min(1, "ANTHROPIC_API_KEY is required")
    .startsWith("sk-ant-", "Invalid Anthropic API key format"),
  ANTHROPIC_MODEL: z
    .string()
    .optional()
    .default("claude-sonnet-4-5-20250929"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});
```

---

## 9. Accessibility Improvements

### 🟢 Low: Missing Skip Link

**Location:** `app/layout.tsx`

**Issue:**
No skip link for keyboard users to bypass navigation.

**Recommendation:**
Add skip link:

```tsx
// components/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black"
    >
      Skip to main content
    </a>
  );
}

// app/layout.tsx
<body>
  <SkipLink />
  <main id="main-content">
    {children}
  </main>
</body>
```

---

### 🟢 Low: Improve Focus Management

**Location:** Navigation flows

**Issue:**
No focus management when navigating between pages.

**Recommendation:**
Add focus management:

```tsx
// hooks/use-focus-on-mount.ts
import { useEffect, useRef } from "react";

export function useFocusOnMount() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return ref;
}

// Usage in page components
export function QuestionsForm() {
  const headingRef = useFocusOnMount();

  return (
    <h1 ref={headingRef} tabIndex={-1}>
      A Few Quick Questions
    </h1>
  );
}
```

---

## 10. Best Practices & Recommendations

### 🟡 Medium: Add Request Deduplication

**Location:** `app/actions/evaluation.ts`

**Issue:**
Multiple rapid submissions could create duplicate API calls.

**Recommendation:**
Add request deduplication:

```tsx
// lib/dedup.ts
const pendingRequests = new Map<string, Promise<unknown>>();

export async function dedupRequest<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  const pending = pendingRequests.get(key);
  if (pending) {
    return pending as Promise<T>;
  }

  const promise = fn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}

// Usage
export async function generateEvaluation(input: EvaluationInput): Promise<EvaluationResult> {
  const key = JSON.stringify(input);
  return dedupRequest(key, () => generateEvaluationInternal(input));
}
```

---

### 🟡 Medium: Add Rate Limiting Feedback

**Location:** Server actions

**Issue:**
No feedback to users about rate limiting.

**Recommendation:**
Detect and communicate rate limits:

```tsx
import { RateLimitError } from "@anthropic-ai/sdk";

try {
  const response = await anthropic.messages.create({...});
} catch (error) {
  if (error instanceof RateLimitError) {
    throw new EvaluationError(
      "We're experiencing high demand. Please wait a moment and try again.",
      "RATE_LIMIT",
      true
    );
  }
  throw error;
}
```

---

### 🟢 Low: Add Performance Monitoring

**Location:** Project-wide

**Recommendation:**
Add Web Vitals monitoring:

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EvaluationProvider>{children}</EvaluationProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

### 🟢 Low: Consider Adding Optimistic Updates

**Location:** Form submissions

**Recommendation:**
Use optimistic updates for better UX:

```tsx
// Example for questions form
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Optimistically navigate
  router.push("/loading");

  try {
    // Update context
    setClarifiers(responses);
  } catch (error) {
    // On error, navigate back
    router.push("/questions");
  }
};
```

---

## Priority Implementation Roadmap

### Phase 1: Critical Fixes (Week 1)
1. ✅ Remove all console.logs and TODO comments
2. ✅ Extract duplicate NextStepCallout component
3. ✅ Fix type assertions in EvaluationCard
4. ✅ Set up basic test infrastructure
5. ✅ Add error boundaries

### Phase 2: Quality Improvements (Week 2)
1. ✅ Extract custom hooks from LoadingScreen
2. ✅ Remove unnecessary context updates in QuestionsForm
3. ✅ Add retry logic with exponential backoff
4. ✅ Consolidate magic numbers into config
5. ✅ Add input sanitization

### Phase 3: Testing & Documentation (Week 3)
1. ✅ Write tests for UI components
2. ✅ Write tests for utilities
3. ✅ Write tests for forms
4. ✅ Add component documentation
5. ✅ Create testing best practices guide

### Phase 4: Polish & Optimization (Week 4)
1. ✅ Add React.memo to pure components
2. ✅ Implement request deduplication
3. ✅ Add performance monitoring
4. ✅ Improve error messages
5. ✅ Add accessibility improvements

---

## Conclusion

The LeanEval codebase is **well-architected and follows modern React/Next.js best practices**. The main areas for improvement are:

1. **Eliminate code duplication** (especially NextStepCallout components)
2. **Add comprehensive testing** (currently 0% coverage)
3. **Improve type safety** (remove type assertions)
4. **Enhance error handling** (better messages, retry logic)
5. **Optimize performance** (reduce unnecessary re-renders)

**Estimated effort:** 4 weeks for one developer to implement all recommendations.

**Immediate wins:** Phases 1 and 2 can be completed in 2 weeks and will provide the most value.

---

**Questions or need clarification on any recommendation?** Feel free to reach out!
