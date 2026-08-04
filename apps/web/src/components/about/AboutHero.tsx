"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { aboutContent } from "@/content/about";
import { PhotoHero } from "@/components/motion";

const LANGUAGES = ["German", "French", "English"] as const;

function CrestMark({ size = 56 }: { size?: number }) {
  return (
    <span
      aria-hidden
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
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setLangIndex((i) => (i + 1) % LANGUAGES.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <PhotoHero
      imageSrc="/images/hero-about.jpg"
      imageAlt="St. Clare campus community in Nairobi"
      brand={c.heroEyebrow}
      headline={c.heroHeadline}
      headlineWide
      priority
      support={
        <p className="photo-hero-support">
          Professional{" "}
          <span style={{ color: "#e6c65c", fontWeight: 700 }}>{LANGUAGES[langIndex]}</span> training for education,
          employment, migration, and international communication.
        </p>
      }
      actions={
        <>
          <Link href="/register" className="btn btn-primary">
            Start enrolment
          </Link>
          <Link href="/courses" className="btn btn-secondary">
            Explore courses
          </Link>
        </>
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.85rem",
          marginTop: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <CrestMark />
        <div>
          <strong
            style={{
              display: "block",
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "1.15rem",
            }}
          >
            {c.brand}
          </strong>
          <span style={{ opacity: 0.8, fontStyle: "italic" }}>{c.tagline}</span>
        </div>
      </div>
    </PhotoHero>
  );
}
