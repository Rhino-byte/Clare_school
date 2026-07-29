"use client";

import { FormEvent, useState } from "react";
import { apiSend } from "@/lib/api";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      const res = await apiSend<{ message: string }>("/contact", "POST", {
        name: fd.get("name"),
        email: fd.get("email"),
        subject: fd.get("subject"),
        message: fd.get("message"),
      });
      setStatus(res.message);
      form.reset();
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Could not send inquiry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container-page" style={{ maxWidth: 720 }}>
        <h2>Contact & inquiry</h2>
        <p className="lead">Ask about courses, schedules, or enrolment. Messages are routed to admissions staff.</p>
        <form className="panel" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" required />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send inquiry"}
          </button>
          {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
        </form>
      </div>
    </section>
  );
}
