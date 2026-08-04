"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { apiGet, apiSend, type Course } from "@/lib/api";
import { firebaseEnabled, getIdToken, registerEmail, setDevSession } from "@/lib/firebase";

export default function RegisterClient() {
  const params = useSearchParams();
  const presetCourse = params.get("course") || "";
  const [courses, setCourses] = useState<Course[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    apiGet<Course[]>("/courses")
      .then(setCourses)
      .catch(() => setCourses([]));
  }, []);

  const grouped = useMemo(() => courses, [courses]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const fullName = String(fd.get("full_name") || "");
    const courseId = String(fd.get("course_id") || "");
    const deliveryMode = String(fd.get("delivery_mode") || "physical");
    const ack = fd.get("acknowledge_in_person") === "on";

    try {
      let token = await getIdToken();
      if (firebaseEnabled) {
        await registerEmail(email, password);
        token = await getIdToken();
      } else {
        setDevSession("student");
        token = await getIdToken();
      }
      if (!token) throw new Error("Could not create auth session");

      await apiSend(
        "/auth/register",
        "POST",
        {
          full_name: fullName,
          course_id: courseId,
          delivery_mode: deliveryMode,
          acknowledge_in_person: ack,
        },
        token,
      );

      setStatus("Registration complete.");
      window.location.href = "/dashboard";
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-split">
      <motion.div
        className="auth-split-visual"
        initial={reduce ? false : { opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/images/auth-panel.jpg"
          alt="St. Clare classroom ready for enrolment"
          fill
          priority
          sizes="(max-width: 860px) 100vw, 50vw"
          style={{ objectFit: "cover" }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, rgba(7,21,40,0.55), rgba(11,31,58,0.35))",
          }}
        />
        <div style={{ position: "absolute", left: "1.5rem", bottom: "1.5rem", color: "white", zIndex: 1 }}>
          <strong style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.4rem" }}>Enrol at St. Clare</strong>
          <p style={{ margin: "0.35rem 0 0", opacity: 0.9, maxWidth: "18rem" }}>
            German · French · English. Building Skills. Shaping Futures.
          </p>
        </div>
      </motion.div>

      <motion.div
        className="auth-split-form"
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
      >
        <div style={{ maxWidth: 480, width: "100%", margin: "0 auto" }}>
          <h2 style={{ marginTop: 0 }}>Self-registration</h2>
          <p className="lead">Create your account, choose a language and level, and reserve your place.</p>
          <div className="notice">
            <strong>Compulsory in-person attendance:</strong> All St. Clare language programmes require physical class
            attendance, even when online materials are available.
          </div>
          <form className="panel" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="full_name">Full name</label>
              <input id="full_name" name="full_name" required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={firebaseEnabled ? "" : "student@stclare.local"}
              />
            </div>
            {firebaseEnabled && (
              <div className="field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" minLength={6} required />
              </div>
            )}
            {!firebaseEnabled && (
              <p style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
                Firebase is not configured. Demo mode signs you in as the seeded student account.
              </p>
            )}
            <div className="field">
              <label htmlFor="course_id">Course & level</label>
              <select id="course_id" name="course_id" required defaultValue={presetCourse}>
                <option value="" disabled>
                  Select a course
                </option>
                {grouped.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="delivery_mode">Preferred delivery mode</label>
              <select id="delivery_mode" name="delivery_mode" defaultValue="physical">
                <option value="physical">Physical classes</option>
                <option value="online">Online component (in-person still compulsory)</option>
              </select>
            </div>
            <label style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", marginBottom: "1rem" }}>
              <input name="acknowledge_in_person" type="checkbox" required defaultChecked />
              <span>I understand that in-person attendance is compulsory for all language programmes.</span>
            </label>
            <button className="btn btn-primary" disabled={loading} type="submit">
              {loading ? "Submitting…" : "Create account & enrol"}
            </button>
            {status && <p style={{ marginTop: "1rem" }}>{status}</p>}
          </form>
          <p style={{ marginTop: "1.25rem", color: "var(--muted)" }}>
            Already enrolled? <Link href="/login">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
