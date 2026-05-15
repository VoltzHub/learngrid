import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies LearnGrid uses, why we use them, and how to control them.",
};

export default function CookiesPage() {
  return (
    <div className="info-page">
      <div className="info-page-header">
        <span className="info-page-eyebrow">Legal</span>
        <h1>Cookie Policy</h1>
        <p className="info-page-intro">
          Cookies are small text files your browser stores. LearnGrid uses only the
          cookies we need to make the site work — no advertising trackers.
        </p>
      </div>

      <h2>What we use</h2>

      <h3>Essential cookies (always on)</h3>
      <ul>
        <li>
          <strong>sb-access-token / sb-refresh-token</strong> — keep you signed in
          via Supabase Auth. Without these, every page would log you out.
        </li>
        <li>
          <strong>session</strong> — remembers your active dashboard role.
        </li>
      </ul>

      <h3>Functional cookies</h3>
      <ul>
        <li>
          <strong>filter / subject preference</strong> — remembers the last
          subject you browsed on the marketplace so you don&apos;t have to re-pick it.
        </li>
      </ul>

      <h2>What we don&apos;t use</h2>
      <ul>
        <li>No third-party advertising cookies.</li>
        <li>No cross-site tracking pixels.</li>
        <li>No data sold to data brokers.</li>
      </ul>

      <h2>Controlling cookies</h2>
      <p>
        You can clear cookies anytime from your browser settings. Doing so will sign
        you out of LearnGrid; sign back in and your essential cookies will be set
        again.
      </p>
      <p>
        If you block all cookies, LearnGrid will not work — sign-in, payments, and
        enrolment all rely on session cookies.
      </p>

      <h2>Third-party cookies</h2>
      <p>
        When you make a payment, Paystack&apos;s popup is hosted on{" "}
        <code>paystack.co</code> and sets its own cookies to process the transaction
        securely. Those cookies are governed by{" "}
        <a href="https://paystack.com/privacy" target="_blank" rel="noopener noreferrer">
          Paystack&apos;s privacy policy
        </a>
        .
      </p>

      <div className="info-page-meta">
        Last updated: 14 May 2026 · Contact:{" "}
        <a href="mailto:legal@learngrid.ng">legal@learngrid.ng</a>
      </div>
    </div>
  );
}
