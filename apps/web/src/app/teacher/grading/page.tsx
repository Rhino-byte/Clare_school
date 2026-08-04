"use client";

import { useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import { getDownloadUrl } from "@/lib/media";
import { AppPageHeader, AppPanel, AppShell, EmptyState, StatusChip } from "@/components/app/AppShell";

type QueueItem = {
  submission_id: string;
  test_title: string;
  student_name: string;
  student_email: string;
  answers: Array<{
    id: string;
    prompt?: string;
    expected_text?: string;
    text_response: string | null;
    audio_key: string | null;
    needs_review: boolean;
    transcript?: string | null;
    pronunciation_score?: number | null;
    score_breakdown?: Record<string, unknown>;
    assessment_status?: string;
    assessment_error?: string | null;
    question_points?: number;
    points_awarded?: number | null;
  }>;
};

export default function GradingPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [overrides, setOverrides] = useState<Record<string, { score: string; feedback: string }>>({});
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    const token = await getIdToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const data = await apiGet<QueueItem[]>("/grading/queue", token);
    setQueue(data);
    const urls: Record<string, string> = {};
    for (const item of data) {
      for (const a of item.answers) {
        if (a.audio_key) {
          urls[a.id] = await getDownloadUrl(a.audio_key);
        }
      }
    }
    setAudioUrls(urls);
  }

  useEffect(() => {
    refresh().catch((e) => setMessage(String(e)));
  }, []);

  async function grade(answerId: string, points: number, feedback: string, pronunciationScore?: number) {
    const token = await getIdToken();
    if (!token) return;
    try {
      await apiSend(
        `/grading/answers/${answerId}`,
        "POST",
        {
          points_awarded: points,
          teacher_feedback: feedback,
          is_correct: points > 0,
          pronunciation_score: pronunciationScore ?? null,
        },
        token,
      );
      setMessage("Graded.");
      await refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Grade failed");
    }
  }

  return (
    <AppShell>
      <AppPageHeader
        backHref="/dashboard"
        title="Grading queue"
        lead="Review short-answer and speaking responses. Whisper transcripts and pronunciation scores appear side-by-side for audio items. Override when needed."
      />
      {message && <div className="notice">{message}</div>}
      {queue.length === 0 && <EmptyState>No items pending review.</EmptyState>}
      <div style={{ display: "grid", gap: "1rem" }}>
        {queue.map((item) => (
          <AppPanel key={item.submission_id}>
              <h3 style={{ marginTop: 0, color: "var(--navy)" }}>{item.test_title}</h3>
              <p style={{ color: "var(--muted)" }}>
                {item.student_name} · {item.student_email}
              </p>
              {item.answers.map((a) => {
                const ov = overrides[a.id] || {
                  score: String(a.pronunciation_score ?? ""),
                  feedback: "",
                };
                return (
                  <div
                    key={a.id}
                    style={{ borderTop: "1px solid rgba(11,31,58,0.1)", paddingTop: "0.75rem", marginTop: "0.75rem" }}
                  >
                    {a.prompt && (
                      <p style={{ fontWeight: 600, marginBottom: "0.35rem" }}>{a.prompt}</p>
                    )}
                    {a.text_response && <p>{a.text_response}</p>}
                    {a.audio_key && audioUrls[a.id] && (
                      <audio controls src={audioUrls[a.id]} style={{ width: "100%", marginBottom: "0.75rem" }} />
                    )}
                    {a.audio_key && (
                      <div
                        style={{
                          display: "grid",
                          gap: "0.5rem",
                          gridTemplateColumns: "1fr 1fr",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <div className="panel" style={{ margin: 0, background: "rgba(11,31,58,0.04)" }}>
                          <strong>Expected</strong>
                          <p style={{ margin: "0.35rem 0 0" }}>{a.expected_text || "—"}</p>
                        </div>
                        <div className="panel" style={{ margin: 0, background: "rgba(11,31,58,0.04)" }}>
                          <strong style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                            Whisper transcript
                            {a.assessment_status ? (
                              <StatusChip
                                tone={
                                  a.assessment_status === "completed" || a.assessment_status === "passed"
                                    ? "ok"
                                    : a.assessment_status === "error" || a.assessment_status === "failed"
                                      ? "bad"
                                      : "warn"
                                }
                              >
                                {a.assessment_status}
                              </StatusChip>
                            ) : null}
                          </strong>
                          <p style={{ margin: "0.35rem 0 0" }}>
                            {a.assessment_status === "processing" || a.assessment_status === "pending"
                              ? "Assessing…"
                              : a.transcript || a.assessment_error || "—"}
                          </p>
                        </div>
                      </div>
                    )}
                    {a.pronunciation_score != null && (
                      <p>
                        Auto score: <StatusChip tone="ok">{a.pronunciation_score}/100</StatusChip>
                        {a.score_breakdown?.wer != null && (
                          <span style={{ color: "var(--muted)", marginLeft: "0.5rem" }}>
                            WER {String(a.score_breakdown.wer)}
                          </span>
                        )}
                      </p>
                    )}
                    {a.audio_key ? (
                      <div style={{ display: "grid", gap: "0.5rem" }}>
                        <div className="field" style={{ margin: 0 }}>
                          <label>Override pronunciation score (0–100)</label>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={ov.score}
                            onChange={(e) =>
                              setOverrides((prev) => ({
                                ...prev,
                                [a.id]: { ...ov, score: e.target.value },
                              }))
                            }
                          />
                        </div>
                        <div className="field" style={{ margin: 0 }}>
                          <label>Feedback</label>
                          <input
                            value={ov.feedback}
                            onChange={(e) =>
                              setOverrides((prev) => ({
                                ...prev,
                                [a.id]: { ...ov, feedback: e.target.value },
                              }))
                            }
                            placeholder="Optional note for the student"
                          />
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            style={{ padding: "0.4rem 0.8rem" }}
                            onClick={() => {
                              const score = Number(ov.score);
                              const qPoints = a.question_points ?? 1;
                              const points =
                                Number.isFinite(score) ? (qPoints * Math.max(0, Math.min(100, score))) / 100 : qPoints;
                              grade(a.id, points, ov.feedback || "Reviewed", Number.isFinite(score) ? score : undefined);
                            }}
                          >
                            Save override
                          </button>
                          <button
                            type="button"
                            className="btn btn-navy"
                            style={{ padding: "0.4rem 0.8rem" }}
                            onClick={() =>
                              grade(
                                a.id,
                                a.points_awarded ?? ((a.question_points ?? 1) * (a.pronunciation_score ?? 0)) / 100,
                                "Accepted auto score",
                                a.pronunciation_score ?? undefined,
                              )
                            }
                          >
                            Accept auto score
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: "0.4rem 0.8rem" }}
                          onClick={() => grade(a.id, 1, "Good")}
                        >
                          Award 1 pt
                        </button>
                        <button
                          type="button"
                          className="btn btn-navy"
                          style={{ padding: "0.4rem 0.8rem" }}
                          onClick={() => grade(a.id, 0, "Needs practice")}
                        >
                          Award 0
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
          </AppPanel>
        ))}
      </div>
    </AppShell>
  );
}
