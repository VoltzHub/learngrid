import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Answers to common questions about using LearnGrid as a student or teacher.",
};

const sections: Array<{
  icon: "user" | "bookOpen" | "naira" | "calendar" | "messageCircle";
  title: string;
  items: Array<{ q: string; a: string }>;
}> = [
  {
    icon: "user",
    title: "Account & Sign Up",
    items: [
      {
        q: "How do I create an account?",
        a: "Tap Get Started, pick whether you want to teach or learn, and complete the short signup form. Teachers go through a verification step before listing classes.",
      },
      {
        q: "I didn't receive my verification email — what now?",
        a: "Check your spam folder first. If it's not there, try signing in — we'll resend automatically. Still stuck? Email support@learngrid.ng.",
      },
      {
        q: "Can I be both a student and a teacher?",
        a: "Right now each account has one role. Use a separate email if you want both — we'll merge the accounts later in the year.",
      },
    ],
  },
  {
    icon: "bookOpen",
    title: "Classes & Enrolment",
    items: [
      {
        q: "How do live classes work?",
        a: "Teachers list a date, time, and capacity. You pay your seat in Naira via Paystack. Just before class starts, you'll see a Join button on the class page that opens the live session.",
      },
      {
        q: "What happens if I miss a class?",
        a: "Live classes don't auto-record. If you can't make it, reach out to the teacher — most will share notes or schedule a make-up if there's room.",
      },
      {
        q: "Can I cancel an enrolment?",
        a: "Yes — cancellations more than 24 hours before class start get a full refund. Inside 24 hours, refunds are at the teacher's discretion.",
      },
    ],
  },
  {
    icon: "naira",
    title: "Payments & Earnings",
    items: [
      {
        q: "How do I pay for a class?",
        a: "We use Paystack — Nigeria's most trusted card processor. Pay with any debit card, bank transfer, or USSD. You'll see a Paystack popup, never enter card details on LearnGrid.",
      },
      {
        q: "When do teachers get paid?",
        a: "Earnings unlock 24 hours after the class ends (so refund/rating windows can resolve). Teachers can request a payout to their Nigerian bank account anytime after that.",
      },
      {
        q: "What's the platform fee?",
        a: "LearnGrid keeps 15% of each enrolment. Teachers keep 85%. No subscriptions, no listing fees.",
      },
    ],
  },
  {
    icon: "calendar",
    title: "Scheduling & Joining",
    items: [
      {
        q: "What time zone are classes shown in?",
        a: "West Africa Time (WAT, UTC+1). If you're abroad, convert from your local time before enrolling.",
      },
      {
        q: "What do I need to join a live class?",
        a: "A device with a browser and a stable internet connection. Headphones recommended. The Join button opens the meeting in a new tab — no extra app to install.",
      },
    ],
  },
];

export default function HelpCenterPage() {
  return (
    <div className="info-page">
      <div className="info-page-header">
        <span className="info-page-eyebrow">Help Center</span>
        <h1>How can we help?</h1>
        <p className="info-page-intro">
          Quick answers to the questions students and teachers ask us most.
          Can&apos;t find what you&apos;re looking for? <a href="mailto:support@learngrid.ng">Email support</a>.
        </p>
      </div>

      {sections.map((section) => (
        <div key={section.title} style={{ marginBottom: 28 }}>
          <div className="info-card-header" style={{ marginBottom: 14 }}>
            <div className="info-card-icon">
              <Icon name={section.icon} size={18} />
            </div>
            <h2 style={{ margin: 0 }}>{section.title}</h2>
          </div>
          {section.items.map((item) => (
            <div key={item.q} className="info-card">
              <h3 style={{ margin: "0 0 6px" }}>{item.q}</h3>
              <p style={{ margin: 0 }}>{item.a}</p>
            </div>
          ))}
        </div>
      ))}

      <div className="info-card" style={{ background: "var(--d-blue-light)", borderColor: "rgba(30, 87, 216, 0.15)" }}>
        <div className="info-card-header">
          <div className="info-card-icon">
            <Icon name="messageCircle" size={18} />
          </div>
          <h2 style={{ margin: 0 }}>Still stuck?</h2>
        </div>
        <p>
          Send us a note at <a href="mailto:support@learngrid.ng">support@learngrid.ng</a> —
          we usually reply within a business day.
        </p>
        <p style={{ margin: 0 }}>
          Building a class and want help? <Link href="/signup?role=teacher">Become a teacher</Link>{" "}
          and our onboarding team will walk you through it.
        </p>
      </div>
    </div>
  );
}
