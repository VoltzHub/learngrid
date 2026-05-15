"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "@/components/Icons";
import { PasswordField } from "@/components/auth/PasswordField";
import { useTeacherSignup } from "@/lib/auth/teacherSignupContext";
import {
  focusFirstInvalid,
  isValidEmail,
  isValidNigerianMobile,
  normalizeLocalPhone,
} from "@/lib/auth/validation";

type FieldKey = "firstName" | "lastName" | "email" | "phone" | "password" | "confirmPassword";
type FieldErrors = Partial<Record<FieldKey, string>>;

export default function TeacherSignupStep1() {
  const router = useRouter();
  const ctx = useTeacherSignup();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneLocal: "",
    password: ctx.password,
    confirmPassword: ctx.password,
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitTried, setSubmitTried] = useState(false);
  const [liveAnnounce, setLiveAnnounce] = useState("");

  // Restore non-sensitive Step 1 fields from sessionStorage (so Back from Step 2 doesn't wipe them).
  // Password lives only in React context — never persisted to storage.
  useEffect(() => {
    const stored = sessionStorage.getItem("teacher_step1");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Record<string, string>;
      const [firstName = "", ...rest] = (parsed.fullName ?? "").split(" ");
      setForm((f) => ({
        ...f,
        firstName: parsed.firstName ?? firstName,
        lastName: parsed.lastName ?? rest.join(" "),
        email: parsed.email ?? "",
        phoneLocal: normalizeLocalPhone(parsed.phone ?? ""),
      }));
    } catch {
      // ignore malformed cache
    }
  }, []);

  const errors: FieldErrors = useMemo(() => {
    const e: FieldErrors = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!isValidEmail(form.email)) e.email = "Enter a valid email address.";
    if (!form.phoneLocal) e.phone = "Phone number is required.";
    else if (form.phoneLocal.length !== 10) e.phone = "Enter a 10-digit Nigerian number.";
    else if (!isValidNigerianMobile(form.phoneLocal)) e.phone = "Enter a valid Nigerian mobile number.";
    if (!form.password) e.password = "Password is required.";
    else if (form.password.length < 8) e.password = "Use at least 8 characters.";
    else if (!/\d/.test(form.password)) e.password = "Include at least one number.";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (form.password && form.confirmPassword !== form.password) e.confirmPassword = "Passwords do not match.";
    return e;
  }, [form]);

  const passwordsMatch =
    form.password.length > 0 && form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const isValid = Object.keys(errors).length === 0;

  function shouldShow(field: FieldKey): boolean {
    return Boolean(errors[field]) && (submitTried || Boolean(touched[field]));
  }

  function invalidProps(field: FieldKey) {
    return shouldShow(field) ? ({ "aria-invalid": "true" } as const) : {};
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitTried(true);
    if (!isValid) {
      const count = Object.keys(errors).length;
      setLiveAnnounce(`${count} field${count === 1 ? "" : "s"} need${count === 1 ? "s" : ""} your attention.`);
      // Defer to next tick so aria-invalid is in the DOM
      requestAnimationFrame(() => focusFirstInvalid(formRef.current));
      return;
    }

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    const phone = `+234${form.phoneLocal}`;
    // Persist only non-sensitive fields. Password stays in React context.
    sessionStorage.setItem(
      "teacher_step1",
      JSON.stringify({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        fullName,
        email: form.email.trim(),
        phone,
      }),
    );
    ctx.setPassword(form.password);
    router.push("/signup/teacher/step2");
  }

  return (
    <div className="signup-wide">
      <div className="signup-form-col">
        <Link href="/signup" className="signup-back-link">
          <Icon name="arrowLeft" size={14} /> Back
        </Link>

        <h1 className="signup-title">Become a Teacher</h1>
        <p className="signup-subtitle">Step 1 of 2 — Basic information</p>

        <div className="step-progress-named" aria-label="Signup progress: step 1 of 2">
          <div>
            <div className="step-bar active" />
            <p className="step-name active">Basic info</p>
          </div>
          <div>
            <div className="step-bar" />
            <p className="step-name">Credentials</p>
          </div>
        </div>

        <div className="trust-strip">
          <span className="trust-strip-icon">
            <Icon name="shieldCheck" size={16} />
          </span>
          <p className="trust-strip-text">
            <strong>Verified payouts in Naira.</strong> Your details are encrypted in transit.
          </p>
        </div>

        {/* Mobile-only benefits (the right-side aside takes over on desktop) */}
        <div className="benefits-mobile" aria-hidden="true">
          <div className="benefits-mobile-item">
            <span className="benefits-mobile-item-icon"><Icon name="naira" size={14} /></span>
            <p className="benefits-mobile-item-text"><strong>Earn in Naira</strong> — payouts within 48 hours.</p>
          </div>
          <div className="benefits-mobile-item">
            <span className="benefits-mobile-item-icon"><Icon name="calendar" size={14} /></span>
            <p className="benefits-mobile-item-text"><strong>Set your own schedule</strong> — teach when it suits you.</p>
          </div>
          <div className="benefits-mobile-item">
            <span className="benefits-mobile-item-icon"><Icon name="shieldCheck" size={14} /></span>
            <p className="benefits-mobile-item-text"><strong>Verified status</strong> — stand out to students.</p>
          </div>
        </div>

        <div role="status" aria-live="polite" className="sr-only">{liveAnnounce}</div>

        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <div className="name-row">
            <div className="form-group">
              <label className="form-label" htmlFor="firstName">
                First name <span className="required">*</span>
              </label>
              <input
                id="firstName"
                className={`form-input${shouldShow("firstName") ? " error" : ""}`}
                type="text"
                placeholder="Chinedu"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                onBlur={() => setTouched({ ...touched, firstName: true })}
                autoComplete="given-name"
                {...invalidProps("firstName")}
                aria-describedby={shouldShow("firstName") ? "firstName-err" : undefined}
              />
              {shouldShow("firstName") && (
                <p id="firstName-err" className="form-error">{errors.firstName}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="lastName">
                Last name <span className="required">*</span>
              </label>
              <input
                id="lastName"
                className={`form-input${shouldShow("lastName") ? " error" : ""}`}
                type="text"
                placeholder="Okafor"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                onBlur={() => setTouched({ ...touched, lastName: true })}
                autoComplete="family-name"
                {...invalidProps("lastName")}
                aria-describedby={shouldShow("lastName") ? "lastName-err" : undefined}
              />
              {shouldShow("lastName") && (
                <p id="lastName-err" className="form-error">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email address <span className="required">*</span>
            </label>
            <input
              id="email"
              className={`form-input${shouldShow("email") ? " error" : ""}`}
              type="email"
              inputMode="email"
              placeholder="you@school.edu.ng"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onBlur={() => setTouched({ ...touched, email: true })}
              autoComplete="email"
              {...invalidProps("email")}
              aria-describedby={shouldShow("email") ? "email-err" : "email-hint"}
            />
            {shouldShow("email") ? (
              <p id="email-err" className="form-error">{errors.email}</p>
            ) : (
              <p id="email-hint" className="form-hint">We&apos;ll send your verification link here.</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone number <span className="required">*</span>
            </label>
            <div className={`form-phone-wrap${shouldShow("phone") ? " error" : ""}`}>
              <span className="form-phone-prefix" aria-hidden="true">+234</span>
              <input
                id="phone"
                className="form-input"
                type="tel"
                inputMode="tel"
                placeholder="801 234 5678"
                required
                value={form.phoneLocal}
                onChange={(e) => setForm({ ...form, phoneLocal: normalizeLocalPhone(e.target.value) })}
                onBlur={() => setTouched({ ...touched, phone: true })}
                autoComplete="tel-national"
                {...invalidProps("phone")}
                aria-describedby={shouldShow("phone") ? "phone-err" : undefined}
              />
            </div>
            {shouldShow("phone") && (
              <p id="phone-err" className="form-error">{errors.phone}</p>
            )}
          </div>

          <PasswordField
            id="password"
            label="Password"
            required
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onBlur={() => setTouched({ ...touched, password: true })}
            showStrength
            hint="Min. 8 characters with at least one number."
            error={shouldShow("password") ? errors.password : undefined}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            required
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            onBlur={() => setTouched({ ...touched, confirmPassword: true })}
            error={shouldShow("confirmPassword") ? errors.confirmPassword : undefined}
            successText={!shouldShow("confirmPassword") && passwordsMatch ? "Passwords match" : undefined}
          />

          <button
            className="btn btn-primary btn-block signup-continue"
            type="submit"
            disabled={!isValid}
          >
            Continue <Icon name="arrowRight" size={16} />
          </button>
        </form>

        <p className="signup-signin-line">
          Already have an account?{" "}
          <Link href="/signin">Sign In</Link>
        </p>
      </div>

      <aside className="signup-aside" aria-label="Why teach on LearnGrid">
        <h2 className="signup-aside-title">Why teach on LearnGrid</h2>
        <ul className="signup-aside-list">
          <li className="signup-aside-item">
            <span className="signup-aside-item-icon">
              <Icon name="naira" size={15} />
            </span>
            <p className="signup-aside-item-text">
              <strong>Earn in Naira</strong>
              Payouts to your Nigerian bank within 48 hours of each class.
            </p>
          </li>
          <li className="signup-aside-item">
            <span className="signup-aside-item-icon">
              <Icon name="calendar" size={15} />
            </span>
            <p className="signup-aside-item-text">
              <strong>Set your own schedule</strong>
              Create live classes on the days and times that suit you.
            </p>
          </li>
          <li className="signup-aside-item">
            <span className="signup-aside-item-icon">
              <Icon name="shieldCheck" size={15} />
            </span>
            <p className="signup-aside-item-text">
              <strong>Verified status</strong>
              Stand out to students with a reviewed teaching profile.
            </p>
          </li>
          <li className="signup-aside-item">
            <span className="signup-aside-item-icon">
              <Icon name="messageCircle" size={15} />
            </span>
            <p className="signup-aside-item-text">
              <strong>Direct contact with students</strong>
              Build long-term relationships and grow your roster.
            </p>
          </li>
        </ul>
      </aside>
    </div>
  );
}
