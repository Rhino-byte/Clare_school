"use client";

import Link from "next/link";
import { ImageBand, PhotoHero, RiseIn, StaggerChildren, StaggerItem } from "@/components/motion";

const pillars = [
  { title: "Learn", subtitle: "Quality Education" },
  { title: "Grow", subtitle: "Practical Skills" },
  { title: "Achieve", subtitle: "Global Standards" },
  { title: "Succeed", subtitle: "Better Futures" },
];

export function HomeHero() {
  return (
    <PhotoHero
      imageSrc="/images/hero-home.jpg"
      imageAlt="St. Clare classroom in Nairobi with warm natural light"
      brand="St. Clare · Nairobi"
      headline="St. Clare"
      support="Building Skills. Shaping Futures. German, French, and English for global study and careers."
      priority
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
    />
  );
}

export function HomePillars() {
  return (
    <section className="section">
      <div className="container-page">
        <RiseIn>
          <h2>Learn. Grow. Achieve. Succeed.</h2>
          <p className="lead">Four pillars guide every programme at St. Clare, a branch of St. Francis Technical Institute.</p>
        </RiseIn>
        <StaggerChildren
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}
        >
          {pillars.map((p) => (
            <StaggerItem key={p.title}>
              <div className="panel" style={{ textAlign: "center", borderTop: "3px solid var(--gold)", height: "100%" }}>
                <div
                  aria-hidden
                  style={{
                    width: 48,
                    height: 48,
                    margin: "0 auto 0.75rem",
                    borderRadius: "50%",
                    border: "1.5px solid var(--navy)",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    color: "var(--navy)",
                  }}
                >
                  {p.title[0]}
                </div>
                <h3 style={{ margin: "0 0 0.25rem", color: "var(--navy)" }}>{p.title}</h3>
                <p style={{ margin: 0, color: "var(--muted)" }}>{p.subtitle}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}

export function HomeLanguageBand() {
  return (
    <ImageBand src="/images/band-languages.jpg" alt="Language learning materials and study tools">
      <RiseIn>
        <h2>Languages for real progression</h2>
        <p style={{ margin: "0 0 1.25rem", opacity: 0.92, maxWidth: "40rem" }}>
          Structured pathways from A1–B2 in German and French, plus English from Beginner through IELTS Preparation and
          Business English. Physical attendance is compulsory for all programmes.
        </p>
        <Link href="/courses" className="btn btn-primary">
          View course catalogue
        </Link>
      </RiseIn>
    </ImageBand>
  );
}
