import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The rules of using LearnGrid as a student or teacher.",
};

export default function TermsPage() {
  return (
    <div className="info-page">
      <div className="info-page-header">
        <span className="info-page-eyebrow">Legal</span>
        <h1>Terms of Service</h1>
        <p className="info-page-intro">
          The rules of using LearnGrid. By signing up you agree to these terms.
          Plain English first, lawyer English on request.
        </p>
      </div>

      <h2>1. Who we are</h2>
      <p>
        LearnGrid is a live learning marketplace operated by LearnGrid Nigeria.
        Throughout these terms, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;LearnGrid&rdquo; refer to the company;
        &ldquo;you&rdquo; refers to the account holder.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must be at least 13 years old to use LearnGrid. Under 18s need a parent or guardian to manage payments.</li>
        <li>You&apos;re responsible for keeping your password safe. Don&apos;t share it.</li>
        <li>You must provide accurate information. Impersonation and fake accounts will be removed.</li>
        <li>One person, one account. Teachers can&apos;t use a personal student account to enrol in their own classes.</li>
      </ul>

      <h2>3. Classes &amp; enrolment</h2>
      <ul>
        <li>Teachers set the class title, description, schedule, and seat limit. LearnGrid sets the price tier.</li>
        <li>Once you enrol, you commit to paying. Refunds follow the policy below.</li>
        <li>Teachers must deliver the class as advertised. Bait-and-switch results in suspension.</li>
        <li>LearnGrid is not a party to the class itself — we provide the marketplace, payments, and trust layer.</li>
      </ul>

      <h2>4. Payments, fees &amp; refunds</h2>
      <ul>
        <li>All payments are processed by Paystack in Nigerian Naira (₦).</li>
        <li>LearnGrid takes a 15% platform fee. Teachers keep 85%.</li>
        <li>Refunds are automatic if cancelled more than 24 hours before class start, or if the teacher cancels or no-shows.</li>
        <li>Refunds inside 24 hours are at the teacher&apos;s discretion.</li>
        <li>Teacher earnings unlock 24 hours after class ends and can be paid out to a Nigerian bank account.</li>
      </ul>

      <h2>5. Acceptable use</h2>
      <p>You agree NOT to:</p>
      <ul>
        <li>Harass, threaten, or discriminate against other users.</li>
        <li>Share or sell class recordings, materials, or session links without the teacher&apos;s consent.</li>
        <li>Use LearnGrid for anything illegal under Nigerian law.</li>
        <li>Try to bypass our payment system to avoid the platform fee.</li>
        <li>Scrape, reverse-engineer, or attempt to disrupt our service.</li>
      </ul>

      <h2>6. Intellectual property</h2>
      <p>
        Teachers retain copyright in the materials they create. By listing a
        class, you grant LearnGrid a licence to display the title, description,
        cover image, and your name on the marketplace for as long as the listing
        is active.
      </p>

      <h2>7. Suspension &amp; termination</h2>
      <p>
        We can suspend or close any account that breaks these rules. We&apos;ll
        always tell you why, in writing. You can delete your account at any time
        from your profile page.
      </p>

      <h2>8. Liability</h2>
      <p>
        LearnGrid provides the marketplace &ldquo;as is.&rdquo; We don&apos;t guarantee any
        specific learning outcome or earnings. To the extent permitted by law,
        our total liability for any claim is capped at the fees you paid us in
        the 12 months before the claim.
      </p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of the Federal Republic of Nigeria.
        Any disputes will be resolved in the courts of Lagos State.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update these terms. Material changes will be emailed to all
        active users at least 14 days before they take effect.
      </p>

      <div className="info-page-meta">
        Last updated: 14 May 2026 · Contact:{" "}
        <a href="mailto:legal@learngrid.ng">legal@learngrid.ng</a>
      </div>
    </div>
  );
}
