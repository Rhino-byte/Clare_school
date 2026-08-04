"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { firebaseEnabled, loginEmail, setDevSession, type DevRole } from "@/lib/firebase";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      await loginEmail(String(fd.get("email")), String(fd.get("password")));
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function demoLogin(role: DevRole) {
    setDevSession(role);
    window.location.href = "/dashboard";
  }

  return (
    <div className="auth-split">
      <motion.div
        className="auth-split-visual"
        initial={reduce ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/images/auth-panel.jpg"
          alt="Quiet St. Clare classroom aisle"
          fill
          priority
          sizes="(max-width: 860px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, rgba(7,21,40,0.55), rgba(11,31,58,0.35))",
          }}
        />
        <div style={{ position: "absolute", left: "1.5rem", bottom: "1.5rem", color: "white", zIndex: 1 }}>
          <strong style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem" }}>St. Clare</strong>
          <p style={{ margin: "0.35rem 0 0", opacity: 0.9, maxWidth: "16rem" }}>Language Institute · Nairobi</p>
        </div>
      </motion.div>

      <motion.div
        className="auth-split-form"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <div style={{ maxWidth: 420, width: "100%", margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Log in</h2>
          <p className="lead">Students, teachers, and admins use the same portal. Dashboards adapt by role.</p>
          {firebaseEnabled ? (
            <form className="panel" onSubmit={onSubmit}>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required />
              </div>
              <button className="btn btn-primary" disabled={loading} type="submit">
                {loading ? "Signing in…" : "Sign in"}
              </button>
              {error && <p style={{ color: "var(--red)" }}>{error}</p>}
            </form>
          ) : (
            <div className="panel" style={{ display: "grid", gap: "0.75rem" }}>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                Firebase Auth is not configured. Use demo roles (API auth bypass) for local development.
              </p>
              <button type="button" className="btn btn-navy" onClick={() => demoLogin("student")}>
                Continue as student
              </button>
              <button type="button" className="btn btn-navy" onClick={() => demoLogin("teacher")}>
                Continue as teacher
              </button>
              <button type="button" className="btn btn-navy" onClick={() => demoLogin("admin")}>
                Continue as admin
              </button>
            </div>
          )}
          <p style={{ marginTop: "1.25rem", color: "var(--muted)" }}>
            New here? <Link href="/register">Create an account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
