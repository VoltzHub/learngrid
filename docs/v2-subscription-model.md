# LearnGrid v2 — Subscription Monetisation Model (Draft)

> **Status:** Draft for review. Not committed scope. Captured from Evalsam's voice-note feedback on 2026-05-15. Owner: P. James. Decision owner: Evalsam.
>
> **Purpose:** Document the proposal so it isn't lost, surface the unresolved questions, and lay out the cost of pivoting now vs. validating the per-class model first.

---

## 1. The proposal (as voiced by Evalsam)

> Teachers shouldn't set their own price — they'll get greedy. Instead:
> - **Students** subscribe daily / weekly / monthly for a fixed amount (e.g. ₦15,000/month).
> - **Teachers** earn per class based on duration × number of students attending (e.g. ₦200–₦500 per head per class).
> - The student's subscription "expires" after the period. Analogy: an MTN data plan.

Two phrasings appear in the same note, which describe **two different models**:

| Model | Description |
|---|---|
| **A. Flat-rate access** | Pay ₦X/month → join *unlimited* classes for that period. Same as Netflix. |
| **B. Prepaid credit** | Pay ₦X/month → that amount is *credit* that's consumed as you join classes. "He has to look for classes to join to make up for that amount of money." Same as airtime/data. |

These have different economics, different student behaviour, and different teacher-payout rules. **We need to pick one before designing.**

## 2. Why it's a real concern

Evalsam's underlying worry is correct: a marketplace where teachers freely set prices race-to-the-top on greedy classes and race-to-the-bottom on volume. He wants LearnGrid to control the unit economics, not the teacher.

**However:** the current build *already* solves the "teacher names their own price" problem. Teachers pick from 4 fixed LearnGrid-set tiers in [`src/lib/pricing.ts`](../src/lib/pricing.ts) — ₦500 / ₦1,500 / ₦3,000 / ₦5,000. They cannot type any amount. Evalsam either tested an older build or missed the dropdown. This needs verification with a screenshot before we treat the per-class model as "broken."

## 3. Open questions before this can be designed

### Pricing & plans
- **Plan tiers** — daily / weekly / monthly amounts? (₦15k/month was an example, not a decision.)
- **Flat vs credit** — Model A or Model B above?
- **Family plans** — one sub per child? Per parent account with multiple children?
- **Cold-start price floor** — what's the cheapest entry plan for low-income families?

### Teacher payout
- **Rate per head per class** — flat across all classes, or vary by class type / teacher seniority / class duration?
- **Minimum attendance** — does a class with 1 student still earn? With 0?
- **Quality multiplier** — does a 4.5★ teacher earn more per head than a 3.0★?
- **No-show students** — paid for, not paid for?

### Marketplace mechanics
- **Discovery incentive** — what stops every student from only joining the same 3 popular teachers, leaving everyone else with empty classes?
- **Class supply guarantee** — what does LearnGrid owe a student who paid ₦15k but couldn't find a class to join in their subject that month?
- **Refunds** — what if a student doesn't use their subscription at all?
- **Sharing / fraud** — what stops two families splitting one sub?

### Platform economics
- **Margin** — given Paystack fees (~1.5–2% on subs), recurring payment failures, and the per-head teacher payouts, what's left for LearnGrid?
- **Cashflow risk** — we'd be paying teachers in arrears off student subs collected upfront. If churn spikes, we'd be paying out money we no longer have.

## 4. Cost of pivoting now (vs after MVP)

If we pivot now, the following currently-built work gets discarded or rewritten:

| Area | Current MVP build | Subscription rebuild |
|---|---|---|
| Pricing | Fixed 4-tier dropdown ([`src/lib/pricing.ts`](../src/lib/pricing.ts)) | Delete tier model; build plan-tier system instead |
| Schema | `Class.priceNgn`, `Payment.classId`, `Earning` per class | New `Subscription` + `Plan` tables; `Payment` decoupled from `Class`; `Earning` recalculated per attendance |
| Payments | Paystack one-shot charge → enrolment | Paystack Plans + Subscriptions API; recurring webhook handling; failed-renewal flows |
| Earnings | % of class price → teacher | Per-head × duration ledger, recalculated nightly |
| Rules R-PY / R-EP / R-CR | Drafted in PRD | Rewritten end-to-end |
| AD-005 (platform fee %) | 15% placeholder | Concept no longer applies — replaced with margin-per-sub |
| Screens | Built around "pay per class" CTA | Redesign of student dashboard, class detail, signup flow |

**Estimated rework:** 4–6 weeks added to MVP timeline. Effectively a restart of Slices 3, 4, and 6 from the original plan.

## 5. Recommended decision path

**Option 1 — Ship MVP per-class, design v2 in parallel (recommended)**
- Keep the current per-class model in fixed tiers — Evalsam's "no teacher-set price" requirement is already met.
- Run the beta. Get real signal: do students refuse to pay per-class? Do teachers fill seats? What's the average per-student monthly spend? Those numbers tell us whether a sub model would actually work *and* what to price it at.
- Use this document as the v2 starting point; pick Model A or B with team input.
- Pros: ships in plan. v2 designed with evidence.
- Cons: feedback Evalsam gave doesn't land immediately in the product.

**Option 2 — Pause MVP, pivot now**
- Halt current build. Run a design sprint with Evalsam, Ezekiel (data/payments), and P. James to nail down all the open questions in §3.
- Then rebuild Slices 3, 4, 6.
- Pros: Evalsam's vision goes straight to market.
- Cons: 4–6 weeks slip, guessing at plan prices with no student-behaviour data, risk of building the wrong sub model and pivoting again.

**Option 3 — Hybrid (riskier)**
- Ship MVP as-is but soft-launch one student cohort on a flat-rate sub plan in parallel. Compare conversion and engagement.
- Pros: A/B evidence.
- Cons: 2x the build, harder to read the signal at small sample sizes.

## 6. Next steps if we go with Option 1

- Pastor confirms with Evalsam that he saw the price-tier dropdown (screenshot from his test session).
- Park this doc; revisit after beta launches.
- Schedule a v2 design session for week 4 of beta (when we'll have student behaviour data).

## 7. Next steps if we go with Option 2

1. Evalsam picks: flat-rate (Model A) or prepaid credit (Model B).
2. Evalsam + Ezekiel resolve §3 questions (1-page decision doc per question).
3. P. James writes new R-PY, R-EP, R-CR rules.
4. P. James + Ezekiel design new schema (Subscription, Plan, attendance-based Earning).
5. New 4-week plan. AD-005 retired; AD-006 reworked.
