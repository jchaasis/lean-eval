# LeanEval Implementation Plan

## 1. Foundations & Infrastructure
- [x] Bootstrap Next.js 16 App Router project with TypeScript strict mode, Tailwind, shadcn/ui, and shared layout shell matching Figma base styles.
- [x] Configure project-level linting (ESLint, Prettier) and commit hooks to enforce TypeScript standards and accessibility rules.
- [x] Set up environment management for Anthropic API keys and shared config (`env.mjs`, `process.env` validation via `zod`).
- [x] Define global types in `types/` (idea payload, clarifier responses, evaluation schema, scoring).

## 2. Core User Flow (Per Figma Screens)
### Idea Intake / Landing
#### Layout & Structure
- [x] Create server component `app/page.tsx` with full-height gradient background (148.031deg gradient from #F8FAFC to #F1F5F9).
- [x] Implement centered container with max-width constraints matching Figma (px-[327.5px] equivalent, responsive).
- [x] Build header section with centered "LeanEval" title (16px, #0F172B, Inter Regular) and subtitle below.
- [x] Add refresh/reload icon button in top-right corner (36x36px, rounded-full) with proper accessibility labels.

#### Main Form Card
- [x] Create white card container with border (border-slate-200), rounded-[10px], proper padding (pt-[33px] px-[33px]). This should be a reusable component that other pages can consume.
- [x] Build icon + heading section: lightbulb icon in green circular background (#d0fae5, 48x48px), "Describe Your Idea" heading, and subtitle text.
- [x] Implement large textarea (160px height) with:
  - Placeholder text: "Example: A mobile app that helps busy parents plan weekly meals based on their family's dietary preferences, reducing food waste and saving time on grocery shopping..."
  - Background color #f3f3f5, border transparent, rounded-[8px]
  - Padding px-[12px] py-[8px]
  - Character limit: 500 characters
- [x] Add character counter below textarea (0/500 characters, #62748e, 14px) that updates in real-time.
- [x] Create inspiration section with:
  - Light grey background (bg-slate-50), border, rounded-[10px]
  - Heading: "Need inspiration? Try these examples:" (#45556c, 14px)
  - Three clickable example ideas in green (#009966, 14px):
    1. "A Chrome extension that summarizes meeting notes using AI"
    2. "A marketplace connecting local farmers directly with restaurants"
    3. "An app that gamifies learning to code for kids"
- [x] Implement "Continue to Questions →" button:
  - Dark background (#030213), white text, rounded-[8px], 40px height
  - Disabled state: opacity-50 (when textarea is empty or < minimum length)
  - Enabled state: full opacity, hover effects

#### Client Component & Validation
- [x] Create client component `components/idea-intake-form.tsx` with "use client" directive.
- [x] Implement controlled textarea with React state management.
- [x] Add validation logic:
  - Minimum length: 10 characters (or reasonable threshold)
  - Maximum length: 500 characters (enforced)
  - Real-time character count updates
- [x] Handle example idea clicks: populate textarea with selected example text.
- [x] Implement button state management (disabled when invalid, enabled when valid).
- [x] Add form submission handler that stores idea in client state (React Context or Zustand) and navigates to questions page.

#### State Management & Navigation
- [x] Set up client-side state store (React Context or Zustand) for idea + clarifier responses.
- [x] Wire "Continue" button to transition to `/questions` route (client-side navigation).
- [x] Ensure idea text persists when navigating between steps (in-memory only for MVP).

### Follow-Up Questions
#### Layout & Structure
- [x] Create server component `app/questions/page.tsx` with same gradient background as landing page.
- [x] Implement header section matching landing page (title, subtitle, refresh button).
- [x] Add "← Back to idea" navigation link above main card (left-aligned, navigates to `/`).

#### Main Questions Card
- [x] Create white card container using reusable `Card` component.
- [x] Build `CardHeader` with question/chat icon, "A Few Quick Questions" title, and "Help us understand your idea better" subtitle.
- [x] Implement "Your idea:" section:
  - Label text "Your idea:" in dark gray
  - Display previously entered idea text (read-only, from context state)
  - Style as non-editable text in lighter gray

#### Question Components
- [x] Create reusable `QuestionField` component that accepts:
  - `questionNumber`: number (1, 2, 3)
  - `questionText`: string
  - `isRequired`: boolean (shows red asterisk if true)
  - `placeholder`: string
  - `guidanceText`: string
  - `value`: string (controlled input)
  - `onChange`: handler function
- [x] Implement Question 1: "Who is your target user or customer?"
  - Required field (red asterisk)
  - Placeholder: "e.g., Busy working parents with kids under 10"
  - Guidance: "Be specific: demographics, behaviors, or shared characteristics"
- [x] Implement Question 2: "What specific pain point or frustration does this solve?"
  - Required field (red asterisk)
  - Placeholder: "e.g., Spending 2+ hours weekly on meal planning and grocery lists"
  - Guidance: "What problem keeps them up at night?"
- [x] Implement Question 3: "How might you charge for this? (Optional)"
  - Optional field (no asterisk, marked as "(Optional)")
  - Placeholder: "e.g., $10/month subscription or free with premium tier"
  - Guidance: "Just a rough idea — we'll help you test it"

#### Form Validation & State
- [x] Create client component `components/questions-form.tsx` with "use client" directive.
- [x] Implement controlled inputs for all three questions using React state.
- [x] Add validation logic:
  - Questions 1 and 2: Required (minimum 5 characters)
  - Question 3: Optional (no validation)
  - Real-time validation feedback
- [x] Retrieve idea from evaluation context and display in "Your idea:" section.
- [x] Store clarifier responses in evaluation context as user types.

#### Action Buttons
- [x] Implement "Back" button:
  - White background, light gray border, dark gray text
  - Navigates to `/` (landing page)
  - Preserves current form state in context
- [x] Implement "Generate Evaluation →" button:
  - Dark background (#030213), white text, right arrow icon
  - Disabled state: opacity-50 when required questions are incomplete
  - Enabled state: full opacity, hover effects
  - On click: validate all required fields, store responses in context, navigate to `/loading`

#### Navigation & State Persistence
- [x] Ensure idea text from landing page persists and displays correctly.
- [x] Wire "Back" button to navigate to landing page while preserving form state.
- [x] Wire "Generate Evaluation →" to validate, store clarifier responses, and navigate to loading screen.
- [x] Update evaluation context to store clarifier responses as array of `ClarifierResponse` objects.

### Loading Screen
#### Layout & Structure
- [x] Create server component `app/loading/page.tsx` with same gradient background as landing page (148.031deg gradient from #F8FAFC to #F1F5F9).
- [x] Implement header section matching landing page (title "LeanEval", subtitle, refresh button in top-right).
- [x] Create white card container using reusable `Card` component with border (border-slate-200), rounded-[10px], proper padding (pt-[49px] px-[208px]).

#### Loading Animation & Visual Elements
- [x] Build large circular loading icon (96px):
  - Green border (4px, #a4f4cf) with rounded-full
  - Inner circle (72px) with green background (#d0fae5 or similar) and opacity-92.4
  - Centered star/sparkle icon (32px) in white
  - Positioned at top center of card
- [x] Implement main status text:
  - Heading: "Evaluating your idea..." (#0f172b, 16px, Inter Regular, centered)
  - Subheading: "This will take just a moment" (#45556c, 16px, Inter Regular, centered)
  - Positioned below loading icon with proper spacing

#### Progress Tasks List
- [x] Create reusable `LoadingTask` component that accepts:
  - `icon`: React component or icon name
  - `text`: string (task description)
  - `isActive`: boolean (for animation state)
  - `isCompleted`: boolean (for visual state)
- [x] Implement four progress task items with icons and text:
  1. "Analyzing problem-market fit..." (target/bullseye icon)
  2. "Defining MVP scope..." (lightbulb icon)
  3. "Calculating validation metrics..." (graph/trending icon)
  4. "Generating insights..." (star/sparkle icon)
- [x] Style task items:
  - Icon container: bg-slate-100, rounded-full, 32px size
  - Icon: 16px size, centered
  - Text: #314158, 14px, Inter Regular, leading-[20px]
  - Gap between icon and text: 12px
  - Vertical gap between tasks: 12px

#### Progress Bar
- [x] Implement horizontal progress bar at bottom of card:
  - Background: bg-slate-100, rounded-full, 8px height
  - Progress fill: gradient from #00bc7d to #009966, rounded-full
  - Full width (448px) with proper padding
  - Animate progress from 0% to 100% over minimum 3 seconds

#### Client Component & Animation Logic
- [x] Create client component `components/loading-screen.tsx` with "use client" directive.
- [x] Implement animation sequence:
  - Progress bar animates from 0% to 100% over minimum 3 seconds
  - Task items activate sequentially (one at a time or with staggered timing)
  - Each task shows active state (icon change or visual indicator) as it "completes"
- [x] Add smooth transitions for task state changes (opacity, icon updates).

#### Server Action & Data Fetching
- [x] Trigger server action on component mount to call AI evaluation:
  - Retrieve idea and clarifier responses from evaluation context
  - Call Anthropic API with evaluation prompt
  - Stream or await full response
- [x] Ensure minimum load time of 3 seconds (delay navigation if evaluation completes faster).
- [x] Navigate to `/dashboard` route once evaluation data resolves and minimum time has elapsed.
- [x] Store evaluation results in evaluation context for dashboard consumption.

#### State Management & Error Handling
- [x] Handle loading states (initial, in-progress, completed, error).
- [x] Add error state UI if evaluation fails (retry button, error message).
- [x] Ensure smooth transition to dashboard with evaluation data pre-loaded.

### Evaluation Dashboard
#### Layout & Structure
- [x] Create server component `app/dashboard/page.tsx` with same gradient background as landing page (148.031deg gradient from #F8FAFC to #F1F5F9).
- [ ] Implement header section matching landing page (title "LeanEval", subtitle, refresh button in top-right).
- [x] Create main container with proper spacing (gap-[48px] between sections, px-[320px] for desktop).

#### Evaluation Report Summary Card
- [x] Build summary card container (white background, border-slate-200, rounded-[10px], padding pt-[33px] px-[33px]).
- [x] Implement card header with:
  - Green circular icon background (#d0fae5, 48x48px) with lightbulb icon
  - "Lean Evaluation Report" heading (16px, #0f172b)
  - Idea description subtitle (14px, #45556c)
- [x] Create composite score section:
  - Circular score badge (80x80px, white background, shadow) displaying score (e.g., "7.8") and "/ 10" below
  - Score label with icon: "Composite Score" (16px, #0f172b) and "Overall viability based on all factors" subtitle (14px, #45556c)
  - Status badge (e.g., "Strong" in green-100 background, #008236 text, 28px height)
- [x] Build dimension score cards grid (2x2 layout):
  - Four cards: Feasibility, Market Pull, Novelty, Speed-to-Signal
  - Create reusable ScoreCard component
  - Each card contains:
    - Icon in colored circular background (32x32px): emerald-50, teal-50, cyan-50, green-50
    - Dimension name (14px, #0f172b) and description (12px, #62748e)
    - Score number (16px, #0f172b) aligned right
    - Progress bar (8px height, slate-100 background) with colored fill matching dimension theme
- [x] Add action buttons section:
  - "Export as Markdown" button (white background, border, 36px height) with download icon
  - "New Evaluation" button (white background, border, 36px height) with plus icon

#### Collapsible Evaluation Cards
- [x] Create reusable `EvaluationCard` component with:
  - Header section (75px height) with title (18px, Inter Medium, #0f172b) and expand/collapse icon (20x20px)
  - Collapsible content area with smooth animation
  - Default state: expanded for all cards
- [x] Implement Problem & Persona card:
  - Structured content sections: Core Problem, Market Context, Target Persona, Current Behaviors, Why Now
  - Each section with bold label and regular text (16px, #0f172b for labels, #314158 for text)
  - "Next Step" callout box (blue-50 background, #bedbff border, rounded-[10px]) with icon and actionable text
- [x] Implement MVP Scope card:
  - "Core Features (In Scope)" section with bullet list (16px, #314158)
  - "Explicitly Out of Scope (V1)" section with bullet list
  - "Build Timeline" and "Success Criteria" sections with bold labels
  - "Next Step" callout box (green-50 background, #b9f8cf border) with icon
- [x] Implement Validation Experiments card:
  - Multiple experiment sections, each with:
    - Experiment title (bold, 16px)
    - Hypothesis, Method, Success Metric, Cost fields (16px, #314158)
  - "Next Step" callout box (pink-50 background, #fccee8 border) with icon
- [x] Implement Risks & Mitigation card:
  - Risk categories: High Risk, Medium Risk, Low Risk (bold labels, 16px)
  - Each risk item with bold risk text and italicized mitigation text (16px, #314158)
  - "Next Step" callout box (red-50 background, #ffc9c9 border) with icon
- [x] Implement Key Performance Indicators card:
  - "North Star Metric" section with bold label and value
  - "Primary Metrics (Track from Day 1)" section with bullet list and targets
  - "Secondary Metrics (Track from Week 2)" section with bullet list and targets
  - "Leading Indicators" section with bullet list
  - "Next Step" callout box (orange-50 background, #ffd6a7 border) with icon


#### Markdown Export
- [x] Implement "Export as Markdown" button functionality:
  - Generate styled `.md` content with all evaluation sections
  - Format as "concise investor memo" with fenced sections and callouts
  - Include problem, MVP, KPIs, experiments, risks, and scoring explanation
  - Trigger file download using Blob + anchor element
  - Verify accessibility (keyboard navigation, screen reader labels)
  - Log instrumentation hook (e.g., `report_exported` event)

#### Additional Actions
- [x] Implement "New Evaluation" button that:
  - Clears evaluation context
  - Navigates back to landing page (`/`)
  - Preserves no state between evaluations
- [x] Add "Ready to Iterate?" bottom section:
  - Gradient background (from #ecfdf5 to #f0fdfa, #a4f4cf border)
  - Title "Ready to Iterate?" (16px, #0f172b)
  - "Evaluate Another Idea" button (white background, border, 36px height)

#### State Management & Data Flow
- [x] Retrieve evaluation data from evaluation context on page load.
- [x] Handle missing evaluation data gracefully (redirect to `/` if no data available).

## 3. AI Evaluation Engine
- [x] Author prompt templates incorporating idea description + clarifier answers + scoring rubric.
- [x] Implement server action that calls Anthropic Claude 3.5 with validation-focused parameters and deterministic temperature.
- [x] Validate response against strict Zod schema (matching PRD structure) and normalize weighted scores.
- [x] Retry once on schema failure; scaffold hook for future second retry/fallback model with feature flag.
- [x] Map validated data into domain types and cache per session (in-memory) for duration of user flow.

## 5. Markdown Export
- [x] Compose markdown template summarizing problem, MVP, KPIs, experiments, risks, and scoring explanation.
- [x] Style export using fenced sections and callouts to match "concise investor memo" tone.
- [x] Implement download mechanism (Blob + anchor) and verify accessibility (keyboard, screen reader labels).

## 6. Quality, Accessibility & Testing
- [x] Add unit tests for schema validation, scoring math, and prompt serialization.
- [x] Write component tests for form validation and follow-up flow
- [x] Run accessibility audit (aria labels, focus order, contrast per Tailwind tokens).
- [x] Verify performance budgets: avoid unnecessary client bundles, ensure server components handle data fetching.

## 7. Deployment & Future Hooks
- [ ] Configure Vercel project, environment variables, and preview deployments.
- [ ] Document manual QA script (idea submission → dashboard → export).
- [ ] Stub interfaces for future Supabase persistence and analytics events (time-to-evaluation, evaluations per session) without enabling them yet.

## 8. Analytics
- [ ] Enable Vercel analytics

