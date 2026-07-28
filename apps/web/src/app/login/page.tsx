"use client";

import { FormEvent, useState } from "react";
import { firebaseEnabled, loginEmail, setDevSession, type DevRole } from "@/lib/firebase";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <section className="section">
      <div className="container-page" style={{ maxWidth: 520 }}>
        <h2>Log in</h2>
        <p className="lead">Students, teachers, and admins use the same portal — dashboards adapt by role.</p>
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
      </div>
    </section>
  );
}
