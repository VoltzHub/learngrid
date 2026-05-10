import Link from "next/link";
import { Icon, type IconName } from "@/components/Icons";

const items: Array<{ href: string; label: string; icon: IconName; key: string }> = [
  { href: "/dashboard/teacher", label: "Home", icon: "home", key: "home" },
  { href: "/dashboard/teacher/classes", label: "Classes", icon: "bookOpen", key: "classes" },
  { href: "/dashboard/teacher/earnings", label: "Earn", icon: "naira", key: "earnings" },
  { href: "/dashboard/teacher/profile", label: "Profile", icon: "user", key: "profile" },
];

export function TeacherBottomNav({ active }: { active: "home" | "classes" | "earnings" | "profile" | "notifications" }) {
  return (
    <nav className="bottom-nav">
      {items.slice(0, 2).map((item) => (
        <Link key={item.key} href={item.href} className={`bottom-nav-item${active === item.key ? " active" : ""}`}>
          <span className="bottom-nav-icon"><Icon name={item.icon} size={20} /></span>
          <span className="bottom-nav-label">{item.label}</span>
        </Link>
      ))}
      <div className="bottom-nav-fab">
        <Link href="/dashboard/teacher/classes/new" className="bottom-nav-fab-btn" aria-label="Create class">
          +
        </Link>
      </div>
      {items.slice(2).map((item) => (
        <Link key={item.key} href={item.href} className={`bottom-nav-item${active === item.key ? " active" : ""}`}>
          <span className="bottom-nav-icon"><Icon name={item.icon} size={20} /></span>
          <span className="bottom-nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
