"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, type Course, type Module, type User } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import {
  AppList,
  AppListItem,
  AppPageHeader,
  AppPanel,
  AppShell,
  EmptyState,
  StatusChip,
} from "@/components/app/AppShell";

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
  speaking?: Array<{
    answer_id: string;
    pronunciation_score: number | null;
    assessment_status: string;
    transcript?: string | null;
  }>;
};

function toneForStatus(status: string): "neutral" | "ok" | "warn" | "bad" {
  if (status === "completed" || status === "graded" || status === "passed") return "ok";
  if (status === "assessing" || status === "in_progress" || status === "needs_review") return "warn";
  if (status === "failed" || status === "error") return "bad";
  return "neutral";
}

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
      <AppShell>
        <div className="notice">{error}</div>
        <Link href="/login">Go to login</Link>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <div className="skeleton" style={{ height: 28, maxWidth: 280, marginBottom: "1rem" }} />
        <div className="skeleton" style={{ height: 120 }} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AppPageHeader
        eyebrow="Learning portal"
        title={`Welcome, ${user.full_name || user.email}`}
        lead={`Signed in as ${user.role}`}
      />
      <p style={{ marginTop: "-0.75rem" }}>
        <StatusChip>{user.role}</StatusChip>
      </p>

      {user.role === "student" && (
        <div style={{ display: "grid", gap: "1.5rem" }}>
          <AppPanel>
            <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Your enrolments</h3>
            {courses.length === 0 ? (
              <EmptyState>
                No courses yet. <Link href="/register">Enrol now</Link>
              </EmptyState>
            ) : (
              <ul>
                {courses.map((c) => (
                  <li key={c.id}>
                    {c.title} <span className={`level-badge ${c.language}`}>{c.level}</span>
                  </li>
                ))}
              </ul>
            )}
          </AppPanel>

          <AppPanel>
            <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Assigned modules</h3>
            <AppList>
              {modules.map((m) => {
                const p = progress.find((x) => x.module_id === m.id);
                return (
                  <AppListItem key={m.id}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                      <div>
                        <strong>{m.title}</strong>
                        <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{m.summary}</div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <StatusChip tone={toneForStatus(p?.status || "not_started")}>
                          {p?.status || "not_started"}
                        </StatusChip>
                        <Link href={`/learn/${m.id}`} className="btn btn-navy" style={{ padding: "0.4rem 0.9rem" }}>
                          Open
                        </Link>
                      </div>
                    </div>
                  </AppListItem>
                );
              })}
            </AppList>
            {modules.length === 0 && <EmptyState>No modules assigned yet.</EmptyState>}
          </AppPanel>

          <AppPanel>
            <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Test results</h3>
            {results.length === 0 ? (
              <EmptyState>No submissions yet.</EmptyState>
            ) : (
              <ul>
                {results.map((r) => (
                  <li key={r.submission_id} style={{ marginBottom: "0.75rem" }}>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                      <strong>{r.test_title}</strong>
                      <StatusChip tone={toneForStatus(r.status)}>{r.status}</StatusChip>
                      {r.score != null ? (
                        <span style={{ color: "var(--muted)" }}>
                          {r.score}/{r.max_score}
                        </span>
                      ) : null}
                    </div>
                    {r.speaking && r.speaking.length > 0 && (
                      <ul style={{ marginTop: "0.35rem" }}>
                        {r.speaking.map((s) => (
                          <li key={s.answer_id} style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                            Speaking: <StatusChip tone={toneForStatus(s.assessment_status)}>{s.assessment_status}</StatusChip>
                            {s.pronunciation_score != null ? `: ${s.pronunciation_score}/100` : ""}
                            {s.transcript
                              ? ` (“${s.transcript.slice(0, 80)}${s.transcript.length > 80 ? "…" : ""}”)`
                              : ""}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <Link href="/tests">Browse available tests →</Link>
          </AppPanel>
        </div>
      )}

      {(user.role === "teacher" || user.role === "admin") && (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {[
            { href: "/teacher/modules", label: "Manage modules" },
            { href: "/teacher/tests", label: "Manage tests" },
            { href: "/teacher/grading", label: "Grading queue" },
            { href: "/teacher/gradebook", label: "Gradebook" },
            ...(user.role === "admin" ? [{ href: "/admin", label: "Admin console" }] : []),
          ].map((item) => (
            <AppPanel key={item.href}>
              <Link href={item.href} style={{ fontWeight: 700, color: "var(--navy)", display: "block" }}>
                {item.label}
              </Link>
            </AppPanel>
          ))}
          <AppPanel>
            <h3 style={{ marginTop: 0 }}>Your content</h3>
            <p style={{ margin: 0, color: "var(--muted)" }}>{modules.length} modules visible</p>
          </AppPanel>
        </div>
      )}
    </AppShell>
  );
}
