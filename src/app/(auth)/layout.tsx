import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell">
      <div style={{ width: "100%", maxWidth: 440, display: "flex", flexDirection: "column", gap: 24 }}>
        <Link className="brand" href="/" aria-label="LearnGrid home">
          <span className="brand-mark" aria-hidden="true">
            <img src="/assets/logo-cap.svg" alt="" />
          </span>
          <span className="brand-text">LearnGrid</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
