# LeanEval Implementation Plan

## 1. Foundations & Infrastructure
- [ ] Bootstrap Next.js 16 App Router project with TypeScript strict mode, Tailwind, shadcn/ui, and shared layout shell matching Figma base styles.
- [ ] Configure project-level linting (ESLint, Prettier) and commit hooks to enforce TypeScript standards and accessibility rules.
- [ ] Set up environment management for Anthropic API keys and shared config (`env.mjs`, `process.env` validation via `zod`).
- [ ] Define global types in `types/` (idea payload, clarifier responses, evaluation schema, scoring).

## 2. Core User Flow (Per Figma Screens)
### Idea Intake / Landing
- [ ] Build server component `app/page.tsx` that renders hero copy, single idea textarea, and CTA button aligned to Figma design.
- [ ] Implement client form component with validation (min/max length, guidance text) and optimistic button states.
- [ ] Wire CTA to transition into follow-up questions view (client state only for MVP).

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

