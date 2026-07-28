"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, type Course, type Module, type User } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";

type Progress = {
  id: string;
  module_id: string;
  status: string;
  score: number | null;
};

type Result = {
  submission_id: string;
  test_title: string;
  status: string;
  score: number | null;
  max_score: number | null;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getIdToken();
        if (!token) {
          window.location.href = "/login";
          return;
        }
        const me = await apiGet<User>("/me", token);
        setUser(me);
        if (me.role === "student") {
          const [enrolled, mods, prog, res] = await Promise.all([
            apiGet<Course[]>("/me/enrollments", token),
            apiGet<Module[]>("/modules", token),
            apiGet<Progress[]>("/me/progress", token),
            apiGet<Result[]>("/me/results", token),
          ]);
          setCourses(enrolled);
          setModules(mods);
          setProgress(prog);
          setResults(res);
        } else {
          const mods = await apiGet<Module[]>("/modules", token);
          setModules(mods);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      }
    })();
  }, []);

  if (error) {
    return (
      <section className="section">
        <div className="container-page">
          <div className="notice">{error}</div>
          <Link href="/login">Go to login</Link>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section">
        <div className="container-page">Loading dashboard…</div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-page">
        <h2>Welcome, {user.full_name || user.email}</h2>
        <p className="lead">
          Role: <span className="level-badge">{user.role}</span>
        </p>

        {user.role === "student" && (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            <div className="panel">
              <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Your enrolments</h3>
              {courses.length === 0 ? (
                <p>
                  No courses yet. <Link href="/register">Enrol now</Link>
                </p>
              ) : (
                <ul>
                  {courses.map((c) => (
                    <li key={c.id}>
                      {c.title} <span className={`level-badge ${c.language}`}>{c.level}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="panel">
              <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Assigned modules</h3>
              <div style={{ display: "grid", gap: "0.75rem" }}>
                {modules.map((m) => {
                  const p = progress.find((x) => x.module_id === m.id);
                  return (
                    <div key={m.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <div>
                        <strong>{m.title}</strong>
                        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{m.summary}</div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <span className="level-badge">{p?.status || "not_started"}</span>
                        <Link href={`/learn/${m.id}`} className="btn btn-navy" style={{ padding: "0.4rem 0.9rem" }}>
                          Open
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="panel">
              <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Test results</h3>
              {results.length === 0 ? (
                <p style={{ color: "var(--muted)" }}>No submissions yet.</p>
              ) : (
                <ul>
                  {results.map((r) => (
                    <li key={r.submission_id}>
                      {r.test_title}: {r.status}
                      {r.score != null ? ` — ${r.score}/${r.max_score}` : ""}
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/tests">Browse available tests →</Link>
            </div>
          </div>
        )}

        {(user.role === "teacher" || user.role === "admin") && (
          <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <Link href="/teacher/modules" className="panel" style={{ fontWeight: 700, color: "var(--navy)" }}>
              Manage modules
            </Link>
            <Link href="/teacher/tests" className="panel" style={{ fontWeight: 700, color: "var(--navy)" }}>
              Manage tests
            </Link>
            <Link href="/teacher/grading" className="panel" style={{ fontWeight: 700, color: "var(--navy)" }}>
              Grading queue
            </Link>
            <Link href="/teacher/gradebook" className="panel" style={{ fontWeight: 700, color: "var(--navy)" }}>
              Gradebook
            </Link>
            {user.role === "admin" && (
              <Link href="/admin" className="panel" style={{ fontWeight: 700, color: "var(--navy)" }}>
                Admin console
              </Link>
            )}
            <div className="panel">
              <h3 style={{ marginTop: 0 }}>Your content</h3>
              <p style={{ margin: 0, color: "var(--muted)" }}>{modules.length} modules visible</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
