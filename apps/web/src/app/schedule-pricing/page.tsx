import type { Metadata } from "next";
import { API_URL } from "@/lib/api";

export const metadata: Metadata = { title: "Schedule & Pricing" };

export default async function SchedulePage() {
  let body =
    "Class schedules and tuition details are confirmed at enrolment. Tuition is handled offline with admissions staff.";
  let title = "Schedule & Pricing";
  try {
    const res = await fetch(`${API_URL}/api/marketing/schedule-pricing`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      title = data.title;
      body = data.body_md;
    }
  } catch {
    /* offline fallback */
  }

  return (
    <section className="section">
      <div className="container-page">
        <h2>{title}</h2>
        <p className="lead">Plan your studies around physical classes in Nairobi, with optional online support materials.</p>
        <div className="panel" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
          {body}
        </div>
        <div className="notice" style={{ marginTop: "1.25rem" }}>
          Payment processing is not available on this site in v1. Registration reserves your place; tuition is arranged with staff offline.
        </div>
      </div>
    </section>
  );
}
