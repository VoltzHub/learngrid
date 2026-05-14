import { Skeleton } from "@/components/Skeleton";

export default function LoadingTeacherDashboard() {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <Skeleton width={44} height={44} radius={999} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <Skeleton width={140} height={16} />
          <Skeleton width={90} height={12} />
        </div>
      </div>

      <Skeleton width={180} height={22} style={{ marginBottom: 6 }} />
      <Skeleton width={240} height={14} style={{ marginBottom: 18 }} />

      <div className="stat-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card" style={{ background: "#fff", border: "1px solid var(--border)" }}>
            <Skeleton width={60} height={11} style={{ marginBottom: 8 }} />
            <Skeleton width={90} height={22} style={{ marginBottom: 6 }} />
            <Skeleton width={70} height={11} />
          </div>
        ))}
      </div>

      <Skeleton width={140} height={16} style={{ margin: "20px 0 10px" }} />
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 14, marginBottom: 10 }}>
          <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
          <Skeleton width="40%" height={12} style={{ marginBottom: 12 }} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Skeleton width={80} height={14} />
            <Skeleton width={60} height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}
