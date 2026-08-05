import type { Metadata } from "next";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Payments FAQ",
  description: "Everything you need to know about paying for classes and getting paid as a teacher on LearnGrid.",
};

const studentFaqs = [
  {
    q: "How do I pay?",
    a: "When you tap Enrol, a Paystack popup opens. Pay with any Nigerian debit card, bank transfer, or USSD. Your seat is reserved the moment payment confirms.",
  },
  {
    q: "Is my card information safe?",
    a: "Yes. LearnGrid never sees or stores your card details — Paystack handles the entire payment with PCI-DSS Level 1 security. You'll see the official Paystack popup, not a LearnGrid form.",
  },
  {
    q: "What if the payment fails?",
    a: "No charge goes through and your seat isn't reserved. Refresh the page and try again, or use a different card.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes — cancel more than 24 hours before class start for an automatic full refund. Within 24 hours, refunds are at the teacher's discretion. If a teacher cancels or no-shows, you're refunded automatically.",
  },
  {
    q: "Why was I charged more than the listed price?",
    a: "You shouldn't be. LearnGrid charges the exact Naira price shown on the class page — no service fees, taxes, or surprises. If your card statement looks wrong, email finance@learngrid.ng with your reference number.",
  },
];

const teacherFaqs = [
  {
    q: "How much does LearnGrid take?",
    a: "We keep 15% of each enrolment. You keep 85%. No subscriptions, no listing fees, no payment processing fees on top.",
  },
  {
    q: "When are my earnings released?",
    a: "Earnings unlock 24 hours after the class ends. This buffer covers the refund and rating window. Once released, you can request a payout to your Nigerian bank account anytime.",
  },
  {
    q: "How long do payouts take?",
    a: "Once you request a payout, it normally settles in 1–3 business days via Paystack Transfers, directly to your registered Nigerian bank account.",
  },
  {
    q: "Is there a minimum payout?",
    a: "You can withdraw any amount above ₦500. Most teachers wait until they've stacked a few classes to save on transfer time, but it's your call.",
  },
  {
    q: "What if a student requests a refund after I've been paid?",
    a: "If a refund is approved after release, we deduct it from your next payout. We'll always email you first so there are no surprises.",
  },
];

export default function PaymentsFaqPage() {
  return (
    <div className="info-page">
      <div className="info-page-header">
        <span className="info-page-eyebrow">Payments FAQ</span>
        <h1>How money moves on LearnGrid</h1>
        <p className="info-page-intro">
          Clear, no-nonsense answers about paying for classes and getting paid as
          a teacher. Built around Paystack, settled in Naira.
        </p>
      </div>

      <div className="info-card" style={{ background: "var(--d-green-light)", borderColor: "rgba(16, 185, 129, 0.2)" }}>
        <div className="info-card-header">
          <div className="info-card-icon" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
            <Icon name="check" size={18} />
          </div>
          <h2 style={{ margin: 0, color: "#065f46" }}>Quick facts</h2>
        </div>
        <ul style={{ margin: 0 }}>
          <li>15% platform fee · teachers keep 85%</li>
          <li>Payments via Paystack — PCI-DSS Level 1 secure</li>
          <li>Earnings released 24h after class</li>
          <li>Payouts settle in 1–3 business days</li>
        </ul>
      </div>

      <h2>For students</h2>
      {studentFaqs.map((f) => (
        <div key={f.q} className="info-card">
          <h3 style={{ margin: "0 0 6px" }}>{f.q}</h3>
          <p style={{ margin: 0 }}>{f.a}</p>
        </div>
      ))}

      <h2>For teachers</h2>
      {teacherFaqs.map((f) => (
        <div key={f.q} className="info-card">
          <h3 style={{ margin: "0 0 6px" }}>{f.q}</h3>
          <p style={{ margin: 0 }}>{f.a}</p>
        </div>
      ))}

      <h2>Still have a payment question?</h2>
      <p>
        Email <a href="mailto:finance@learngrid.ng">finance@learngrid.ng</a> with your
        Paystack reference (it starts with <code>lg_</code>) and we&apos;ll look into it
        within one business day.
      </p>
    </div>
  );
}
