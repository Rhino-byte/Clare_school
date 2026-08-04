"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useId, useState } from "react";

const DEV_TOKEN_KEY = "clare_dev_token";

const links = [
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

function CrestMark() {
  return (
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
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const drawerId = useId();
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(7, 21, 40, 0.72)", "rgba(7, 21, 40, 0.96)"]);
  const shadow = useTransform(
    scrollY,
    [0, 80],
    ["0 0 0 rgba(0,0,0,0)", "0 10px 28px rgba(7, 21, 40, 0.35)"],
  );

  useEffect(() => {
    setAuthed(hasSession());
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const authLinks = authed ? (
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
  );

  return (
    <motion.header
      className="site-header"
      style={{
        backdropFilter: "blur(12px)",
        background: reduce ? "rgba(7, 21, 40, 0.92)" : bg,
        boxShadow: reduce ? "none" : shadow,
      }}
    >
      <div className="container-page site-header-inner">
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "white" }}>
          <CrestMark />
          <span>
            <strong style={{ display: "block", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.15rem" }}>
              St. Clare
            </strong>
            <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>Language Institute · Nairobi</span>
          </span>
        </Link>

        <nav className="site-nav-desktop" aria-label="Primary">
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
          {authLinks}
        </nav>

        <button
          type="button"
          className="site-nav-toggle"
          aria-expanded={open}
          aria-controls={drawerId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id={drawerId}
            className="container-page site-nav-drawer"
            aria-label="Mobile"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            style={{ overflow: "hidden" }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: pathname === l.href ? "#e6c65c" : "rgba(255,255,255,0.9)" }}
              >
                {l.label}
              </Link>
            ))}
            <Link href="/register" className="btn btn-primary" style={{ width: "fit-content" }}>
              Enrol
            </Link>
            {authLinks}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export function SiteFooter() {
  const reduce = useReducedMotion();

  return (
    <motion.footer
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45 }}
      style={{ background: "var(--navy-deep)", color: "rgba(255,255,255,0.8)", marginTop: "4rem" }}
    >
      <div className="container-page" style={{ padding: "2.5rem 0", display: "grid", gap: "1rem" }}>
        <strong style={{ color: "#e6c65c", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.3rem" }}>
          St. Clare Language Institute
        </strong>
        <p style={{ margin: 0, maxWidth: "36rem" }}>
          A branch of St. Francis Technical Institute, Nairobi, Kenya. Building Skills. Shaping Futures.
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
        <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", fontSize: "0.9rem" }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} style={{ color: "rgba(255,255,255,0.75)" }}>
              {l.label}
            </Link>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: "0.85rem", opacity: 0.7 }}>
          All language programmes require compulsory in-person attendance. Course content may include machine-translated
          material refined by instructors before publishing.
        </p>
      </div>
    </motion.footer>
  );
}
