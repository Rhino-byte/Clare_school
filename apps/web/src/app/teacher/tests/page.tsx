"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiGet, apiSend, type Course, type Test } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import { uploadBlob } from "@/lib/media";

type DraftQuestion = {
  question_type: "mcq" | "true_false" | "short_answer" | "audio_response";
  prompt: string;
  options: string[];
  correct_answer: string;
  audio_prompt_key?: string | null;
  points: number;
  order_index: number;
};

export default function TeacherTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [questions, setQuestions] = useState<DraftQuestion[]>([
    { question_type: "mcq", prompt: "", options: ["A", "B", "C", "D"], correct_answer: "A", points: 1, order_index: 0 },
  ]);
  const [message, setMessage] = useState<string | null>(null);

  async function refresh() {
    const token = await getIdToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setTests(await apiGet<Test[]>("/tests", token));
    setCourses(await apiGet<Course[]>("/courses"));
  }

  useEffect(() => {
    refresh().catch((e) => setMessage(String(e)));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const token = await getIdToken();
    if (!token) return;
    const payload = {
      course_id: String(fd.get("course_id")),
      title: String(fd.get("title")),
      instructions: String(fd.get("instructions")),
      status: String(fd.get("status")),
      questions,
    };
    await apiSend("/tests", "POST", payload, token);
    setMessage("Test created.");
    form.reset();
    await refresh();
  }

  function updateQuestion(i: number, patch: Partial<DraftQuestion>) {
    setQuestions((prev) => prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  }

  async function attachAudioPrompt(i: number, file: File | null) {
    if (!file) return;
    const key = await uploadBlob(file, file.name, "prompts", file.type || "audio/webm");
    updateQuestion(i, { audio_prompt_key: key });
  }

  return (
    <section className="section">
      <div className="container-page">
        <Link href="/dashboard">← Dashboard</Link>
        <h2>Teacher tests</h2>
        <p className="lead">Build assessments with multiple choice, true/false, short answer, and audio response.</p>
        {message && <div className="notice">{message}</div>}

        <form className="panel" onSubmit={onSubmit} style={{ marginBottom: "2rem" }}>
          <div className="field">
            <label>Course</label>
            <select name="course_id" required defaultValue="">
              <option value="" disabled>
                Select course
              </option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Title</label>
            <input name="title" required />
          </div>
          <div className="field">
            <label>Instructions</label>
            <textarea name="instructions" />
          </div>
          <div className="field">
            <label>Status</label>
            <select name="status" defaultValue="draft">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {questions.map((q, i) => (
            <div key={i} className="panel" style={{ background: "rgba(11,31,58,0.03)", marginBottom: "0.75rem" }}>
              <div className="field">
                <label>Type</label>
                <select
                  value={q.question_type}
                  onChange={(e) => updateQuestion(i, { question_type: e.target.value as DraftQuestion["question_type"] })}
                >
                  <option value="mcq">Multiple choice</option>
                  <option value="true_false">True / False</option>
                  <option value="short_answer">Short answer</option>
                  <option value="audio_response">Audio response</option>
                </select>
              </div>
              <div className="field">
                <label>Prompt</label>
                <textarea value={q.prompt} onChange={(e) => updateQuestion(i, { prompt: e.target.value })} required />
              </div>
              {(q.question_type === "mcq" || q.question_type === "true_false") && (
                <>
                  <div className="field">
                    <label>Options (comma separated)</label>
                    <input
                      value={q.options.join(",")}
                      onChange={(e) =>
                        updateQuestion(i, {
                          options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                    />
                  </div>
                  <div className="field">
                    <label>Correct answer</label>
                    <input value={q.correct_answer} onChange={(e) => updateQuestion(i, { correct_answer: e.target.value })} />
                  </div>
                </>
              )}
              {q.question_type === "audio_response" && (
                <div className="field">
                  <label>Optional audio prompt upload</label>
                  <input type="file" accept="audio/*" onChange={(e) => attachAudioPrompt(i, e.target.files?.[0] || null)} />
                  {q.audio_prompt_key && <small>Uploaded: {q.audio_prompt_key}</small>}
                </div>
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <button
              type="button"
              className="btn btn-navy"
              onClick={() =>
                setQuestions((prev) => [
                  ...prev,
                  {
                    question_type: "short_answer",
                    prompt: "",
                    options: [],
                    correct_answer: "",
                    points: 1,
                    order_index: prev.length,
                  },
                ])
              }
            >
              Add question
            </button>
            <button className="btn btn-primary" type="submit">
              Create test
            </button>
          </div>
        </form>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {tests.map((t) => (
            <div key={t.id} className="panel">
              <strong>{t.title}</strong> <span className="level-badge">{t.status}</span>
              <div style={{ color: "var(--muted)" }}>{t.questions.length} questions</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
