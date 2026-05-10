import Link from "next/link";
import { Icon } from "@/components/Icons";

export default function VerificationPendingPage() {
  return (
    <div style={{ padding: "28px 20px", maxWidth: 400, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div className="success-icon" style={{ background: "var(--d-amber-light)", color: "var(--d-amber)", width: 64, height: 64 }}>
          <Icon name="clock" size={30} />
        </div>
        <span className="status-badge badge-pending">Pending Review</span>
        <h2 style={{ fontSize: 19, fontWeight: 700, margin: "14px 0 8px", letterSpacing: "-0.3px" }}>
          Application Under Review
        </h2>
        <p style={{ fontSize: 13, color: "var(--d-gray-500)", lineHeight: 1.6, margin: 0 }}>
          Our team is verifying your documents. You&apos;ll receive an email once reviewed.
        </p>
      </div>

      <div className="verif-checklist">
        <p className="verif-checklist-title">Submitted Documents</p>
        {[
          { label: "Full Legal Name", done: true },
          { label: "Teaching Qualification", done: true },
          { label: "Government ID / NIN", done: true },
          { label: "Phone Verification", done: false },
        ].map((item) => (
          <div className="verif-check-item" key={item.label}>
            <div className={`verif-check-icon ${item.done ? "verif-check-done" : "verif-check-pending"}`}>
              {item.done ? <Icon name="check" size={12} /> : "-"}
            </div>
            <span className="verif-check-label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="notice notice-amber">
        <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="mail" size={16} /> Estimated review: <strong>24-48 hours</strong>. Check your email (including spam).
        </p>
      </div>

      <Link className="btn btn-secondary btn-block" href="mailto:support@learngrid.ng">
        Contact Support
      </Link>
    </div>
  );
}
