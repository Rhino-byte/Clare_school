"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiSend, type Question, type Test } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import { getDownloadUrl, uploadBlob } from "@/lib/media";

export default function TakeTestPage() {
  const params = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<Record<string, { text_response?: string; audio_key?: string }>>({});
  const [promptUrls, setPromptUrls] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    (async () => {
      const token = await getIdToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const t = await apiGet<Test>(`/tests/${params.testId}`, token);
      setTest(t);
      const urls: Record<string, string> = {};
      for (const q of t.questions) {
        if (q.audio_prompt_key) urls[q.id] = await getDownloadUrl(q.audio_prompt_key);
      }
      setPromptUrls(urls);
    })().catch((e) => setMessage(String(e)));
  }, [params.testId]);

  function setText(q: Question, value: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id], text_response: value } }));
  }

  async function startRecording(questionId: string) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunks.current = [];
    recorder.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.onstop = async () => {
      const blob = new Blob(chunks.current, { type: "audio/webm" });
      try {
        const key = await uploadBlob(blob, `speaking-${questionId}.webm`, "submissions", "audio/webm");
        setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], audio_key: key } }));
        setMessage("Audio uploaded.");
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Audio upload failed");
      }
      stream.getTracks().forEach((t) => t.stop());
      setRecordingId(null);
    };
    mediaRecorder.current = recorder;
    recorder.start();
    setRecordingId(questionId);
  }

  function stopRecording() {
    mediaRecorder.current?.stop();
  }

  async function submit() {
    const token = await getIdToken();
    if (!token || !test) return;
    const payload = {
      answers: test.questions.map((q) => ({
        question_id: q.id,
        text_response: answers[q.id]?.text_response ?? null,
        audio_key: answers[q.id]?.audio_key ?? null,
      })),
    };
    const res = await apiSend<{ message: string; score: number | null; status: string }>(
      `/tests/${test.id}/submit`,
      "POST",
      payload,
      token,
    );
    setMessage(`${res.message} Status: ${res.status}${res.score != null ? ` Score: ${res.score}` : ""}`);
  }

  if (!test) {
    return (
      <section className="section">
        <div className="container-page">{message || "Loading test…"}</div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-page" style={{ maxWidth: 800 }}>
        <Link href="/tests">← Tests</Link>
        <h2 style={{ marginTop: "1rem" }}>{test.title}</h2>
        <p className="lead">{test.instructions}</p>
        <div style={{ display: "grid", gap: "1rem" }}>
          {test.questions.map((q, idx) => (
            <article key={q.id} className="panel">
              <h3 style={{ marginTop: 0, color: "var(--navy)" }}>
                {idx + 1}. {q.prompt}
              </h3>
              {promptUrls[q.id] && <audio controls src={promptUrls[q.id]} style={{ width: "100%", marginBottom: "0.75rem" }} />}
              {(q.question_type === "mcq" || q.question_type === "true_false") && (
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  {(q.options.length ? q.options : q.question_type === "true_false" ? ["True", "False"] : []).map((opt) => (
                    <label key={opt} style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        onChange={() => setText(q, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.question_type === "short_answer" && (
                <textarea
                  value={answers[q.id]?.text_response || ""}
                  onChange={(e) => setText(q, e.target.value)}
                  style={{ width: "100%", minHeight: 90, borderRadius: 12, border: "1px solid rgba(11,31,58,0.18)", padding: "0.75rem" }}
                />
              )}
              {q.question_type === "audio_response" && (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  {recordingId === q.id ? (
                    <button type="button" className="btn btn-primary" onClick={stopRecording}>
                      Stop recording
                    </button>
                  ) : (
                    <button type="button" className="btn btn-navy" onClick={() => startRecording(q.id)}>
                      Record answer
                    </button>
                  )}
                  {answers[q.id]?.audio_key && <span className="level-badge">Audio saved</span>}
                </div>
              )}
            </article>
          ))}
        </div>
        <button type="button" className="btn btn-primary" style={{ marginTop: "1.25rem" }} onClick={submit}>
          Submit test
        </button>
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}
      </div>
    </section>
  );
}
