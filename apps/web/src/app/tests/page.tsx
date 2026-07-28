"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, type Test } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";

export default function TestsIndexPage() {
  const [tests, setTests] = useState<Test[]>([]);

  useEffect(() => {
    (async () => {
      const token = await getIdToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }
      setTests(await apiGet<Test[]>("/tests", token));
    })();
  }, []);

  return (
    <section className="section">
      <div className="container-page">
        <Link href="/dashboard">← Dashboard</Link>
        <h2>Available tests</h2>
        <p className="lead">Complete quizzes and speaking tasks for your enrolled courses.</p>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {tests.map((t) => (
            <div key={t.id} className="panel" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <strong>{t.title}</strong>
                <div style={{ color: "var(--muted)" }}>{t.questions.length} questions</div>
              </div>
              <Link href={`/tests/${t.id}`} className="btn btn-primary" style={{ padding: "0.45rem 0.9rem" }}>
                Start
              </Link>
            </div>
          ))}
          {tests.length === 0 && <p>No published tests for your enrolments yet.</p>}
        </div>
      </div>
    </section>
  );
}
