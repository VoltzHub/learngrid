import Link from "next/link";
import { ArrowRight, BadgeCheck, Banknote, BookOpen, Lock, Presentation, Search } from "lucide-react";
import { getLandingStats } from "@/lib/actions/stats";

export const revalidate = 60;

export default async function HomePage() {
  const stats = await getLandingStats();
  return (
    <>
      {/* HERO */}
      <section className="hero-section" id="top">
        <div className="hero-backdrop" aria-hidden="true"></div>
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow-row" aria-label="Platform highlights">
              <span className="eyebrow-chip">
                <span className="chip-icon green-icon">
                  <BadgeCheck size={14} strokeWidth={2.2} />
                </span>
                Verified Teachers
              </span>
              <span className="eyebrow-chip">
                <span className="chip-icon blue-icon">
                  <Lock size={14} strokeWidth={2.2} />
                </span>
                Secure Payments
              </span>
              <span className="eyebrow-chip">
                <span className="chip-icon green-icon">
                  <Banknote size={14} strokeWidth={2.2} />
                </span>
                Earn in Naira
              </span>
            </div>

            <h1>
              Teach Live. Learn Live. <span className="accent">Earn in Naira.</span>
            </h1>
            <p className="hero-subtext">
              A trusted platform where verified Nigerian teachers host live classes and
              students learn in real time. Join thousands transforming education across
              Nigeria.
            </p>

            <div className="hero-actions">
              <Link className="btn btn-primary btn-icon-lead" href="/signup?role=teacher">
                <Presentation size={18} strokeWidth={2.2} />
                Start Teaching Live
              </Link>
              <Link className="btn btn-secondary btn-icon-lead" href="/signup?role=student">
                <Search size={18} strokeWidth={2.2} />
                Find a Live Class
              </Link>
            </div>

            <div className="hero-stats" aria-label="LearnGrid impact">
              <div className="stat">
                <strong>{stats.students.toLocaleString()}+</strong>
                <span>Active Students</span>
              </div>
              <div className="stat">
                <strong>{stats.verifiedTeachers.toLocaleString()}+</strong>
                <span>Verified Teachers</span>
              </div>
              <div className="stat">
                <strong>{stats.classesCompleted.toLocaleString()}+</strong>
                <span>Classes Completed</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-gradient-block">
              <div className="hero-glass-box">
                <span className="hero-glass-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
                  </svg>
                </span>
                <h3>Live Classes</h3>
                <p>Interactive learning in real-time</p>
              </div>

              <div className="hero-profile top">
                <div className="profile-main">
                  <div className="profile-avatar"></div>
                  <div className="profile-info">
                    <p className="profile-title">Mrs Adaeze</p>
                    <p className="profile-subtitle">Mathematics</p>
                  </div>
                </div>
                <div className="profile-footer">
                  <div className="stars">★★★★★</div>
                  <span className="price accent-green">₦1,500 / class</span>
                </div>
              </div>

              <div className="hero-profile bottom">
                <div className="profile-main">
                  <div className="profile-avatar alt"></div>
                  <div className="profile-info">
                    <p className="profile-title">Mrs. Adebayo</p>
                    <p className="profile-subtitle">Mathematics Teacher</p>
                  </div>
                </div>
                <p className="live-status">Live Now</p>
                <div className="profile-footer">
                  <div className="stars">
                    <span className="red-dot"></span>★★★★★
                  </div>
                  <span className="price accent-green">₦1,500 / class</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR PATH */}
      <section className="section" id="features">
        <div className="container section-head centered">
          <span className="section-tag">Choose Your Path</span>
          <h2>Whether you want to teach or learn, we&apos;ve got you covered</h2>
        </div>

        <div className="container path-grid">
          <article className="path-card">
            <div className="path-icon blue">
              <Presentation strokeWidth={1.8} aria-hidden="true" />
            </div>
            <span className="card-kicker">For Teachers</span>
            <p>
              Share your knowledge, teach live classes, and earn money. Get verified,
              build your reputation, and grow your student base.
            </p>
            <ul className="feature-list">
              <li>Create unlimited live classes</li>
              <li>Earn in Naira instantly</li>
              <li>Build your teaching profile</li>
              <li>Get verified badge &amp; trust</li>
            </ul>
            <div className="path-footer">
              <Link className="btn btn-primary btn-icon-lead" href="/signup?role=teacher">
                <Presentation size={16} strokeWidth={2.2} />
                Start Teaching
              </Link>
            </div>
          </article>

          <article className="path-card">
            <div className="path-icon green">
              <BookOpen strokeWidth={1.8} aria-hidden="true" />
            </div>
            <span className="card-kicker green-text">For Students</span>
            <p>
              Learn from verified Nigerian teachers in live interactive classes. Pay per
              class in Naira and learn at your own pace.
            </p>
            <ul className="feature-list green-dots">
              <li>Browse live classes anytime</li>
              <li>Pay per class in Naira</li>
              <li>Learn from verified teachers</li>
              <li>Interactive real-time learning</li>
            </ul>
            <div className="path-footer">
              <Link className="btn btn-success btn-icon-lead" href="/signup?role=student">
                <Search size={16} strokeWidth={2.2} />
                Find a Live Class
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section section-soft" id="how-it-works">
        <div className="container section-head centered narrow">
          <span className="section-tag">How it works</span>
          <h2>Simple steps to start your journey on LearnGrid.</h2>
        </div>

        <div className="container steps-grid">
          <article className="step-card">
            <div className="step-icon-box">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M22 21v-2a4 4 0 0 0-3-3.87"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M16 3.13a4 4 0 0 1 0 7.75"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3>Sign Up</h3>
            <p>
              Create your account in seconds. Verify your identity to ensure a safe
              learning space.
            </p>
          </article>

          <div className="step-connector" aria-hidden="true">
            <div className="connector-line"></div>
          </div>

          <article className="step-card">
            <div className="step-icon-box">
              <svg viewBox="0 0 24 24" fill="none">
                <rect
                  x="2"
                  y="3"
                  width="20"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8 21h8M12 17v4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3>Create / Browse</h3>
            <p>
              Teachers set up their live classes, while students browse the marketplace
              for their next course.
            </p>
          </article>

          <div className="step-connector" aria-hidden="true">
            <div className="connector-line"></div>
          </div>

          <article className="step-card">
            <div className="step-icon-box">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Teach / Learn</h3>
            <p>
              Join the live session at the scheduled time. Teach with passion, or learn
              with curiosity.
            </p>
          </article>
        </div>
      </section>

      {/* PRICING */}
      <section className="section section-soft" id="pricing">
        <div className="container">
          <div className="pricing-card">
            <div className="pricing-card-left">
              <h2>Transparent Pricing for Everyone</h2>
              <p>
                No hidden fees. Students pay per class, and teachers keep up to 85% of
                their earnings. All transactions are securely processed in Naira.
              </p>
              <div className="pricing-stats-wrap">
                <div className="pricing-stat-item">
                  <strong className="text-blue">0%</strong>
                  <span className="text-blue-muted">SIGN UP FEE</span>
                </div>
                <div className="pricing-stat-item">
                  <strong className="text-blue">100%</strong>
                  <span className="text-blue-muted">LIVE INTERACTION</span>
                </div>
              </div>
            </div>
            <div className="pricing-card-right">
              <Link className="btn btn-primary btn-block" href="/classes">
                Browse Classes from ₦500
              </Link>
              <Link href="/signup?role=teacher" className="pricing-link arrow-link">
                Or start teaching
                <ArrowRight className="arrow-fwd" size={14} strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY TEACHERS LOVE US */}
      <section className="section section-soft" id="trust">
        <div className="container">
          <div className="feature-card">
            <div className="feature-card-left">
              <h2>Why Teachers Love Us</h2>
              <div className="t-love-grid">
                <article className="t-love-item">
                  <div className="t-love-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                  </div>
                  <div>
                    <h4>National Reach</h4>
                    <p>Connect with students from Lagos to Abuja.</p>
                  </div>
                </article>
                <article className="t-love-item">
                  <div className="t-love-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Secure Payments</h4>
                    <p>Automatic payouts directly to your local bank.</p>
                  </div>
                </article>
                <article className="t-love-item">
                  <div className="t-love-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Performance Tracking</h4>
                    <p>Detailed insights into student engagement.</p>
                  </div>
                </article>
                <article className="t-love-item">
                  <div className="t-love-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h4v1h-7v2h6c1.66 0 3-1.34 3-3V10c0-4.97-4.03-9-9-9z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Dedicated Support</h4>
                    <p>24/7 technical assistance for your classes.</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="feature-card-right">
              <article className="love-card-featured">
                <div className="love-card-icon-lg border-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                </div>
                <h3>Top Rated Platform</h3>
                <p>Rated 4.9/5 by over 1,000+ Nigerian teachers</p>
                <Link href="/classes" className="featured-link arrow-link">
                  Browse top-rated classes
                  <ArrowRight className="arrow-fwd" size={14} strokeWidth={2.2} />
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* WHY STUDENTS LOVE US */}
      <section className="section section-soft pt-0">
        <div className="container students-love-layout">
          <div className="students-love-copy">
            <h2>Why Students Love Us</h2>
            <ul className="students-love-list">
              <li>
                <div className="students-love-icon-bg">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 2v11h3v9l7-12h-4l4-8z" />
                  </svg>
                </div>
                <div>
                  <h4>Real-time Interaction</h4>
                  <p>
                    Don&apos;t just watch videos. Ask questions and get answers
                    instantly from certified experts.
                  </p>
                </div>
              </li>
              <li>
                <div className="students-love-icon-bg">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 7H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zm0 10H3V9h18v8zm-2-5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
                  </svg>
                </div>
                <div>
                  <h4>Zero Commitment</h4>
                  <p>
                    Stop wasting money on monthly subscriptions you don&apos;t use. Pay
                    only for what you learn.
                  </p>
                </div>
              </li>
              <li>
                <div className="students-love-icon-bg">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                </div>
                <div>
                  <h4>Verified Tutors</h4>
                  <p>
                    We vet every tutor to ensure they provide the best learning
                    experience for Nigerian students.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="students-love-images">
            <div className="students-img students-img-1 styled-img"></div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container cta-block">
          <h2>Ready to start learning?</h2>
          <div className="cta-actions">
            <Link className="btn btn-primary btn-icon-lead" href="/classes">
              <Search size={16} strokeWidth={2.2} />
              Browse Available Classes
            </Link>
            <Link className="btn btn-secondary btn-icon-lead" href="/signup?role=teacher">
              <Presentation size={16} strokeWidth={2.2} />
              Become a Tutor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
