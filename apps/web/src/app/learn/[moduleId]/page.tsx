"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiGet, apiSend, type Module } from "@/lib/api";
import { getIdToken } from "@/lib/firebase";

export default function LearnModulePage() {
  const params = useParams<{ moduleId: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = await getIdToken();
      if (!token) {
        window.location.href = "/login";
        return;
      }
      const m = await apiGet<Module>(`/modules/${params.moduleId}`, token);
      setModule(m);
      await apiSend(`/modules/${params.moduleId}/progress`, "POST", { status: "in_progress" }, token);
    })().catch((err) => setMessage(err instanceof Error ? err.message : "Failed to load"));
  }, [params.moduleId]);

  async function markComplete() {
    const token = await getIdToken();
    if (!token) return;
    await apiSend(`/modules/${params.moduleId}/progress`, "POST", { status: "completed" }, token);
    setMessage("Marked complete. Progress saved.");
  }

  if (!module) {
    return (
      <section className="section">
        <div className="container-page">{message || "Loading module…"}</div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container-page" style={{ maxWidth: 800 }}>
        <Link href="/dashboard">← Dashboard</Link>
        <h2 style={{ marginTop: "1rem" }}>{module.title}</h2>
        <p className="lead">{module.summary}</p>
        <div style={{ display: "grid", gap: "1rem" }}>
          {module.content_json.map((block, i) => {
            const type = String(block.type || "");
            const url = block.url ? String(block.url) : "";
            const key = block.key ? String(block.key) : "";
            return (
              <article key={i} className="panel">
                {type === "text" ? (
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{String(block.body || "")}</p>
                ) : null}
                {type === "image" && url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" style={{ maxWidth: "100%", borderRadius: 12 }} />
                ) : null}
                {type === "video" && url ? (
                  <video controls src={url} style={{ width: "100%", borderRadius: 12 }} />
                ) : null}
                {type === "audio" && url ? <audio controls src={url} style={{ width: "100%" }} /> : null}
                {type === "file" && key ? (
                  <p style={{ margin: 0 }}>
                    Attachment: <code>{key}</code>
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
        <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button type="button" className="btn btn-primary" onClick={markComplete}>
            Mark complete
          </button>
          <Link href="/tests" className="btn btn-navy">
            Take related tests
          </Link>
        </div>
        {message && <p>{message}</p>}
      </div>
    </section>
  );
}
