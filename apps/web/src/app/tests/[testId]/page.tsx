"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiSend, type Assessment, type Question, type Test } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import { getDownloadUrl, uploadBlob } from "@/lib/media";
import { AppPageHeader, AppShell, StatusChip } from "@/components/app/AppShell";

export default function TakeTestPage() {
  const params = useParams<{ testId: string }>();
  const [test, setTest] = useState<Test | null>(null);
  const [answers, setAnswers] = useState<Record<string, { text_response?: string; audio_key?: string }>>({});
  const [promptUrls, setPromptUrls] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  useEffect(() => {
    if (!submissionId) return;
    let cancelled = false;
    const poll = async () => {
      const token = await getIdToken();
      if (!token || cancelled) return;
      try {
        const data = await apiGet<Assessment[]>(`/submissions/${submissionId}/assessments`, token);
        if (!cancelled) setAssessments(data);
        const speaking = data.filter((a) => a.transcript !== undefined || a.assessment_status);
        const pending = speaking.filter(
          (a) => a.assessment_status === "pending" || a.assessment_status === "processing",
        );
        if (
          pending.length === 0 &&
          speaking.some(
            (a) =>
              a.assessment_status === "scored" ||
              a.assessment_status === "failed" ||
              a.assessment_status === "overridden",
          )
        ) {
          return;
        }
      } catch {
        // keep polling
      }
      if (!cancelled) setTimeout(poll, 1500);
    };
    poll();
    return () => {
      cancelled = true;
    };
  }, [submissionId]);

  function setText(q: Question, value: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: { ...prev[q.id], text_response: value } }));
  }

  async function startRecording(questionId: string) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunks.current = [];
      setRecordSeconds(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setRecordSeconds((s) => s + 1), 1000);
      recorder.ondataavailable = (e) => chunks.current.push(e.data);
      recorder.onstop = async () => {
        if (timerRef.current) clearInterval(timerRef.current);
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        try {
          const key = await uploadBlob(blob, `speaking-${questionId}.webm`, "submissions", "audio/webm");
          setAnswers((prev) => ({ ...prev, [questionId]: { ...prev[questionId], audio_key: key } }));
          setMessage("Audio uploaded. You can re-record before submitting.");
        } catch (err) {
          setMessage(err instanceof Error ? err.message : "Audio upload failed");
        }
        stream.getTracks().forEach((t) => t.stop());
        setRecordingId(null);
      };
      mediaRecorder.current = recorder;
      recorder.start();
      setRecordingId(questionId);
    } catch {
      setMessage("Microphone access denied. Allow mic permission and try again in a quiet room.");
    }
  }

  function stopRecording() {
    mediaRecorder.current?.stop();
  }

  async function submit() {
    const token = await getIdToken();
    if (!token || !test) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const payload = {
        answers: test.questions.map((q) => ({
          question_id: q.id,
          text_response: answers[q.id]?.text_response ?? null,
          audio_key: answers[q.id]?.audio_key ?? null,
        })),
      };
      const res = await apiSend<{
        message: string;
        score: number | null;
        status: string;
        submission_id: string;
        speech_answer_ids?: string[];
      }>(`/tests/${test.id}/submit`, "POST", payload, token);
      setSubmissionId(res.submission_id);
      setMessage(
        res.speech_answer_ids?.length
          ? `${res.message} Assessing pronunciation…`
          : `${res.message} Status: ${res.status}${res.score != null ? ` Score: ${res.score}` : ""}`,
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!test) {
    return (
      <AppShell>
        <div className="skeleton" style={{ height: 28, maxWidth: 240, marginBottom: "1rem" }} />
        <div className="skeleton" style={{ height: 180 }} />
        {message && <p>{message}</p>}
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 800 }}>
        <AppPageHeader backHref="/tests" backLabel="← Tests" title={test.title} lead={test.instructions} />
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
                      <input type="radio" name={q.id} value={opt} onChange={() => setText(q, opt)} />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.question_type === "short_answer" && (
                <textarea
                  value={answers[q.id]?.text_response || ""}
                  onChange={(e) => setText(q, e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 90,
                    borderRadius: 12,
                    border: "1px solid rgba(11,31,58,0.18)",
                    padding: "0.75rem",
                  }}
                />
              )}
              {q.question_type === "audio_response" && (
                <div style={{ display: "grid", gap: "0.5rem" }}>
                  <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
                    Tip: find a quiet room, speak clearly, and hold the mic steady. Max attempts: {q.max_attempts ?? 3}.
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                    {recordingId === q.id ? (
                      <button type="button" className="btn btn-primary" onClick={stopRecording}>
                        Stop recording ({recordSeconds}s)
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-navy"
                        onClick={() => startRecording(q.id)}
                        disabled={!!submissionId}
                      >
                        {answers[q.id]?.audio_key ? "Re-record answer" : "Record answer"}
                      </button>
                    )}
                    {answers[q.id]?.audio_key && <StatusChip tone="ok">Audio saved</StatusChip>}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
        {!submissionId && (
          <button type="button" className="btn btn-primary" style={{ marginTop: "1.25rem" }} onClick={submit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit test"}
          </button>
        )}
        {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

        {submissionId && (
          <div className="panel" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Speaking assessment</h3>
            {assessments.length === 0 && <p>Waiting for results…</p>}
            {assessments
              .filter((a) => a.assessment_status)
              .map((a) => (
                <div
                  key={a.answer_id}
                  style={{ borderTop: "1px solid rgba(11,31,58,0.1)", paddingTop: "0.75rem", marginTop: "0.75rem" }}
                >
                  <p style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                    <StatusChip
                      tone={
                        a.assessment_status === "scored" || a.assessment_status === "overridden"
                          ? "ok"
                          : a.assessment_status === "failed"
                            ? "bad"
                            : "warn"
                      }
                    >
                      {a.assessment_status}
                    </StatusChip>
                    {a.pronunciation_score != null && <strong>{a.pronunciation_score}/100</strong>}
                  </p>
                  {(a.assessment_status === "pending" || a.assessment_status === "processing") && (
                    <p style={{ color: "var(--muted)" }}>Assessing pronunciation with Whisper…</p>
                  )}
                  {a.transcript && (
                    <div className="panel" style={{ margin: "0.5rem 0", background: "rgba(11,31,58,0.04)" }}>
                      <strong>You said</strong>
                      <p style={{ margin: "0.35rem 0 0" }}>{a.transcript}</p>
                    </div>
                  )}
                  {a.expected_text && (
                    <div className="panel" style={{ margin: "0.5rem 0", background: "rgba(11,31,58,0.04)" }}>
                      <strong>Expected</strong>
                      <p style={{ margin: "0.35rem 0 0" }}>{a.expected_text}</p>
                    </div>
                  )}
                  {a.assessment_error && <p style={{ color: "var(--red)" }}>{a.assessment_error}</p>}
                  {a.attempts_used < a.max_attempts &&
                    a.assessment_status === "scored" &&
                    (a.pronunciation_score ?? 100) < 70 && (
                      <p style={{ color: "var(--muted)" }}>
                        Attempts used: {a.attempts_used}/{a.max_attempts}. You can retake the test to improve your score.
                      </p>
                    )}
                </div>
              ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
