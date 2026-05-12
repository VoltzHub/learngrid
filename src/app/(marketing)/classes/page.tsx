import Link from "next/link";
import { getListedClasses } from "@/lib/actions/classes";

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: { subject?: string };
}) {
  const classes = await getListedClasses();
  const activeSubject = searchParams.subject ?? "all";

  // Get distinct subjects for filter
  const subjects = Array.from(new Set(classes.map((c) => c.subject))).sort();

  const filtered =
    activeSubject === "all"
      ? classes
      : classes.filter((c) => c.subject === activeSubject);

  return (
    <section className="section marketplace-section">
      <div className="container">
        {/* Header */}
        <div className="marketplace-header">
          <div>
            <span className="section-tag">Live Classes</span>
            <h1 className="marketplace-title">
              Discover classes taught by{" "}
              <span className="accent">verified teachers</span>
            </h1>
            <p className="marketplace-subtitle">
              Browse live, interactive classes across every subject. Pay per
              class in Naira — no subscriptions.
            </p>
          </div>
        </div>

        {/* Filters */}
        {subjects.length > 0 && (
          <div className="marketplace-filters">
            <Link
              href="/classes"
              className={`filter-chip${activeSubject === "all" ? " active" : ""}`}
            >
              All Subjects
            </Link>
            {subjects.map((s) => (
              <Link
                key={s}
                href={`/classes?subject=${encodeURIComponent(s)}`}
                className={`filter-chip${activeSubject === s ? " active" : ""}`}
              >
                {s}
              </Link>
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="marketplace-empty">
            <div className="marketplace-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="48" height="48">
                <path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H20v17H7.5A3.5 3.5 0 0 0 4 22V5.5Z" />
                <path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H4v17h12.5A3.5 3.5 0 0 1 20 22V5.5Z" />
              </svg>
            </div>
            <h3>No classes available yet</h3>
            <p>
              Check back soon — new classes are published daily by verified
              teachers across Nigeria.
            </p>
            <Link className="btn btn-primary" href="/signup?role=teacher">
              Become a Teacher
            </Link>
          </div>
        ) : (
          <div className="marketplace-grid">
            {filtered.map((cls) => {
              const seatsLeft = cls.seatLimit - cls.seatsEnrolled;
              const isFull = seatsLeft <= 0;
              const dateStr = cls.scheduledAt.toLocaleDateString("en-NG", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const timeStr = cls.scheduledAt.toLocaleTimeString("en-NG", {
                hour: "numeric",
                minute: "2-digit",
              });
              return (
                <Link
                  key={cls.id}
                  href={`/classes/${cls.id}`}
                  className="mkt-card"
                >
                  <div className="mkt-card-header">
                    <span className="mkt-card-subject">{cls.subject}</span>
                    {isFull && <span className="mkt-card-full">Full</span>}
                    {!isFull && seatsLeft <= 5 && (
                      <span className="mkt-card-hot">
                        {seatsLeft} seat{seatsLeft !== 1 ? "s" : ""} left
                      </span>
                    )}
                  </div>
                  <h3 className="mkt-card-title">{cls.title}</h3>
                  <div className="mkt-card-teacher">
                    <div className="mkt-card-avatar">
                      {cls.teacher.fullName
                        ?.split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ?? "?"}
                    </div>
                    <span>{cls.teacher.fullName ?? "Teacher"}</span>
                  </div>
                  <div className="mkt-card-meta">
                    <div className="mkt-card-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
                      {dateStr}
                    </div>
                    <div className="mkt-card-meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="14" height="14"><path d="M12 6v6l4 2m6-2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" /></svg>
                      {timeStr} · {cls.durationMinutes}min
                    </div>
                  </div>
                  <div className="mkt-card-footer">
                    <span className="mkt-card-price">
                      ₦{cls.priceNgn.toLocaleString()}
                    </span>
                    <span className="mkt-card-seats">
                      {cls._count.enrolments}/{cls.seatLimit} enrolled
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
