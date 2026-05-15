"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/classes?q=${encodeURIComponent(q)}` : "/classes");
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="container nav-shell">
        <Link className="brand" href="/" aria-label="LearnGrid home">
          <span className="brand-mark" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo-cap.svg" alt="" />
          </span>
          <span className="brand-text">LearnGrid</span>
        </Link>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open ? "true" : "false"}
          aria-controls="primary-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle navigation</span>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          id="primary-nav"
          className={`site-nav${open ? " is-open" : ""}`}
          aria-label="Primary"
          onClick={() => setOpen(false)}
        >
          <form
            className="nav-search"
            role="search"
            onSubmit={handleSearch}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="nav-search-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search classes..."
              aria-label="Search classes"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <Link href="/#how-it-works">How It Works</Link>
          <Link href="/#pricing">Pricing</Link>
          <Link href="/#trust">Why they love Us</Link>
          <Link href="/signin">Sign In</Link>
          <Link className="btn btn-primary btn-nav" href="/signup">
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
