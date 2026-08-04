"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import { AppPageHeader, AppPanel, AppShell, EmptyState, StatusChip } from "@/components/app/AppShell";

type Row = {
  submission_id: string;
  student_name: string;
  student_email: string;
  test_title: string;
  status: string;
  score: number | null;
  max_score: number | null;
};

function toneFor(status: string): "neutral" | "ok" | "warn" | "bad" {
  if (status === "graded" || status === "completed" || status === "passed") return "ok";
  if (status === "assessing" || status === "pending" || status === "needs_review") return "warn";
  if (status === "failed" || status === "error") return "bad";
  return "neutral";
}

export default function GradebookPage() {
  const [rows, setRows] = useState<Row[] | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getIdToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }
      setRows(await apiGet<Row[]>("/gradebook", token));
    })();
  }, []);

  return (
    <AppShell>
      <AppPageHeader
        backHref="/dashboard"
        title="Gradebook"
        lead="Results per student submission across published assessments."
      />
      {rows === null ? (
        <div className="skeleton" style={{ height: 160 }} />
      ) : rows.length === 0 ? (
        <EmptyState>No submissions yet.</EmptyState>
      ) : (
        <AppPanel style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(11,31,58,0.15)" }}>
                <th style={{ padding: "0.5rem" }}>Student</th>
                <th style={{ padding: "0.5rem" }}>Test</th>
                <th style={{ padding: "0.5rem" }}>Status</th>
                <th style={{ padding: "0.5rem" }}>Score</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.submission_id} style={{ borderBottom: "1px solid rgba(11,31,58,0.08)" }}>
                  <td style={{ padding: "0.5rem" }}>
                    {r.student_name}
                    <div style={{ fontSize: "0.85rem", color: "var(--muted)" }}>{r.student_email}</div>
                  </td>
                  <td style={{ padding: "0.5rem" }}>{r.test_title}</td>
                  <td style={{ padding: "0.5rem" }}>
                    <StatusChip tone={toneFor(r.status)}>{r.status}</StatusChip>
                  </td>
                  <td style={{ padding: "0.5rem" }}>
                    {r.score != null ? `${r.score}/${r.max_score}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AppPanel>
      )}
    </AppShell>
  );
}
