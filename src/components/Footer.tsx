import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-cap.svg" alt="" />
            </span>
            <span className="brand-text">LearnGrid</span>
          </Link>
          <p className="footer-copy">
            Nigeria&apos;s premier live learning marketplace connecting expert teachers with
            students nationwide.
          </p>
        </div>
        <div>
          <h3>Platform</h3>
          <ul>
            <li>
              <Link href="/classes">Browse Classes</Link>
            </li>
            <li>
              <Link href="/signup?role=teacher">Become a Teacher</Link>
            </li>
            <li>
              <Link href="/#pricing">Class Pricing</Link>
            </li>
            <li>
              <Link href="/#trust">Why Teachers Love Us</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3>Support</h3>
          <ul>
            <li>
              <Link href="/help">Help Center</Link>
            </li>
            <li>
              <Link href="/trust">Safety &amp; Trust</Link>
            </li>
            <li>
              <Link href="/payments-faq">Payments FAQ</Link>
            </li>
            <li>
              <a href="mailto:team@learngrid.ng">Contact Us</a>
            </li>
          </ul>
        </div>
        <div>
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="M8 11v5M8 8v.01M12 16v-5c0-1 .5-2 2-2s2 1 2 2v5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-base">
        <p>© {year} LearnGrid Nigeria. All rights reserved.</p>
        <div className="footer-inline-links">
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/cookies">Cookie Policy</Link>
        </div>
      </div>
    </footer>
  );
}
