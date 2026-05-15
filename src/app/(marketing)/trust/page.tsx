import type { Metadata } from "next";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Safety & Trust",
  description: "How LearnGrid keeps students and teachers safe — verification, secure payments, and clear standards.",
};

const pillars = [
  {
    icon: "check" as const,
    title: "Verified teachers only",
    body:
      "Every teacher on LearnGrid submits ID, teaching credentials, and a short profile review before they can list a class. We re-verify any teacher who receives multiple low ratings or unresolved complaints.",
  },
  {
    icon: "creditCard" as const,
    title: "Secure Naira payments",
    body:
      "All payments are processed by Paystack, Nigeria's most trusted card processor. LearnGrid never sees your card details — Paystack handles everything end-to-end with PCI-DSS Level 1 security.",
  },
  {
    icon: "bell" as const,
    title: "Money held until class delivered",
    body:
      "Student payments sit in escrow until 24 hours after the class ends. If the teacher no-shows or cancels, refunds are automatic. Teachers only get paid out for classes they actually delivered.",
  },
  {
    icon: "star" as const,
    title: "Open ratings & reviews",
    body:
      "After every class, students rate their teacher 1–5 stars. Average rating and review count are public on each teacher's profile, so trust builds visibly over time.",
  },
];

export default function TrustPage() {
  return (
    <div className="info-page">
      <div className="info-page-header">
        <span className="info-page-eyebrow">Safety &amp; Trust</span>
        <h1>How we keep LearnGrid safe</h1>
        <p className="info-page-intro">
          We&apos;re building a marketplace people can trust with their money and
          their kids&apos; education. Here&apos;s exactly how that works.
        </p>
      </div>

      {pillars.map((p) => (
        <div key={p.title} className="info-card">
          <div className="info-card-header">
            <div className="info-card-icon">
              <Icon name={p.icon} size={18} />
            </div>
            <h2 style={{ margin: 0 }}>{p.title}</h2>
          </div>
          <p style={{ margin: 0 }}>{p.body}</p>
        </div>
      ))}

      <h2>Report a problem</h2>
      <p>
        If something goes wrong — a teacher no-shows, a class is misrepresented,
        a payment looks wrong — email{" "}
        <a href="mailto:trust@learngrid.ng">trust@learngrid.ng</a>. We respond to
        every trust report within one business day.
      </p>

      <h2>Standards for teachers</h2>
      <ul>
        <li>Teach classes you advertised — same topic, same length, same level.</li>
        <li>Be on time. If you must cancel, do it more than 24 hours in advance.</li>
        <li>Respect every student. Harassment or discrimination results in immediate suspension.</li>
        <li>Never take payments outside LearnGrid — both for your protection and ours.</li>
      </ul>

      <h2>Standards for students</h2>
      <ul>
        <li>Show up on time and ready to learn — small classes work best when everyone joins.</li>
        <li>Rate fairly. Reviews shape every teacher&apos;s livelihood.</li>
        <li>Treat your teachers and classmates with respect.</li>
      </ul>
    </div>
  );
}
