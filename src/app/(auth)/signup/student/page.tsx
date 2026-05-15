"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { signUp, type AuthFormState } from "@/lib/actions/auth";
import { useActionState, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import { PasswordField } from "@/components/auth/PasswordField";
import { focusFirstInvalid, isValidEmail } from "@/lib/auth/validation";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      className="btn btn-primary btn-block"
      type="submit"
      disabled={pending || disabled}
      style={{ opacity: pending || disabled ? 0.5 : 1 }}
    >
      {pending ? "Creating account..." : "Create account"}
    </button>
  );
}

type FieldKey = "firstName" | "lastName" | "email" | "password";

export default function StudentSignupPage() {
  const [state, formAction] = useActionState<AuthFormState, FormData>(signUp, undefined);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitTried, setSubmitTried] = useState(false);
  const [liveAnnounce, setLiveAnnounce] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Use at least 8 characters.";
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0 && agreed;

  function shouldShow(field: FieldKey): boolean {
    return Boolean(errors[field]) && (submitTried || Boolean(touched[field]));
  }

  function invalidProps(field: FieldKey) {
    return shouldShow(field) ? ({ "aria-invalid": "true" } as const) : {};
  }

  function handleSubmit(formData: FormData) {
    setSubmitTried(true);
    if (!isValid) {
      const count = Object.keys(errors).length + (agreed ? 0 : 1);
      setLiveAnnounce(`${count} item${count === 1 ? "" : "s"} need${count === 1 ? "s" : ""} your attention.`);
      requestAnimationFrame(() => focusFirstInvalid(formRef.current));
      return;
    }
    formData.set("fullName", `${form.firstName.trim()} ${form.lastName.trim()}`);
    formData.set("email", form.email.trim());
    formData.set("password", form.password);
    formData.set("role", "STUDENT");
    formAction(formData);
  }

  if (state && !state.error) {
    return (
      <div className="signup-form-col" style={{ textAlign: "center", paddingTop: 24 }}>
        <div className="success-icon" style={{ background: "var(--d-green-light)", color: "var(--d-green)" }}>
          <Icon name="check" size={30} />
        </div>
        <h2 className="signup-title" style={{ marginTop: 12 }}>Check your email!</h2>
        <p style={{ fontSize: 14, color: "var(--d-gray-500)", marginBottom: 24, lineHeight: 1.6 }}>
          We sent a verification link to <strong>{form.email}</strong>. Click it to activate your account.
        </p>
        <Link className="btn btn-success btn-block" href="/classes">Browse live classes</Link>
        <div style={{ marginTop: 10 }}>
          <Link className="btn btn-secondary btn-block" href="/signin">Go to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-form-col">
      <Link href="/signup" className="signup-back-link">
        <Icon name="arrowLeft" size={14} /> Back
      </Link>

      <h1 className="signup-title">Create your student account</h1>
      <p className="signup-subtitle">Learn live from verified Nigerian teachers.</p>

      <div className="trust-strip">
        <span className="trust-strip-icon">
          <Icon name="shieldCheck" size={16} />
        </span>
        <p className="trust-strip-text">
          <strong>Pay per session.</strong> No subscriptions, no hidden fees. Cancel anytime.
        </p>
      </div>

      {state?.error && (
        <div className="notice notice-red" role="alert">
          <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="alertTriangle" size={16} /> {state.error}
          </p>
        </div>
      )}

      <div role="status" aria-live="polite" className="sr-only">{liveAnnounce}</div>

      <form ref={formRef} action={handleSubmit}>
        <div className="name-row">
          <div className="form-group">
            <label className="form-label" htmlFor="s-firstName">
              First name <span className="required">*</span>
            </label>
            <input
              id="s-firstName"
              className={`form-input${shouldShow("firstName") ? " error" : ""}`}
              type="text"
              placeholder="Amaka"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              onBlur={() => setTouched({ ...touched, firstName: true })}
              autoComplete="given-name"
              {...invalidProps("firstName")}
              aria-describedby={shouldShow("firstName") ? "s-firstName-err" : undefined}
            />
            {shouldShow("firstName") && (
              <p id="s-firstName-err" className="form-error">{errors.firstName}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="s-lastName">
              Last name <span className="required">*</span>
            </label>
            <input
              id="s-lastName"
              className={`form-input${shouldShow("lastName") ? " error" : ""}`}
              type="text"
              placeholder="Adewale"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              onBlur={() => setTouched({ ...touched, lastName: true })}
              autoComplete="family-name"
              {...invalidProps("lastName")}
              aria-describedby={shouldShow("lastName") ? "s-lastName-err" : undefined}
            />
            {shouldShow("lastName") && (
              <p id="s-lastName-err" className="form-error">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="s-email">
            Email address <span className="required">*</span>
          </label>
          <input
            id="s-email"
            className={`form-input${shouldShow("email") ? " error" : ""}`}
            type="email"
            inputMode="email"
            placeholder="you@example.com"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onBlur={() => setTouched({ ...touched, email: true })}
            autoComplete="email"
            {...invalidProps("email")}
            aria-describedby={shouldShow("email") ? "s-email-err" : undefined}
          />
          {shouldShow("email") && (
            <p id="s-email-err" className="form-error">{errors.email}</p>
          )}
        </div>

        <PasswordField
          id="s-password"
          label="Password"
          required
          autoComplete="new-password"
          placeholder="Create a password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onBlur={() => setTouched({ ...touched, password: true })}
          showStrength
          hint="Min. 8 characters."
          error={shouldShow("password") ? errors.password : undefined}
        />

        <div className="form-check">
          <input type="checkbox" id="s-terms" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <label htmlFor="s-terms">
            I agree to LearnGrid&apos;s <Link href="/terms">Terms of Service</Link> and{" "}
            <Link href="/privacy">Privacy Policy</Link>.
          </label>
        </div>

        <SubmitButton disabled={!isValid} />
      </form>

      <p className="signup-signin-line">
        Already have an account?{" "}
        <Link href="/signin">Sign In</Link>
      </p>
    </div>
  );
}
