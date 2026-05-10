import Link from "next/link";

export default function VerificationRejectedPage() {
  // In a real flow, rejection reasons would come from the DB via searchParams or server component
  const reasons = [
    { field: "Teaching Qualification", message: "Document is expired or illegible. Upload a clear, valid certificate." },
    { field: "Government ID / NIN", message: "Photo does not match the uploaded ID. Re-upload a matching document." },
  ];

  return (
    <div style={{ padding: "28px 20px", maxWidth: 400, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div className="success-icon" style={{ background: "var(--d-red-light)" }}>❌</div>
        <span className="status-badge badge-rejected">Not Verified</span>
        <h2 style={{ fontSize: 19, fontWeight: 700, margin: "14px 0 8px", letterSpacing: "-0.3px" }}>
          Verification Unsuccessful
        </h2>
        <p style={{ fontSize: 13, color: "var(--d-gray-500)", lineHeight: 1.6, margin: 0 }}>
          We couldn&apos;t approve your application. Review the issues below and re-apply.
        </p>
      </div>

      <div className="notice notice-red" style={{ textAlign: "left" }}>
        <p style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: 0.5, color: "var(--d-red)", marginBottom: 12 }}>Issues to Fix</p>
        {reasons.map((r, i) => (
          <div key={r.field} style={{ paddingBottom: i < reasons.length - 1 ? 10 : 0, marginBottom: i < reasons.length - 1 ? 10 : 0, borderBottom: i < reasons.length - 1 ? "1px solid #FCA5A5" : "none" }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "var(--d-red)" }}>{r.field}</p>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#991B1B", lineHeight: 1.5 }}>{r.message}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "var(--d-gray-100)", borderRadius: 10, padding: "10px 12px", marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: "var(--d-gray-500)", lineHeight: 1.5, margin: 0 }}>
          💡 No limit on re-applications. Fix the issues above and resubmit.
        </p>
      </div>

      <Link className="btn btn-primary btn-block" href="/signup/teacher/step2">
        Update Documents &amp; Re-apply
      </Link>
      <div style={{ marginTop: 10 }}>
        <Link className="btn btn-secondary btn-block" href="mailto:support@learngrid.ng">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
