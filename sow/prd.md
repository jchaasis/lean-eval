

## **1\. Product Overview**

### **Summary**

LeanEval is an AI-powered tool that helps founders and builders rapidly validate early-stage startup ideas. 

Users describe their concept in plain language, answer a few clarifying questions, and receive a structured, data-driven evaluation grounded in Lean Startup principles — including the problem statement, target persona, MVP scope, validation experiments, and risk analysis.

The tool’s goal: **help entrepreneurs move from “idea” to “validated next step” in under 5 minutes.**

---

## **2\. Problem Statement**

Early-stage builders waste weeks exploring ideas that haven’t been framed or validated.  
 Common issues:

* No clear articulation of the *problem* being solved.

* Unclear *target user* or *market need.*

* Over-engineered MVPs that don’t test core assumptions.

* No framework for *objective comparison* between multiple ideas.

**LeanEval** solves this by offering instant, structured feedback — enabling founders to iterate before investing time and capital.

---

## **3\. Product Goals**

| Goal | Success Metric | KPI Target (MVP) |
| ----- | ----- | ----- |
| Help users clarify and validate ideas quickly | Avg. time from input → evaluation | \< 2 minutes |
| Provide actionable next steps | % of users who report “useful” or “actionable” output | ≥ 80% satisfaction |
| Encourage idea iteration | % of users running ≥2 evaluations per session | ≥ 50% |
| Demonstrate consistent evaluation quality | Pass rate of JSON validation & score reproducibility | ≥ 95% |

---

## **4\. Key Use Cases**

1. **Solo Founder / Indie Hacker:**  
    Wants to sanity-check a new startup idea before writing code.

2. **Product Manager:**  
    Evaluates internal feature or product expansion ideas using Lean metrics.

3. **Accelerator Program:**  
    Uses tool to pre-screen applicant ideas for novelty, feasibility, and market validation potential.

4. **Investors / Advisors:**  
    Compare multiple startup ideas systematically.

---

## **5\. Core Features (MVP Scope)**

| Feature | Description | Priority |
| ----- | ----- | ----- |
| **Idea Intake Form** | Single input field for user to describe idea (1–3 sentences). | P0 |
| **Follow-Up Questions** | 2–3 dynamic or templated clarifiers (e.g., target user, pain point, pricing). | P0 |
| **AI Evaluation Engine** | LLM-powered backend that outputs structured Lean evaluation JSON (problem, persona, MVP, KPIs, experiments, risk, scores). | P0 |
| **Result Dashboard** | Clean UI showing each section in collapsible cards with composite score. | P0 |
| **Section Regeneration** | Allow per-section “Regenerate” for iterative refinement. | P1 |
| **Markdown Export** | Generate 1-page summary (problem, MVP, next steps) for sharing. | P1 |
| **Saved Evaluations** | Store user history for comparison and progress tracking. | P2 |
| **Batch Comparison Mode** | Evaluate multiple ideas side-by-side with ranking. | P2 |

---

## **6\. User Flow**

 **Step 1:** User enters an idea → clicks “Evaluate”  
 **Step 2:** System asks 2–3 short clarifying questions.  
 **Step 3:** User submits answers → AI runs evaluation → loading animation (“Evaluating your idea…”)  
 **Step 4:** Results page shows:

* Problem & Persona

* MVP Scope

* Experiments

* Risks & Mitigation

* KPIs

* Scoring breakdown (Feasibility, Market Pull, Novelty, Speed-to-Signal, Composite)

**Step 5:** User can regenerate sections or export report.

---

## **7\. Scoring Framework**

| Dimension | Definition | Weight |
| ----- | ----- | ----- |
| **Feasibility** | Can this realistically be built by a small team? | 35% |
| **Market Pull** | Is there clear user pain and willingness to pay? | 35% |
| **Speed to Signal** | How quickly can early validation occur? | 20% |
| **Novelty** | How differentiated is the idea? | 10% |

Composite Score \= Weighted average × 100  
 (Displayed visually as progress bar \+ “score explanation.”)

---

## **8\. Technical Overview**

| Layer | Tech Stack | Notes |
| ----- | ----- | ----- |
| **Frontend/Backend** | Next.js \+ Tailwind \+ shadcn/ui | SSR-ready for SEO and speed. |
| **AI Engine** | Anthropic Claude 3.5 | Structured JSON mode with retry/fallback. |
| **Validation** | Zod (TypeScript) | Schema enforcement for consistent outputs. |
| **Storage (Phase 2\)** | Supabase | Store evaluations, user sessions, feedback. |
| **Deployment** | Vercel (frontend) \+ Supabase function (API) | Scalable, cost-efficient MVP hosting. |

---

## **9\. Non-Goals (MVP)**

* No authentication or persistent user accounts (Phase 2).

* No live data scraping or competitive research.

* No pricing or monetization mechanics (Phase 3).

* No adaptive fine-tuning or self-learning model at MVP.

---

## **10\. UX / Design Principles**

* **Conversational, not chatty** — questions feel guided and purposeful.

* **Visual clarity** — treat output like a concise investor memo.

* **Encourage iteration** — emphasize “refine” and “regenerate” rather than one-and-done.

* **Actionability first** — every section ends with a tangible next step.

---

## **11\. Risks & Mitigations**

| Risk | Likelihood | Mitigation |
| ----- | ----- | ----- |
| Inconsistent AI output / schema breaks | Medium | Strict JSON schema validation \+ retry once. |
| Overly generic results reduce trust | High | Require clarifying Q\&A to increase context signal. |
| High token cost from large prompts | Medium | Compact prompt templates; use low temperature. |
| Users treat tool as entertainment, not utility | Medium | Lean, professional UI emphasizing actionability over novelty. |

---

## **12\. Future Enhancements (Post-MVP)**

* Dynamic LLM-generated follow-up questions based on missing context.

* Multi-idea batch evaluation with scoring matrix.

* Team collaboration (share & comment).

* Integration with Notion / Slack for exporting evaluations.

* AI-generated “build roadmap” based on MVP plan.

* Human feedback loop to fine-tune scoring model.

