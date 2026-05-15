# LearnGrid — Build Handover & Continuation Guide

> **Audience:** The developer continuing this build (whether that's a returning team member, a new hire, or a contractor). Assumes solid Next.js/React/TypeScript but zero prior LearnGrid context.
>
> **Last updated:** 2026-05-15 by P. James.
>
> **One-line status:** The MVP 7-step loop is wired end-to-end on a Next.js 15 + Supabase + Paystack stack, running in test/dev mode. Remaining work is hardening, production switchover, and the post-MVP roadmap (subscription model, embedded video, recording/transcription).

---

## 0. How to read this document

There's a lot here. Read it in this order:

1. **§1–§3** — understand the product and the stack (15 min).
2. **§4** — get it running locally (30 min).
3. **§5** — walk the 7-step loop yourself as a student + teacher + admin (45 min). Don't read more until you've done this.
4. **§6** — then read what's built, what's left, and what's blocked.
5. **§7–§9** — the roadmap (v1.x hardening, v2 subscriptions, v3+ video/AI).
6. **§10** — gotchas you'll definitely hit.

If you only have 1 hour: do §4 (run it) and §5 (walk the loop). Everything else is reference.

---

## 1. The product in plain English

LearnGrid is a **Nigerian-first live learning marketplace**. Verified teachers list live classes (think WAEC Maths, JAMB Physics, Literature). Students pay per class in Naira via Paystack. Teachers get paid after the class is completed (currently same-day; intended to be after a 24-hour rating window). Classes happen on third-party video (Zoom/Google Meet — pasted as a link).

**Target users:**
- **Students:** secondary-school age (mostly 13–18), or their parents who pay.
- **Teachers:** Nigerian educators, verified via document upload (NYSC card / teacher's license / degree certificate).
- **Admins:** LearnGrid staff who approve teacher applications, monitor classes, and process payouts.

**The 7-step loop (the entire MVP scope):**
1. User signs up (student or teacher).
2. If teacher: admin verifies their docs.
3. Verified teacher lists a class (price/seats/schedule).
4. Student finds the class and pays.
5. Teacher pastes a meeting link; student joins at class time.
6. Teacher marks the class completed.
7. Student rates the class; teacher's earnings are released; teacher withdraws to bank.

Anything outside this loop is **not MVP**. That includes: in-app video, recording, transcription, AI summaries, messaging, social features, mobile app, multi-currency, subscriptions.

## 2. Who's who (people you might need to reach)

| Person | Role | What they own |
|---|---|---|
| Evalsam | CEO / idea guy | Scope approvals, platform fee % (AD-005), payout cadence (AD-006). Tests builds himself and gives screen-level feedback. |
| P. James | PM + Software Architect (outgoing) | Day-to-day product and tech decisions. **The author of this doc.** Has been the sole working dev. |
| Divine | Lead UI/UX | Owns the 30-screen design inventory (SC-001 to SC-030). |
| Ezekiel | Systems Architect / Data Lead | Backend, data model, payment logic, security. Also owns AD-004 (Supabase Storage vs Cloudinary). |
| Chidera | Head of Operations | Teacher verification process / teacher pipeline. |
| Cynthia | HR Director | Meeting cadence, blocker escalation. |
| Alali | Executive Assistant | Decision log, meeting notes. |
| James (UI/UX) | Design support to Divine | — |

**Approval chain:** scope/business → Evalsam. Product/tech delivery → P. James (currently). Once P. James leaves, that authority needs to transfer to someone.

## 3. Stack & where things live

```
c:/Users/paste/Documents/Coding/learngrid/        <-- the project (this repo)
c:/Users/paste/Documents/Coding/learngrid_landing_page/  <-- DO NOT TOUCH. Original static landing page. Read-only source for markup/styles/assets that were ported into this project.
```

| Layer | Tech | Why |
|---|---|---|
| Framework | Next.js 15 App Router + React 19 + TypeScript | Server components + server actions = less API plumbing |
| Styling | Tailwind 3 + a big custom `globals.css` | Most styling lives in `globals.css` (BEM-ish class names). Inline styles used liberally for one-offs. |
| DB | Supabase Postgres | Hosted, comes with Auth and Storage |
| ORM | Prisma 6 | Schema in `prisma/schema.prisma`, migrations applied to Supabase |
| Auth | Supabase Auth via `@supabase/ssr` | NOT `auth-helpers-nextjs` (deprecated). Sessions in cookies. |
| Payments | Paystack | NGN-only. Currently test keys. |
| Email | Resend | For verification + transactional. Currently placeholder key. |
| Icons | lucide-react | Wrapped via `src/components/Icons.tsx` — use `<Icon name="..." />` not raw imports. |

**Folder map:**

```
prisma/
  schema.prisma          # All 9 tables (Profile, TeacherProfile, Class, Enrolment, Payment, Earning, Payout, Rating, Notification)
  seed.ts                # Dev data — seeds teachers, classes, students
src/
  app/
    (marketing)/         # Public site: home, classes browse, class detail, legal pages
    (auth)/              # signin, signup (student + teacher 2-step), forgot-password, verify-email, verification-*
    (app)/               # Authenticated dashboard. Has layout.tsx that gates on auth.
      dashboard/
        student/         # student home, classes, rate, profile
        teacher/         # teacher home, classes (list/new/[id]), earnings, withdraw, notifications, profile
        admin/           # admin home, classes, users, payouts, verifications
    auth/callback/       # Supabase OAuth + email-confirm callback
  components/            # Header, Footer, SidebarNav, Icons, auth/*
  lib/
    actions/             # All server actions live here. ONE file per resource.
      auth.ts            #   signIn, signUp, signOut
      classes.ts         #   createClass, publishClass, cancelClass, deleteClass, getClassDetail
      enrolment.ts       #   createEnrolment (the pay-and-enrol flow)
      session.ts         #   updateSessionLink, markClassCompleted
      ratings.ts         #   submitRating
      earnings.ts        #   getTeacherEarnings
      payouts.ts         #   requestWithdrawal, admin processing
      admin.ts           #   approveTeacher, rejectTeacher, suspendTeacher
      stats.ts           #   dashboard aggregates
    auth.ts              # requireProfile / getProfile — call these in every protected page
    auth/                # client-side helpers: validation, teacherSignupContext
    pricing.ts           # The 4 fixed price tiers (₦500/1.5k/3k/5k)
    money.ts             # NGN formatting helpers
    notifications.ts     # createNotification — writes to Notification table
    storage.ts           # Supabase Storage upload wrapper
    classCovers.ts       # Default cover images by subject
    prisma.ts            # Singleton Prisma client
    supabase/            # Server / browser Supabase client factories
docs/
  HANDOVER.md            # this file
  v2-subscription-model.md  # the proposed subscription pivot — Evalsam's idea, not built
```

**Data model summary** (from `prisma/schema.prisma`):

- `Profile` (1:1 with Supabase auth user) → has role STUDENT/TEACHER/ADMIN.
- `TeacherProfile` (extends Profile) → verification status, bank details.
- `Class` → owned by a teacher, has price, schedule, status DRAFT/LISTED/IN_PROGRESS/COMPLETED/CANCELLED.
- `Enrolment` → joins Student × Class. Has a `paymentId`.
- `Payment` → records a Paystack charge attempt. Tied to one student + one class.
- `Earning` → ledger row created when a Payment succeeds. Status PENDING_RELEASE → RELEASED (on class completion). `netNgn = gross - fee`.
- `Payout` → batch of released Earnings sent to a teacher's bank.
- `Rating` → one per (class, student).
- `Notification` → in-app notification feed.

## 4. Get it running locally (30 minutes)

```powershell
# 1. Clone (or you're already in the folder)
cd c:\Users\paste\Documents\Coding\learngrid

# 2. Install
npm install

# 3. Set env
cp .env.example .env
# Edit .env — see §10 for which values you actually need vs which can stay placeholder
```

**Minimum env you need to run locally:**

- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY` — from the Supabase project dashboard. *Ask Evalsam or whoever holds the Supabase login.*
- `DATABASE_URL` + `DIRECT_URL` — Supabase Postgres connection strings.
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- `PLATFORM_FEE_PERCENT=15` (placeholder until AD-005 is decided).

You can leave Paystack and Resend keys as placeholders for first-time local boot — those flows will fail gracefully (or noisily). To actually test paying for a class, get test Paystack keys from [paystack.com/docs/payments/test-payments](https://paystack.com/docs/payments/test-payments).

```powershell
# 4. Push schema (creates tables in Supabase)
npx prisma migrate deploy

# 5. Seed dev data
npm run seed

# 6. Run dev server
npm run dev
```

Open http://localhost:3000.

**Sanity check:** the seed script creates a few test accounts (check `prisma/seed.ts` for their emails/passwords). You should be able to sign in as any of them.

## 5. Walk the 7-step loop (do this before reading further)

Sign in as three different test accounts in three browsers (or browser profiles):

1. **As an admin** — go to `/dashboard/admin/verifications`. There should be a pending teacher. Approve them.
2. **As that teacher** — sign in, you'll land on `/dashboard/teacher`. Go to "Classes" → "New Class". Fill in the form. Note the **Price Tier dropdown** — 4 fixed tiers, teacher cannot type any number. Save as draft, then publish.
3. **As a student** — go to `/classes` (marketing) or `/dashboard/student/classes`. Find the listed class. Click it. Click "Pay & Enrol". You should hit the Paystack test flow.
4. **Back as the teacher** — go to the class detail page. You should see the student in the enrolment list. Paste a Google Meet URL into the "Live Class Link" field. Click "Mark as Completed."
5. **Back as the student** — your dashboard should now show a "Rate this class" prompt. Submit a rating.
6. **Back as the teacher** — earnings page should show the released amount. Click "Withdraw" to test the payout request flow.
7. **Back as the admin** — `/dashboard/admin/payouts` should show the pending withdrawal request.

If any of these steps doesn't work cleanly, log a bug. This is the spine.

## 6. What's built vs what's left

### 6.1 Built (verified working in dev)

| Area | Status | Key files |
|---|---|---|
| Auth — signup (student + teacher 2-step) | ✅ | `src/app/(auth)/signup/`, `src/components/auth/`, `src/lib/actions/auth.ts` |
| Auth — signin / forgot password / OAuth callback | ✅ | `src/app/(auth)/`, `src/app/auth/callback/route.ts` |
| Teacher verification (admin approve/reject) | ✅ | `src/app/(app)/dashboard/admin/verifications/`, `src/lib/actions/admin.ts` |
| Class CRUD (draft → publish → cancel) | ✅ | `src/app/(app)/dashboard/teacher/classes/`, `src/lib/actions/classes.ts` |
| Fixed price tiers (₦500/1.5k/3k/5k) | ✅ | `src/lib/pricing.ts` |
| Marketing class browse + detail page | ✅ | `src/app/(marketing)/classes/` |
| Student enrol + pay (Paystack test) | ✅ in test mode | `src/lib/actions/enrolment.ts` |
| Session link (paste Meet/Zoom URL) | ✅ | `src/app/(app)/dashboard/teacher/classes/[id]/actions-client.tsx`, `src/lib/actions/session.ts` |
| Mark class completed → release earnings | ✅ | `src/lib/actions/session.ts:30` |
| Student rating | ✅ | `src/app/(app)/dashboard/student/classes/[id]/rate/`, `src/lib/actions/ratings.ts` |
| Teacher earnings ledger | ✅ | `src/app/(app)/dashboard/teacher/earnings/`, `src/lib/actions/earnings.ts` |
| Teacher payout request | ✅ | `src/app/(app)/dashboard/teacher/withdraw/`, `src/lib/actions/payouts.ts` |
| Admin payout processing | ✅ | `src/app/(app)/dashboard/admin/payouts/`, `src/lib/actions/payouts.ts` |
| In-app notifications | ✅ | `src/lib/notifications.ts`, `src/app/(app)/dashboard/teacher/notifications/` |
| Marketing legal pages (privacy/terms/cookies/etc) | ✅ | `src/app/(marketing)/{privacy,terms,cookies,trust,help,payments-faq}/` |

### 6.2 Built but needs production hardening before launch

These work but rely on test keys or shortcuts that need to be flipped before real users hit them.

- **Paystack live keys** — currently test (`sk_test_…`). Needs production keys + verified business account. Also: confirm webhook signature verification is enabled (see `src/lib/actions/enrolment.ts` for the verify-charge flow).
- **Paystack webhook endpoint** — currently we verify charges by polling Paystack's verify endpoint after redirect. A proper webhook route (`/api/paystack/webhook`) would be more reliable. **Not built yet.** Consider it for v1.1.
- **24-hour rating window** — `src/lib/actions/session.ts:54` releases earnings *immediately* on class completion. The R-EP rule says we should wait 24 hours for students to rate first. Comment in the code says we did this "for the MVP demo so investors see the full money loop in one sitting." Switch to a delayed-release job (cron / scheduled function) before real money.
- **Resend live emails** — placeholder key. Sign up for Resend, verify a sending domain, populate `RESEND_API_KEY`.
- **Refund flow** — `EnrolmentStatus.REFUNDED` and `PaymentStatus.REFUNDED` exist in the schema but the actual Paystack refund call may not be wired. Check `cancelClass` in `src/lib/actions/classes.ts` and confirm it triggers a real refund.
- **Teacher bank verification** — when a teacher saves bank details, we should call Paystack's bank-resolve endpoint to confirm the account number matches a real account name. May or may not be wired.

### 6.3 Not built (remaining MVP work)

- **R-NT email triggers** — when a student enrols, when a teacher's class is published, when earnings are released, when a payout is processed. Code-wise these would all hook into `createNotification` and additionally send via Resend.
- **Embedded class video** — currently teachers paste a URL. AD-003 is open (Daily.co vs 100ms). Not in original MVP scope but Evalsam keeps asking for it; could be deferred to v1.1 once AD-003 resolves.
- **Mobile-responsive QA pass** — most pages are mobile-first; the admin pages are not. The recent fix to `.stat-grid` in `globals.css` helps. Walk every screen on a phone-width viewport.
- **Production deploy** — needs Vercel project linked to GitHub, env vars set in Vercel, Supabase prod project, Paystack live, Resend live, custom domain, DNS, SSL. None of this is set up yet.

## 7. Open decisions (AD-###) — must resolve before going live

| ID | Question | Owner | Status | What to do |
|---|---|---|---|---|
| AD-003 | Daily.co vs 100ms for embedded video | Evalsam (was P. James) | Open | Pick one. Or defer to v1.1 and keep paste-a-link. |
| AD-004 | Supabase Storage vs Cloudinary for verification docs | Ezekiel | Open (default Supabase) | If no objection by now, stay with Supabase. |
| AD-005 | Platform fee % | Evalsam | Open — currently 15% placeholder via `PLATFORM_FEE_PERCENT` env var | Evalsam confirms a number. Update env, optionally hardcode if it's stable. |
| AD-006 | Payout cycle | Evalsam | Open — currently weekly placeholder | Confirm, then implement a scheduled job. |

**Where these are flagged in code:** grep for `AD-00` across the codebase — comments mark every place a real value will be needed.

## 8. v1.x — what to do next (in priority order)

These are the pieces that turn the demo into a launchable product.

### Slice A — Pre-launch hardening (2 weeks)
1. Resolve AD-005 (platform fee) and AD-006 (payout cycle) with Evalsam.
2. Implement 24-hour rating window for earnings release (cron job).
3. Implement Paystack webhook endpoint (`/api/paystack/webhook`) with signature verification, replace polling.
4. Wire Resend email triggers for R-NT events.
5. Wire Paystack refund calls in `cancelClass` flow.
6. Wire Paystack bank-account verification in teacher onboarding.

### Slice B — Production environment (1 week)
1. Spin up Supabase **prod** project (separate from dev). Apply migrations.
2. Set up Vercel project, link to GitHub, configure prod env vars.
3. Buy/configure custom domain. Point DNS to Vercel.
4. Switch Paystack to live keys, register webhook URL in Paystack dashboard.
5. Verify Resend domain.
6. Sentry or similar for error monitoring.

### Slice C — Mobile QA + launch polish (1 week)
1. Walk every screen on iPhone SE width (375px) and tablet (768px). Fix what breaks.
2. Add real cover images for class subjects (currently fallback grayscales).
3. SEO meta tags + sitemap for marketing pages.
4. Cookies banner (legal — Nigeria NDPR requires consent for trackers).

### Slice D — Closed beta (2 weeks)
1. Invite 5–10 teachers (Chidera owns this — outreach).
2. Invite 20–50 students (Chidera + paid social).
3. Monitor: do classes actually happen? Do students show up? Do teachers paste links on time?
4. Collect feedback. **Do not pivot to v2 (subscriptions) until you have at least 2 weeks of beta data.**

## 9. v2 — Subscription monetisation (Evalsam's proposal)

See [`docs/v2-subscription-model.md`](v2-subscription-model.md) for the full draft.

**Summary:** Evalsam wants to replace per-class payments with a student subscription (₦15k/month, etc.) plus per-head teacher payouts. This is a **fundamental change** that:

- Replaces `Payment` (one-shot) with `Subscription` (recurring).
- Adds `Plan` and `Subscription` tables.
- Reworks `Earning` from "% of class price" to "per-head × duration".
- Switches Paystack from one-shot charges to Paystack Plans + recurring subs.
- Invalidates rules R-PY, R-EP, R-CR; retires AD-005 in its current form.
- Estimated 4–6 weeks of rework.

**The v2 doc** lists all the open design questions Evalsam's proposal didn't resolve (flat-rate vs prepaid credit, plan tiers, refunds, fraud, marketplace mechanics, etc). Treat that doc as the starting point for v2 design, NOT a spec to build from.

**Recommended path:** ship v1 per-class first. Get real student behaviour data. Then design v2 from evidence rather than guesses about price points.

## 10. v3+ — Future production flows

Aligned with the current architecture so you can layer them on without ripping anything out.

### 10.1 Embedded live video (AD-003)
- Pick Daily.co or 100ms.
- Add a `videoRoomId` column to `Class`. On publish, create a room via vendor API.
- Replace the "paste a session link" UI with an in-app `<VideoRoom />` component.
- Time-gate access: only show the join button N minutes before `scheduledAt`.
- Auto-mark `IN_PROGRESS` when the teacher starts the room; `COMPLETED` when they end it (or after `scheduledAt + durationMinutes` as fallback).

### 10.2 Recording
- Enable recording via vendor (Daily and 100ms both support cloud recording).
- Store metadata in a new `Recording` table: `classId`, `vendorRecordingId`, `url`, `expiresAt`, `consentStudents` (bool).
- **Critical:** consent flow. Students under 18 — explicit parent consent required to record (NDPR + likely school policy). Surface this at enrolment time.
- Add a Recordings tab to the student dashboard ("Replay completed classes you attended").
- Retention policy: auto-delete after N days unless paid plan upgrade.

### 10.3 Transcription
- After a recording is finalised, queue a transcription job. Options:
  - **OpenAI Whisper API** — cheapest, decent quality, ~$0.006/min.
  - **AssemblyAI** — better speaker diarization, ~$0.015/min.
  - **Google STT** — fine, but you're already on AWS via Supabase.
- New `Transcript` table: `recordingId`, `language`, `segmentsJson` (timestamp + speaker + text), `status`.
- UI: searchable transcript alongside the replay video, jump-to-timestamp.

### 10.4 AI class summary
- After transcription completes, send the transcript through an LLM (Claude or GPT-4) with a prompt: "Summarize this Nigerian secondary-school live class. List the key concepts, the worked examples, and any homework the teacher set."
- New `ClassSummary` table: `classId`, `recordingId`, `summaryMarkdown`, `generatedAt`.
- Show on the class replay page. Also: email the summary to enrolled students after class ends ("Here's what you learned today.")

### 10.5 Native mobile app
- Probably React Native via Expo for fastest team transition (since web is React).
- Auth via Supabase RN client.
- Reuse the same backend (server actions become API routes for the RN client, or use Supabase RPC).
- **Don't start this until web has 500+ active students.** Mobile UX needs evidence to design well.

### 10.6 Multi-currency / regional expansion
- LearnGrid is Nigerian-first. Adding Ghana / Kenya / South Africa means:
  - Paystack already supports Ghana/Kenya/SA — but each requires a separate sub-account.
  - Class prices need a `currency` column (default NGN).
  - Payouts in local currency. Teachers in country X get paid out via Paystack's local rail.
  - Marketing copy localisation.

### 10.7 Messaging
- Teacher ↔ student chat per class. Use Supabase Realtime channels keyed on `classId`.
- Moderation: store messages; admin can review. Block PII patterns (phone, email) automatically — required for child safety.

## 11. Gotchas you'll definitely hit

1. **React 19 + Next 15 — `useFormState` is renamed to `useActionState`.** Imports moved from `react-dom` to `react`. The codebase has been migrated (as of 2026-05-15). If you see `useFormState` errors in console, repeat the migration for any new code.

2. **Supabase Auth + SSR.** This project uses `@supabase/ssr`, NOT `@supabase/auth-helpers-nextjs` (deprecated). Server components must use the server client (`src/lib/supabase/server.ts`); client components use the browser client. Don't mix them.

3. **Prisma + Supabase pooled connections.** The `DATABASE_URL` uses port 6543 (pgbouncer pooled) for the app. `DIRECT_URL` uses 5432 for migrations. If you see "prepared statement already exists" errors at runtime, you're hitting the pooled URL with a query Prisma can't pool — usually fixed by `connection_limit=1` in the URL. Already set.

4. **The "DAY 0" Supabase auth hook.** When a user signs up via Supabase, we need to mirror them into our `Profile` table. This happens in `src/app/auth/callback/route.ts`. If a user signs up but no Profile is created, the dashboard 500s. Check this route first when auth seems broken.

5. **Class statuses don't auto-advance.** `IN_PROGRESS` is in the schema but nothing currently sets it — class goes DRAFT → LISTED → COMPLETED (manually). When you add embedded video, wire IN_PROGRESS on room-start.

6. **Earnings release timing.** Currently same-day on class completion for demo purposes. Change to 24-hour delayed before launch. The comment in `src/lib/actions/session.ts` flags this.

7. **The marketing site shares the same Next.js project.** Don't add a separate site. The home page at `/` is the marketing page. The `(marketing)` route group has its own layout (no sidebar). The `(app)` route group has the sidebar layout and requires auth.

8. **Test accounts.** Don't seed real Nigerian phone numbers. Use `+234000…` patterns in dev. Real-looking PII in dev DBs gets flagged in audits.

9. **Inline styles vs CSS classes.** The codebase mixes both. Don't refactor — keep the pattern you find in any given file. There's a lint rule warning about inline styles; it's expected, not a real issue.

10. **The big `globals.css` (~2,700 lines).** Yes, it's a lot. It's intentional — one file means designers can scan it whole. Don't split it into modules without discussing.

## 12. Running tasks for the next dev

Sorted by what blocks what.

### Immediately (week 1)
- [ ] Get yourself added to Supabase, Paystack (test + live), Resend, Vercel, GitHub.
- [ ] Run the 7-step loop walkthrough in §5.
- [ ] Read `prisma/schema.prisma` end-to-end.
- [ ] Resolve AD-005 and AD-006 with Evalsam (these are blockers).
- [ ] Push the recent uncommitted changes (run `git status` — there's a stash of unmerged work in the working tree; see §13).

### Weeks 2–3 (pre-launch hardening — Slice A in §8)
- [ ] 24-hour earnings release window.
- [ ] Paystack webhook handler.
- [ ] Resend email triggers.
- [ ] Refund + bank-verify wiring.

### Weeks 4 (production env — Slice B in §8)
- [ ] Supabase prod project + migrations.
- [ ] Vercel deploy.
- [ ] Domain + DNS + SSL.
- [ ] Paystack live + webhook URL.
- [ ] Resend domain verification.

### Weeks 5–6 (QA + closed beta — Slices C + D)

### Weeks 7+
- Public launch, or v2 design sprint if Evalsam pushes the subscription pivot.

## 13. Housekeeping before P. James leaves

**Things that need to transfer:**

1. **Supabase project ownership** — currently on P. James's account. Add Evalsam (and the next dev) as owners; consider transferring the project to a LearnGrid org.
2. **Vercel project** — if/when set up, ownership should be on a LearnGrid email, not personal.
3. **Paystack business account** — must be registered to LearnGrid (LLC/RC number), not personal.
4. **Domain registration** — same.
5. **GitHub repo ownership** — currently `VoltzHub`. Transfer or add team.
6. **Test account credentials** — share via password manager.
7. **Claude Code subscription** — if the team relies on AI-assisted development, someone needs to pick up the bill (or the next dev brings their own).
8. **Uncommitted work in the local working tree** — at handover, `git status` shows ~25 modified files and ~10 new files not yet committed. Review with `git diff`, commit what's good, document what's WIP. **Do not delete the local repo before this is pushed.**

**Document NOT to take when leaving:** the `.env` file. It contains keys that belong to the business, not the developer.

## 14. Where the design assets live

| Asset | Location |
|---|---|
| Functional PRD v1 (rules R-UR / R-TV / R-CS / R-PY / R-EP / R-CR / R-RT / R-NT) | `learngrid_workspace.html` (shared as attachment) |
| 30-screen UI inventory (SC-001 to SC-030) | Same `learngrid_workspace.html` |
| Team-friendly version | `learngrid_team.html` |
| Week 1 deliverables | `learngrid_week1.html` |
| Sprint 0 + 30-day plan | `LearnGrid_Sprint_0_and_30_Day_Action_Plan.pdf` |
| Kickoff brief | `LearnGrid_Team_Kickoff_Brief.pdf` |

These are **not** in this repo — they're shared as HTML/PDF artifacts in the team's channel. Ask Alali or Evalsam for the latest versions.

---

**End of handover.** If something in this doc is wrong, fix it in place — keep this file current as the project evolves.
