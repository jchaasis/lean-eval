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
- [ ] Render static set of 2–3 templated clarifiers (problem, target user, pricing) per requirements.
- [ ] Support per-question validation + progressive disclosure (disable Continue until all answered).
- [ ] Persist idea + clarifier responses in a shared client store (e.g., Zustand/React context) for later steps.

### Loading Screen
- [ ] Create loading route/segment that streams status text (“Evaluating your idea…”) and animates progress per Figma.
- [ ] Trigger server action to call AI evaluation on submit and navigate to dashboard once data resolves.
- [ ] Ensure a mimimum load time of 3 seconds

### Evaluation Dashboard
- [ ] Implement server component that receives evaluation payload and renders collapsible cards: Problem & Persona, MVP Scope, Experiments, Risks, KPIs, Scoring.
- [ ] Build scoring visualization: composite progress bar + individual dimension badges with weights.
- [ ] Add per-section “Regenerate” buttons (client components) that open tweak modal, send server action, and replace only that section’s data.
- [ ] Provide Markdown export CTA that generates styled `.md` content, triggers file download, and logs instrumentation hook.

## 3. AI Evaluation Engine
- [ ] Author prompt templates incorporating idea description + clarifier answers + scoring rubric.
- [ ] Implement server action that calls Anthropic Claude 3.5 with validation-focused parameters and deterministic temperature.
- [ ] Validate response against strict Zod schema (matching PRD structure) and normalize weighted scores.
- [ ] Retry once on schema failure; scaffold hook for future second retry/fallback model with feature flag.
- [ ] Map validated data into domain types and cache per session (in-memory) for duration of user flow.

## 4. Regeneration & Context Tweaks
- [ ] Design modal/sheet allowing users to edit section-specific context before regenerating.
- [ ] Reuse shared server action with `sectionOverride` payload to target only the requested block.
- [ ] Merge regenerated section back into existing evaluation state while keeping timestamps for UX copy.

## 5. Markdown Export
- [ ] Compose markdown template summarizing problem, MVP, KPIs, experiments, risks, and scoring explanation.
- [ ] Style export using fenced sections and callouts to match “concise investor memo” tone.
- [ ] Implement download mechanism (Blob + anchor) and verify accessibility (keyboard, screen reader labels).

## 6. Quality, Accessibility & Testing
- [ ] Add unit tests for schema validation, scoring math, and prompt serialization.
- [ ] Write component tests for form validation, follow-up flow, and section regeneration.
- [ ] Run accessibility audit (aria labels, focus order, contrast per Tailwind tokens).
- [ ] Verify performance budgets: avoid unnecessary client bundles, ensure server components handle data fetching.

## 7. Deployment & Future Hooks
- [ ] Configure Vercel project, environment variables, and preview deployments.
- [ ] Document manual QA script (idea submission → dashboard → regen → export).
- [ ] Stub interfaces for future Supabase persistence and analytics events (time-to-evaluation, evaluations per session) without enabling them yet.

