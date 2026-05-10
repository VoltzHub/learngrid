import { requireProfile } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export default async function AdminDashboardPage() {
  const profile = await requireProfile();
  if (profile.role !== Role.ADMIN) redirect("/");

  return (
    <>
      <h1 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: 8 }}>Admin</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Operations console. Slice 2 will add the verification queue, Slice 4 the payment
        review tools.
      </p>

      <div className="dash-card">
        <h2 style={{ fontSize: "1rem", marginBottom: 12 }}>Pending verifications</h2>
        <div className="dash-empty">No pending verifications.</div>
      </div>

      <div className="dash-card">
        <h2 style={{ fontSize: "1rem", marginBottom: 12 }}>Recent activity</h2>
        <div className="dash-empty">No activity yet.</div>
      </div>
    </>
  );
}
