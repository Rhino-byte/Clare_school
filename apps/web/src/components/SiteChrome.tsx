"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const DEV_TOKEN_KEY = "clare_dev_token";

const links = [
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/levels", label: "Levels" },
  { href: "/schedule-pricing", label: "Schedule" },
  { href: "/testimonials", label: "Stories" },
  { href: "/contact", label: "Contact" },
];

function hasSession(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(localStorage.getItem(DEV_TOKEN_KEY) || localStorage.getItem("clare_firebase_session"));
}

export function SiteHeader() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(hasSession());
  }, [pathname]);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(10px)",
        background: "rgba(7, 21, 40, 0.88)",
        borderBottom: "1px solid rgba(201,162,39,0.25)",
      }}
    >
      <div
        className="container-page"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0.9rem 0",
          flexWrap: "wrap",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "white" }}>
          <span
            aria-hidden
            style={{
              width: 42,
              height: 48,
              display: "grid",
              placeItems: "center",
              background: "linear-gradient(160deg, #0b1f3a, #14325c)",
              border: "2px solid #c9a227",
              clipPath: "polygon(50% 0%, 100% 18%, 100% 70%, 50% 100%, 0 70%, 0 18%)",
              color: "#c9a227",
              fontWeight: 800,
              fontSize: 12,
            }}
          >
            SC
          </span>
          <span>
            <strong style={{ display: "block", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.15rem" }}>
              St. Clare
            </strong>
            <span style={{ fontSize: "0.75rem", opacity: 0.8 }}> </span>
          </span>
        </Link>
        <nav style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                color: pathname === l.href ? "#e6c65c" : "rgba(255,255,255,0.86)",
                fontWeight: 600,
                fontSize: "0.92rem",
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/register" className="btn btn-primary" style={{ padding: "0.55rem 1rem" }}>
            Enrol
          </Link>
          {authed ? (
            <>
              <Link href="/dashboard" style={{ color: "#e6c65c", fontWeight: 700 }}>
                Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: "0.45rem 0.9rem" }}
                onClick={async () => {
                  const { logout } = await import("@/lib/firebase");
                  await logout();
                  window.location.href = "/";
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <Link href="/login" style={{ color: "white", fontWeight: 700 }}>
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer style={{ background: "var(--navy-deep)", color: "rgba(255,255,255,0.8)", marginTop: "4rem" }}>
      <div className="container-page" style={{ padding: "2.5rem 0", display: "grid", gap: "1rem" }}>
        <strong style={{ color: "#e6c65c", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.3rem" }}>
          St. Clare Language Institute
        </strong>
        <p style={{ margin: 0, maxWidth: "36rem" }}>
          A branch of St. Francis Technical Institute — Nairobi, Kenya. Building Skills. Shaping Futures.
        </p>
        <p style={{ margin: 0, fontSize: "0.95rem" }}>
          <a href="tel:+254722595645" style={{ color: "rgba(255,255,255,0.9)" }}>
            +254 722 595 645
          </a>
          {" · "}
          <a href="tel:+254786566994" style={{ color: "rgba(255,255,255,0.9)" }}>
            +254 786 566 994
          </a>
          <br />
          <a href="mailto:st.clarehostels@gmail.com" style={{ color: "#e6c65c" }}>
            st.clarehostels@gmail.com
          </a>
        </p>
        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.7 }}>
          All language programmes require compulsory in-person attendance. Course content may include machine-translated
          material refined by instructors before publishing.
        </p>
      </div>
    </footer>
  );
}
