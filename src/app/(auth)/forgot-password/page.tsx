"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/Icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // In production, call supabase.auth.resetPasswordForEmail(email)
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div style={{ padding: "48px 20px", textAlign: "center", maxWidth: 400, margin: "0 auto" }}>
        <div className="success-icon" style={{ background: "var(--d-blue-light)", color: "var(--d-blue)" }}>
          <Icon name="mail" size={30} />
        </div>
        <h2 style={{ fontSize: 21, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.3px" }}>
          Check your inbox
        </h2>
        <p style={{ fontSize: 14, color: "var(--d-gray-500)", lineHeight: 1.6, marginBottom: 4 }}>
          We sent a reset link to
        </p>
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{email}</p>
        <p style={{ fontSize: 12, color: "var(--d-gray-400)", marginBottom: 28 }}>
          Link expires in 15 minutes
        </p>
        <button className="btn btn-primary btn-block" onClick={() => window.open("mailto:")}>
          Open Email App
        </button>
        <p style={{ fontSize: 13, color: "var(--d-gray-500)", marginTop: 16 }}>
          Didn&apos;t get it?{" "}
          <button onClick={() => setSent(false)} style={{ color: "var(--d-blue)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
            Resend email
          </button>
        </p>
        <p style={{ marginTop: 10 }}>
          <Link href="/signin" style={{ color: "var(--d-blue)", fontWeight: 700, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="arrowLeft" size={14} /> Back to Sign In
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 20px", maxWidth: 400, margin: "0 auto" }}>
      <Link href="/signin" style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--d-gray-500)", fontSize: 13, marginBottom: 20 }}>
        <Icon name="arrowLeft" size={14} /> Back
      </Link>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div className="success-icon" style={{ background: "var(--d-blue-light)", color: "var(--d-blue)" }}>
          <Icon name="key" size={30} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", letterSpacing: "-0.3px" }}>
          Reset your password
        </h1>
        <p style={{ fontSize: 14, color: "var(--d-gray-500)", margin: 0 }}>
          Enter your email and we&apos;ll send a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input className="form-input" type="email" placeholder="The email on your account" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={!email || loading} style={{ opacity: !email || loading ? 0.5 : 1, marginTop: 8 }}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--d-gray-500)", marginTop: 20 }}>
        Remember it now?{" "}
        <Link href="/signin" style={{ color: "var(--d-blue)", fontWeight: 700 }}>Sign In</Link>
      </p>
    </div>
  );
}
