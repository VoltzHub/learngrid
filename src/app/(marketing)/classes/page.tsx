import Link from "next/link";
import { getListedClasses } from "@/lib/actions/classes";
import { getClassCover } from "@/lib/classCovers";
import { Avatar } from "@/components/Avatar";
import { ngn } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; q?: string }>;
}) {
  const classes = await getListedClasses();
  const sp = await searchParams;
  const activeSubject = sp.subject ?? "all";
  const query = (sp.q ?? "").trim().toLowerCase();

  // Get distinct subjects for filter
  const subjects = Array.from(new Set(classes.map((c) => c.subject))).sort();

  const filtered = classes
    .filter((c) => activeSubject === "all" || c.subject === activeSubject)
    .filter(
      (c) =>
        !query ||
        c.title.toLowerCase().includes(query) ||
        c.subject.toLowerCase().includes(query) ||
        (c.teacher.fullName?.toLowerCase().includes(query) ?? false),
    );

  return (
    <section className="section marketplace-section">
      <div className="container">
        {/* Header */}
        <div className="marketplace-header">
          <div>
            <span className="section-tag">Live Classes</span>
            <h1 className="marketplace-title">
              {query ? (
                <>
                  Results for <span className="accent">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                <>
                  Discover classes taught by{" "}
                  <span className="accent">verified teachers</span>
                </>
              )}
            </h1>
            <p className="marketplace-subtitle">
              {query
                ? `${filtered.length} class${filtered.length !== 1 ? "es" : ""} found.`
                : "Browse live, interactive classes across every subject. Pay per class in Naira — no subscriptions."}
              {query && (
                <>
                  {" "}
                  <Link href="/classes" style={{ color: "var(--primary)", fontWeight: 600 }}>
                    Clear search
                  </Link>
                </>
              )}
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
              const cover = getClassCover({ coverImageUrl: cls.coverImageUrl, subject: cls.subject });
              return (
                <Link
                  key={cls.id}
                  href={`/classes/${cls.id}`}
                  className="mkt-card"
                >
                  <div className="mkt-card-cover">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cover} alt="" loading="lazy" />
                    <div className="mkt-card-cover-overlay" />
                    <span className="mkt-card-cover-chip">{cls.subject}</span>
                    {isFull && <span className="mkt-card-cover-tag full">Full</span>}
                    {!isFull && seatsLeft <= 5 && (
                      <span className="mkt-card-cover-tag hot">
                        {seatsLeft} left
                      </span>
                    )}
                  </div>
                  <div className="mkt-card-body">
                    <h3 className="mkt-card-title">{cls.title}</h3>
                    <div className="mkt-card-teacher">
                      <Avatar name={cls.teacher.fullName} size={32} />
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
                      <span className="mkt-card-price">{ngn(cls.priceNgn)}</span>
                      <span className="mkt-card-seats">
                        {cls._count.enrolments}/{cls.seatLimit} enrolled
                      </span>
                    </div>
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
