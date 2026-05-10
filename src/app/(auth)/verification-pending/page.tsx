import Link from "next/link";

export default function VerificationPendingPage() {
  return (
    <div style={{ padding: "28px 20px", maxWidth: 400, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <Link href="/" className="brand" style={{ justifyContent: "center", marginBottom: 0 }}>
          <span className="brand-mark" style={{ width: 28, height: 28 }}><img src="/assets/logo-cap.svg" alt="" /></span>
          <span className="brand-text" style={{ fontSize: "1rem" }}>LearnGrid</span>
        </Link>
        <div style={{ fontSize: 40, margin: "18px 0 12px" }}>⏳</div>
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
              {item.done ? "✓" : "–"}
            </div>
            <span className="verif-check-label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="notice notice-amber">
        <p>📬 Estimated review: <strong>24–48 hours</strong>. Check your email (including spam).</p>
      </div>

      <Link className="btn btn-secondary btn-block" href="mailto:support@learngrid.ng">
        Contact Support
      </Link>
    </div>
  );
}
