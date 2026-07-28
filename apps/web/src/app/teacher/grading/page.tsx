"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGet, apiSend } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import { getDownloadUrl } from "@/lib/media";

type QueueItem = {
  submission_id: string;
  test_title: string;
  student_name: string;
  student_email: string;
  answers: Array<{
    id: string;
    text_response: string | null;
    audio_key: string | null;
    needs_review: boolean;
  }>;
};

export default function GradingPage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
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

  async function grade(answerId: string, points: number, feedback: string) {
    const token = await getIdToken();
    if (!token) return;
    await apiSend(`/grading/answers/${answerId}`, "POST", {
      points_awarded: points,
      teacher_feedback: feedback,
      is_correct: points > 0,
    }, token);
    setMessage("Graded.");
    await refresh();
  }

  return (
    <section className="section">
      <div className="container-page">
        <Link href="/dashboard">← Dashboard</Link>
        <h2>Grading queue</h2>
        <p className="lead">Review short-answer and speaking (audio) responses awaiting teacher marks.</p>
        {message && <div className="notice">{message}</div>}
        {queue.length === 0 && <p>No items pending review.</p>}
        <div style={{ display: "grid", gap: "1rem" }}>
          {queue.map((item) => (
            <article key={item.submission_id} className="panel">
              <h3 style={{ marginTop: 0, color: "var(--navy)" }}>{item.test_title}</h3>
              <p style={{ color: "var(--muted)" }}>
                {item.student_name} · {item.student_email}
              </p>
              {item.answers.map((a) => (
                <div key={a.id} style={{ borderTop: "1px solid rgba(11,31,58,0.1)", paddingTop: "0.75rem", marginTop: "0.75rem" }}>
                  {a.text_response && <p>{a.text_response}</p>}
                  {a.audio_key && audioUrls[a.id] && <audio controls src={audioUrls[a.id]} style={{ width: "100%" }} />}
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                    <button type="button" className="btn btn-primary" style={{ padding: "0.4rem 0.8rem" }} onClick={() => grade(a.id, 1, "Good")}>
                      Award 1 pt
                    </button>
                    <button type="button" className="btn btn-navy" style={{ padding: "0.4rem 0.8rem" }} onClick={() => grade(a.id, 0, "Needs practice")}>
                      Award 0
                    </button>
                  </div>
                </div>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
