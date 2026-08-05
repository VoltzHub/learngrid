import { requireProfile } from "@/lib/auth";
import { SidebarNav } from "@/components/SidebarNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();

  return (
    <div className="dash-shell">
      <SidebarNav role={profile.role} fullName={profile.fullName} />
      <main className="dash-main" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", overflow: "auto" }}>
        {children}
      </main>
    </div>
  );
}

