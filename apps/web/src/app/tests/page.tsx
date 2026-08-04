"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, type Test } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import {
  AppList,
  AppListItem,
  AppPageHeader,
  AppShell,
  EmptyState,
} from "@/components/app/AppShell";

export default function TestsIndexPage() {
  const [tests, setTests] = useState<Test[] | null>(null);

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
    <AppShell>
      <AppPageHeader
        backHref="/dashboard"
        title="Available tests"
        lead="Complete quizzes and speaking tasks for your enrolled courses."
      />
      {tests === null ? (
        <div className="skeleton" style={{ height: 96 }} />
      ) : (
        <AppList>
          {tests.map((t) => (
            <AppListItem key={t.id}>
              <div className="panel" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <strong>{t.title}</strong>
                  <div style={{ color: "var(--muted)" }}>{t.questions.length} questions</div>
                </div>
                <Link href={`/tests/${t.id}`} className="btn btn-primary" style={{ padding: "0.45rem 0.9rem" }}>
                  Start
                </Link>
              </div>
            </AppListItem>
          ))}
          {tests.length === 0 && <EmptyState>No published tests for your enrolments yet.</EmptyState>}
        </AppList>
      )}
    </AppShell>
  );
}
