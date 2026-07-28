"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { apiGet, apiSend, type User } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [slug, setSlug] = useState("about");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function refresh() {
    const token = await getIdToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }
    setUsers(await apiGet<User[]>("/admin/users", token));
  }

  useEffect(() => {
    refresh().catch((e) => setMessage(String(e)));
  }, []);

  async function setRole(userId: string, role: string) {
    const token = await getIdToken();
    if (!token) return;
    await apiSend(`/admin/users/${userId}/role`, "PATCH", { role }, token);
    setMessage("Role updated.");
    await refresh();
  }

  async function saveMarketing(e: FormEvent) {
    e.preventDefault();
    const token = await getIdToken();
    if (!token) return;
    await apiSend(`/admin/marketing/${slug}`, "PUT", { title, body_md: body }, token);
    setMessage(`Marketing page /${slug} saved.`);
  }

  return (
    <section className="section">
      <div className="container-page">
        <Link href="/dashboard">← Dashboard</Link>
        <h2>Admin console</h2>
        <p className="lead">Manage accounts and public marketing content without code.</p>
        {message && <div className="notice">{message}</div>}

        <div className="panel" style={{ marginBottom: "1.5rem" }}>
          <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Users</h3>
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {users.map((u) => (
              <div key={u.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <strong>{u.full_name || u.email}</strong>
                  <div style={{ color: "var(--muted)", fontSize: "0.9rem" }}>{u.email}</div>
                </div>
                <select value={u.role} onChange={(e) => setRole(u.id, e.target.value)}>
                  <option value="student">student</option>
                  <option value="teacher">teacher</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <form className="panel" onSubmit={saveMarketing}>
          <h3 style={{ marginTop: 0, color: "var(--navy)" }}>Edit marketing page</h3>
          <div className="field">
            <label>Slug</label>
            <select value={slug} onChange={(e) => setSlug(e.target.value)}>
              <option value="about">about</option>
              <option value="schedule-pricing">schedule-pricing</option>
              <option value="testimonials">testimonials</option>
            </select>
          </div>
          <div className="field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="field">
            <label>Body (markdown-ish text)</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
          </div>
          <button className="btn btn-primary" type="submit">
            Save page
          </button>
        </form>
      </div>
    </section>
  );
}
