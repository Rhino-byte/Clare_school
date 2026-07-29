"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { aboutContent } from "@/content/about";

const LANGUAGES = ["German", "French", "English"] as const;

function CrestMark({ size = 56 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="about-crest about-crest-live"
      style={{
        width: size,
        height: Math.round(size * 1.14),
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(160deg, #0b1f3a, #14325c)",
        border: "2px solid #c9a227",
        clipPath: "polygon(50% 0%, 100% 18%, 100% 70%, 50% 100%, 0 70%, 0 18%)",
        color: "#c9a227",
        fontWeight: 800,
        fontSize: size * 0.28,
        flexShrink: 0,
      }}
    >
      SC
    </span>
  );
}

export function AboutHero() {
  const c = aboutContent;
  const [langIndex, setLangIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setLangIndex((i) => (i + 1) % LANGUAGES.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  return (
    <section className="about-hero about-hero-live">
      <div className="about-hero-glow about-hero-glow-a" aria-hidden />
      <div className="about-hero-glow about-hero-glow-b" aria-hidden />
      <div className="about-hero-stripes" aria-hidden />

      <div className="container-page about-hero-inner">
        <div className="animate-rise about-hero-brand">
          <CrestMark />
          <div>
            <p className="about-hero-eyebrow">{c.heroEyebrow}</p>
            <strong className="about-hero-brand-name">{c.brand}</strong>
          </div>
        </div>

        <h1 className="animate-rise-delay about-hero-headline">{c.heroHeadline}</h1>

        <p className="animate-rise-delay-2 about-hero-support">
          Professional{" "}
          <span className="about-lang-live" aria-live="polite">
            {LANGUAGES.map((lang, i) => (
              <span
                key={lang}
                className={i === langIndex ? "is-active" : ""}
                aria-hidden={i !== langIndex}
              >
                {lang}
              </span>
            ))}
          </span>
          {" "}
          training for education, employment, migration, and international communication.
        </p>

        <div className="animate-rise-delay-2 about-hero-actions">
          <Link href="/register" className="btn btn-primary about-cta-pulse">
            Start enrolment
          </Link>
          <Link href="/courses" className="btn btn-secondary about-btn-ghost">
            Explore courses
          </Link>
        </div>

        <p className="about-hero-tagline">{c.tagline}</p>
      </div>
    </section>
  );
}
