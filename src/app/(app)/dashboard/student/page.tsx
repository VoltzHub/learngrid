import Link from "next/link";
import { requireProfile } from "@/lib/auth";

export default async function StudentDashboardPage() {
  const profile = await requireProfile();

  return (
    <>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 8 }}>
        Welcome back{profile.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}.
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Here&apos;s a snapshot of your learning. Slice 3 will populate this with real
        data.
      </p>

      <div className="dash-card">
        <h2 style={{ fontSize: "1rem", marginBottom: 12 }}>Upcoming classes</h2>
        <div className="dash-empty">
          You haven&apos;t enrolled in any classes yet.
          <div style={{ marginTop: 16 }}>
            <Link className="btn btn-primary" href="/classes">
              Browse classes
            </Link>
          </div>
        </div>
      </div>

      <div className="dash-card">
        <h2 style={{ fontSize: "1rem", marginBottom: 12 }}>Past classes</h2>
        <div className="dash-empty">No past classes yet.</div>
      </div>
    </>
  );
}
