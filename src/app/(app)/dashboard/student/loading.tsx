import { Skeleton } from "@/components/Skeleton";

export default function LoadingStudentDashboard() {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <Skeleton width={44} height={44} radius={999} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton width={140} height={16} />
          <Skeleton width={70} height={12} />
        </div>
      </div>

      <Skeleton width={200} height={22} style={{ marginBottom: 6 }} />
      <Skeleton width={260} height={14} style={{ marginBottom: 18 }} />

      <div className="stat-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="stat-card" style={{ background: "#fff", border: "1px solid var(--border)" }}>
            <Skeleton width={60} height={11} style={{ marginBottom: 8 }} />
            <Skeleton width={70} height={22} style={{ marginBottom: 6 }} />
            <Skeleton width={80} height={11} />
          </div>
        ))}
      </div>

      <Skeleton width={160} height={16} style={{ margin: "20px 0 10px" }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <Skeleton width="75%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="50%" height={12} />
        </div>
      ))}
    </div>
  );
}
