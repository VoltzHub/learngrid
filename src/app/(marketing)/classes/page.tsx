export default function ClassesPlaceholderPage() {
  return (
    <section className="section">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 style={{ fontSize: "2rem", marginBottom: 16 }}>Browse classes</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.7 }}>
          Discovery and class listings ship in Slice 3 of the build. Once teachers can
          publish classes (Slice 2 verification → Slice 3 listings), this page becomes
          the public catalogue with subject, date, and price filters.
        </p>
      </div>
    </section>
  );
}
