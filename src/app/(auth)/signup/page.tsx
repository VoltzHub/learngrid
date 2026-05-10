"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupRolePicker() {
  const [role, setRole] = useState<"teacher" | "student" | null>(null);
  const router = useRouter();

  return (
    <div style={{ padding: "32px 20px", maxWidth: 400, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <Link href="/" className="brand" style={{ justifyContent: "center" }}>
          <span className="brand-mark" aria-hidden="true">
            <img src="/assets/logo-cap.svg" alt="" />
          </span>
          <span className="brand-text">LearnGrid</span>
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "18px 0 6px", letterSpacing: "-0.3px" }}>
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: "var(--d-gray-500)", margin: 0 }}>
          How would you like to join LearnGrid?
        </p>
      </div>

      <button
        type="button"
        className={`onboard-role-card${role === "teacher" ? " selected-teacher" : ""}`}
        onClick={() => setRole("teacher")}
      >
        <div className="onboard-role-icon" style={{ background: "var(--d-blue-light)" }}>👨‍🏫</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "var(--d-gray-900)" }}>
            I want to teach
          </p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--d-gray-500)" }}>
            Create live classes · Earn in Naira
          </p>
        </div>
        <div className="onboard-role-radio">
          {role === "teacher" && <span style={{ color: "#fff", fontSize: 9, fontWeight: 800 }}>✓</span>}
        </div>
      </button>

      <button
        type="button"
        className={`onboard-role-card${role === "student" ? " selected-student" : ""}`}
        onClick={() => setRole("student")}
      >
        <div className="onboard-role-icon" style={{ background: "var(--d-green-light)" }}>📚</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "var(--d-gray-900)" }}>
            I want to learn
          </p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "var(--d-gray-500)" }}>
            Browse classes · Pay per session
          </p>
        </div>
        <div className="onboard-role-radio">
          {role === "student" && <span style={{ color: "#fff", fontSize: 9, fontWeight: 800 }}>✓</span>}
        </div>
      </button>

      <div style={{ marginTop: 24, marginBottom: 16 }}>
        <button
          className="btn btn-primary btn-block"
          disabled={!role}
          onClick={() => {
            if (role === "teacher") router.push("/signup/teacher");
            if (role === "student") router.push("/signup/student");
          }}
          style={{
            opacity: role ? 1 : 0.5,
            cursor: role ? "pointer" : "not-allowed",
          }}
        >
          Continue
        </button>
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "var(--d-gray-500)" }}>
        Already have an account?{" "}
        <Link href="/signin" style={{ color: "var(--d-blue)", fontWeight: 700 }}>
          Sign In
        </Link>
      </p>
    </div>
  );
}
