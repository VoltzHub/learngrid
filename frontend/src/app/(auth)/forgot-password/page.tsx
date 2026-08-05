"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import { focusFirstInvalid, isValidEmail } from "@/lib/auth/validation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitTried, setSubmitTried] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [liveAnnounce, setLiveAnnounce] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const error = useMemo(() => {
    if (!email.trim()) return "Email is required.";
    if (!isValidEmail(email)) return "Enter a valid email address.";
    return undefined;
  }, [email]);

  const showError = Boolean(error) && (submitTried || touched);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitTried(true);
    if (error) {
      setLiveAnnounce("Please correct the email field.");
      requestAnimationFrame(() => focusFirstInvalid(formRef.current));
      return;
    }
    setLoading(true);
    try {
      const { createBrowserClient } = await import("@supabase/ssr");
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      );
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      });
      setSent(true);
    } catch {
      // Silently handle — still show success to prevent email enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="signup-form-col" style={{ textAlign: "center", paddingTop: 24 }}>
        <div className="success-icon" style={{ background: "var(--d-blue-light)", color: "var(--d-blue)" }}>
          <Icon name="mail" size={30} />
        </div>
        <h2 className="signup-title" style={{ marginTop: 12 }}>Check your inbox</h2>
        <p style={{ fontSize: 14, color: "var(--d-gray-500)", lineHeight: 1.6, marginBottom: 4 }}>
          We sent a reset link to
        </p>
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{email}</p>
        <p style={{ fontSize: 12, color: "var(--d-gray-400)", marginBottom: 24 }}>
          Link expires in 15 minutes.
        </p>
        <Link className="btn btn-primary btn-block" href="/signin">Back to Sign In</Link>
        <p className="signup-signin-line">
          Didn&apos;t get it?{" "}
          <button
            type="button"
            onClick={() => setSent(false)}
            style={{ color: "var(--d-blue)", fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, padding: 0 }}
          >
            Resend email
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="signup-form-col">
      <Link href="/signin" className="signup-back-link">
        <Icon name="arrowLeft" size={14} /> Back to sign in
      </Link>

      <div style={{ textAlign: "center", marginBottom: 22 }}>
        <div className="success-icon" style={{ background: "var(--d-blue-light)", color: "var(--d-blue)" }}>
          <Icon name="key" size={30} />
        </div>
        <h1 className="signup-title" style={{ marginTop: 12 }}>Reset your password</h1>
        <p className="signup-subtitle">Enter your email and we&apos;ll send a reset link.</p>
      </div>

      <div role="status" aria-live="polite" className="sr-only">{liveAnnounce}</div>

      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="fp-email">Email address</label>
          <input
            id="fp-email"
            className={`form-input${showError ? " error" : ""}`}
            type="email"
            inputMode="email"
            placeholder="The email on your account"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            autoComplete="email"
            {...(showError ? ({ "aria-invalid": "true" } as const) : {})}
            aria-describedby={showError ? "fp-email-err" : undefined}
          />
          {showError && <p id="fp-email-err" className="form-error">{error}</p>}
        </div>

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={Boolean(error) || loading}
          style={{ opacity: Boolean(error) || loading ? 0.5 : 1, marginTop: 8 }}
        >
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      <p className="signup-signin-line">
        Remember it now?{" "}
        <Link href="/signin">Sign In</Link>
      </p>
    </div>
  );
}
