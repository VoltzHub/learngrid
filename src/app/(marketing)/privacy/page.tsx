import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How LearnGrid collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="info-page">
      <div className="info-page-header">
        <span className="info-page-eyebrow">Legal</span>
        <h1>Privacy Policy</h1>
        <p className="info-page-intro">
          We respect your privacy. This page explains, in plain language, what data
          we collect when you use LearnGrid, why we collect it, and what your rights are.
        </p>
      </div>

      <h2>What we collect</h2>
      <p>
        When you create an account, we collect your name, email address, phone
        number (if provided), and account type (student, teacher, or admin).
        Teachers additionally provide subject expertise, a short bio, and bank
        account details for payouts.
      </p>
      <p>
        When you enrol in a class, we record the enrolment, the payment reference
        from Paystack, and the rating you leave after the class ends. We do{" "}
        <strong>not</strong> store your card details — Paystack handles that.
      </p>
      <p>
        We also collect basic technical data: browser, device type, IP address, and
        cookies that keep you signed in.
      </p>

      <h2>Why we collect it</h2>
      <ul>
        <li>To create and operate your account.</li>
        <li>To match students with the right teachers and process payments.</li>
        <li>To send you transactional emails (sign-up confirmation, receipts, class reminders).</li>
        <li>To detect fraud and abuse.</li>
        <li>To improve LearnGrid over time — aggregate, anonymised usage stats only.</li>
      </ul>

      <h2>Who we share it with</h2>
      <p>
        We share the minimum necessary data with these processors so the platform works:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong> — hosts our database and authentication. Servers in EU-West (Ireland).
        </li>
        <li>
          <strong>Paystack</strong> — processes Naira payments and bank payouts.
        </li>
        <li>
          <strong>Resend</strong> — sends transactional email on our behalf.
        </li>
      </ul>
      <p>We never sell your personal data. We don&apos;t share it with advertisers.</p>

      <h2>Your rights</h2>
      <ul>
        <li>Ask for a copy of the data we hold about you.</li>
        <li>Ask us to correct anything that&apos;s wrong.</li>
        <li>Ask us to delete your account and personal data (subject to records we must keep for tax/audit).</li>
      </ul>
      <p>
        To exercise any of these rights, email{" "}
        <a href="mailto:legal@learngrid.ng">legal@learngrid.ng</a>. We respond within
        14 days.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Active account data stays until you delete your account. Transaction
        records are kept for 7 years to satisfy Nigerian tax and financial-services
        record-keeping requirements.
      </p>

      <h2>Children</h2>
      <p>
        LearnGrid is intended for users aged 13+. Students under 18 need a
        parent or guardian to manage payments. If you believe a child has signed
        up without consent, email <a href="mailto:legal@learngrid.ng">legal@learngrid.ng</a>{" "}
        and we&apos;ll delete the account.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we make material changes to this policy we&apos;ll email all active users
        before the change takes effect.
      </p>

      <div className="info-page-meta">
        Last updated: 14 May 2026 · Contact:{" "}
        <a href="mailto:legal@learngrid.ng">legal@learngrid.ng</a>
      </div>
    </div>
  );
}
