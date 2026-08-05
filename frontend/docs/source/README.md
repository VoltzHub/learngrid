# LearnGrid — Original Source Documents

> **If this folder only contains this README, that's expected.** The actual spec files are **not committed to git** — they're distributed via the team Slack channel as a zip. Ask Evalsam, Alali, or whoever's onboarding you for the latest `docs-source.zip`, unzip it into this folder, and the file list below will make sense.

These are the original product/spec artefacts. They are the **source of truth** for the product. The build, the rules, the AD-### decisions, and the handover doc all derive from these.

## Why these are gitignored

The files may contain team contacts, fee strategy, investor pitch refs, and other business-sensitive info. See `.gitignore` — `/docs/source/*` is ignored, with this README explicitly tracked as a beacon so newcomers know what should be here.

## How to read them once you have them

Open the `.html` files in any browser. Open the `.docx` files in Word, Google Docs, or LibreOffice.

## What's here

### Primary references (read in this order)

1. **`learngrid_workspace.html`** — Most authoritative single document. Contains:
   - Functional PRD v1
   - The 7-step MVP loop
   - All rules: R-UR (user roles), R-TV (teacher verification), R-CS (class states), R-PY (payments), R-EP (earnings/payout), R-CR (cancellation/refund), R-RT (ratings), R-NT (notifications)
   - The 30-screen UI inventory (SC-001 to SC-030)
   - Stack table and security requirements
   - The 9-table data model
   - Initial decision log seed (AD-001…)

2. **`learngrid_team.html`** — Plain-English version of `workspace.html` with one page per role (CEO, PM, Data Lead, etc.) and a glossary. Use this when explaining LearnGrid to a non-technical stakeholder.

3. **`LearnGrid_Team_Kickoff_Brief.docx`** — Vision, scope summary, founding context. The "why" behind the product.

4. **`LearnGrid_Sprint_0_and_30_Day_Action_Plan.docx`** — The 4-week phased build plan that the current code structure is based on. Slices 1–7 map roughly to weeks here.

### Supporting / role-specific

5. **`LearnGrid_Role_Clarity_and_Ownership_Guide.docx`** — Who owns what across the 8-person team. Use this to figure out who to chase for an approval or decision.

6. **`learngrid_week1.html`** — Snapshot of Week 1 deliverables (mostly historical now).

7. **`learngrid_pjames_checklist.html`** — P. James's personal build checklist from the early sprint. May contain notes useful to the next dev.

### Design handoffs

8. **`learngrid_onboarding_flow_design_handoff.html`** — Divine's onboarding flow handoff (May 2026).

9. **`learngrid_teacher_dashboard_design_handoff.html`** — Divine's teacher dashboard handoff (May 2026). The 15% platform fee shown here was a design assumption, not a confirmed AD-005 decision.

10. **`LEARNGRID SCREENS.docx`** — Tabular version of the 30-screen inventory. Cross-check against `workspace.html` if numbers don't match — `workspace.html` wins.

## How these stay current

These are **point-in-time snapshots**. The team shares updated versions over Slack. When a newer zip arrives, replace the files locally and bump the date below.

**Last refreshed:** 2026-05-15 by P. James (sourced from `~/Downloads`).
