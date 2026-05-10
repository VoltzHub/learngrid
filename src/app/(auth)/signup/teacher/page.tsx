"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/Icons";

export default function TeacherSignupStep1() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const filled = form.fullName && form.email && form.phone && form.password && form.confirmPassword;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.phone.startsWith("+234") && !form.phone.startsWith("0")) {
      setError("Enter a valid Nigerian phone number (+234 format).");
      return;
    }

    sessionStorage.setItem("teacher_step1", JSON.stringify(form));
    router.push("/signup/teacher/step2");
  }

  return (
    <div style={{ padding: "24px 20px 32px", maxWidth: 400, margin: "0 auto" }}>
      <Link href="/signup" style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--d-gray-500)", fontSize: 13, marginBottom: 20 }}>
        <Icon name="arrowLeft" size={14} /> Back
      </Link>

      <h1 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 3px", letterSpacing: "-0.3px" }}>
        Become a Teacher
      </h1>
      <p style={{ fontSize: 13, color: "var(--d-gray-500)", marginBottom: 14 }}>
        Step 1 of 2 - Basic Information
      </p>

      <div className="step-progress">
        <div className="step-bar active" />
        <div className="step-bar" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Legal Name <span className="required">*</span></label>
          <input className="form-input" type="text" placeholder="As on your official ID" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} autoComplete="name" />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address <span className="required">*</span></label>
          <input className="form-input" type="email" placeholder="Your professional email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number <span className="required">*</span></label>
          <input className="form-input" type="tel" placeholder="+234 Nigerian number" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} autoComplete="tel" />
        </div>

        <div className="form-group">
          <label className="form-label">Password <span className="required">*</span></label>
          <input className="form-input" type="password" placeholder="Create a strong password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
          <p className="form-hint">Min. 8 characters with at least one number</p>
        </div>

        <div className="form-group">
          <label className="form-label">Confirm Password <span className="required">*</span></label>
          <input className="form-input" type="password" placeholder="Repeat your password" required value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} autoComplete="new-password" />
        </div>

        {error && (
          <div className="notice notice-red">
            <p style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="alertTriangle" size={16} /> {error}
            </p>
          </div>
        )}

        <button
          className="btn btn-primary btn-block"
          type="submit"
          disabled={!filled}
          style={{ opacity: filled ? 1 : 0.5, marginTop: 8, gap: 8 }}
        >
          Continue to Step 2 <Icon name="arrowRight" size={16} />
        </button>
      </form>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--d-gray-500)", marginTop: 16 }}>
        Already have an account?{" "}
        <Link href="/signin" style={{ color: "var(--d-blue)", fontWeight: 700 }}>Sign In</Link>
      </p>
    </div>
  );
}
