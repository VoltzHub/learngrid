import Link from "next/link";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
        padding: "40px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          background: "#fff",
          padding: "48px 36px",
          borderRadius: 20,
          boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06), 0 8px 16px rgba(30, 87, 216, 0.04)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            margin: "0 auto 24px",
            borderRadius: 18,
            background: "linear-gradient(135deg, #1e57d8, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <Compass size={34} strokeWidth={1.8} />
        </div>

        <p
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#1e57d8",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "0 0 8px",
          }}
        >
          404 · Page not found
        </p>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: -0.5,
            margin: "0 0 10px",
            color: "#0f172a",
          }}
        >
          We can&apos;t find that page
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: "0 0 28px" }}>
          The link may be old, or the class may have been removed. Try browsing
          the marketplace or heading home.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              borderRadius: 999,
              background: "#1e57d8",
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            <ArrowLeft size={16} /> Back to home
          </Link>
          <Link
            href="/classes"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "12px 20px",
              borderRadius: 999,
              background: "#f1f5f9",
              color: "#0f172a",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            Browse classes
          </Link>
        </div>
      </div>
    </div>
  );
}
