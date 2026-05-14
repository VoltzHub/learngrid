import { Skeleton } from "@/components/Skeleton";

export default function LoadingClasses() {
  return (
    <section className="section marketplace-section">
      <div className="container">
        <div className="marketplace-header">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Skeleton width={140} height={22} radius={999} />
            <Skeleton width="80%" height={42} />
            <Skeleton width="65%" height={18} />
          </div>
        </div>

        <div className="marketplace-filters" style={{ marginBottom: 24 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} width={92} height={34} radius={999} />
          ))}
        </div>

        <div className="marketplace-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <Skeleton width="100%" height={0} radius={0} style={{ aspectRatio: "16 / 9", height: "auto" }} />
              <div style={{ padding: "18px 22px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                <Skeleton width="85%" height={20} />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Skeleton width={32} height={32} radius={999} />
                  <Skeleton width={120} height={14} />
                </div>
                <Skeleton width="60%" height={14} />
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                  <Skeleton width={70} height={18} />
                  <Skeleton width={90} height={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
