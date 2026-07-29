"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiGet, apiSend, type Course, type Module } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";
import { uploadBlob } from "@/lib/media";

export default function TeacherModulesPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [editing, setEditing] = useState<Module | null>(null);

  async function refresh() {
    const token = await getIdToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    const [mods, crs] = await Promise.all([
      apiGet<Module[]>("/modules", token),
      apiGet<Course[]>("/courses"),
    ]);
    setModules(mods);
    setCourses(crs);
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
    const file = fd.get("media") as File | null;
    const content: Array<Record<string, unknown>> = [
      { type: "text", body: String(fd.get("body") || "") },
    ];
    if (file && file.size > 0) {
      const key = await uploadBlob(file, file.name, "lessons", file.type || "application/octet-stream");
      content.push({ type: "file", key, filename: file.name });
    }
    const payload = {
      course_id: String(fd.get("course_id")),
      title: String(fd.get("title")),
      summary: String(fd.get("summary")),
      content_json: content,
      status: String(fd.get("status")),
      order_index: Number(fd.get("order_index") || 0),
    };
    if (editing) {
      await apiSend(`/modules/${editing.id}`, "PUT", payload, token);
      setMessage("Module updated.");
    } else {
      await apiSend("/modules", "POST", payload, token);
      setMessage("Module created.");
    }
    setEditing(null);
    form.reset();
    await refresh();
  }

  async function duplicate(id: string) {
    const token = await getIdToken();
    if (!token) return;
    await apiSend(`/modules/${id}/duplicate`, "POST", {}, token);
    await refresh();
  }

  async function remove(id: string) {
    const token = await getIdToken();
    if (!token) return;
    await apiSend(`/modules/${id}`, "DELETE", undefined, token);
    await refresh();
  }

  return (
    <section className="section">
      <div className="container-page">
        <Link href="/dashboard">← Dashboard</Link>
        <h2>Teacher modules</h2>
        <p className="lead">Create, edit, publish, and duplicate learning modules. Media uploads go to Cloudflare R2 (or local fallback).</p>
        {message && <div className="notice">{message}</div>}
        <form className="panel" onSubmit={onSubmit} style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginTop: 0 }}>{editing ? "Edit module" : "New module"}</h3>
          <div className="field">
            <label>Course</label>
            <select name="course_id" required defaultValue={editing?.course_id || ""}>
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
            <input name="title" required defaultValue={editing?.title || ""} />
          </div>
          <div className="field">
            <label>Summary</label>
            <input name="summary" defaultValue={editing?.summary || ""} />
          </div>
          <div className="field">
            <label>Lesson text</label>
            <textarea
              name="body"
              defaultValue={
                editing?.content_json?.find((b) => b.type === "text")
                  ? String(editing.content_json.find((b) => b.type === "text")?.body || "")
                  : ""
              }
            />
          </div>
          <div className="field">
            <label>Attach media (optional)</label>
            <input name="media" type="file" />
          </div>
          <div className="field">
            <label>Status</label>
            <select name="status" defaultValue={editing?.status || "draft"}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="field">
            <label>Order</label>
            <input name="order_index" type="number" defaultValue={editing?.order_index ?? 0} />
          </div>
          <button className="btn btn-primary" type="submit">
            {editing ? "Save changes" : "Create module"}
          </button>
        </form>

        <div style={{ display: "grid", gap: "0.75rem" }}>
          {modules.map((m) => (
            <div key={m.id} className="panel" style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <strong>{m.title}</strong> <span className="level-badge">{m.status}</span>
                <div style={{ color: "var(--muted)" }}>{m.summary}</div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <button type="button" className="btn btn-navy" style={{ padding: "0.4rem 0.8rem" }} onClick={() => setEditing(m)}>
                  Edit
                </button>
                <button type="button" className="btn btn-navy" style={{ padding: "0.4rem 0.8rem" }} onClick={() => duplicate(m.id)}>
                  Duplicate
                </button>
                <button type="button" className="btn btn-secondary" style={{ padding: "0.4rem 0.8rem", color: "var(--navy)", borderColor: "var(--navy)" }} onClick={() => remove(m.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
