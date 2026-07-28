import type { Metadata } from "next";
import { API_URL } from "@/lib/api";

export const metadata: Metadata = { title: "Testimonials" };

export default async function TestimonialsPage() {
  let body =
    '"The speaking practice prepared me for real conversations abroad." — Alumni, German B1';
  try {
    const res = await fetch(`${API_URL}/api/marketing/testimonials`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      body = data.body_md;
    }
  } catch {
    /* fallback */
  }

  return (
    <section className="section">
      <div className="container-page">
        <h2>Learner stories</h2>
        <p className="lead">Outcomes that matter — confidence in speaking, exam readiness, and career mobility.</p>
        <div className="panel" style={{ whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: "1.05rem" }}>
          {body}
        </div>
      </div>
    </section>
  );
}
