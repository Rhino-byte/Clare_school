import Link from "next/link";
import { aboutContact, aboutContent } from "@/content/about";

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
  return (
    <section
      className="about-hero"
      style={{
        position: "relative",
        overflow: "hidden",
        color: "white",
        background:
          "linear-gradient(115deg, rgba(7,21,40,0.94) 0%, rgba(11,31,58,0.82) 48%, rgba(20,50,92,0.72) 100%), linear-gradient(160deg, #071528, #0b1f3a 55%, #14325c)",
        minHeight: "min(72vh, 640px)",
        display: "grid",
        alignItems: "end",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 16px)",
          opacity: 0.4,
        }}
      />
      <div className="container-page" style={{ position: "relative", padding: "4.5rem 0 3.5rem" }}>
        <div className="animate-rise" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
          <CrestMark />
          <div>
            <p style={{ margin: 0, color: "#e6c65c", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.8rem" }}>
              {c.heroEyebrow}
            </p>
            <strong style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.15rem" }}>{c.brand}</strong>
          </div>
        </div>
        <h1
          className="animate-rise-delay"
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontSize: "clamp(2.2rem, 5.5vw, 3.75rem)",
            lineHeight: 1.08,
            margin: "0 0 1rem",
            maxWidth: "16ch",
          }}
        >
          {c.heroHeadline}
        </h1>
        <p className="animate-rise-delay-2" style={{ margin: "0 0 0.5rem", opacity: 0.85, fontSize: "0.95rem" }}>
          {c.parentLine}
        </p>
        <p className="animate-rise-delay-2" style={{ margin: "0 0 1.75rem", maxWidth: "36rem", fontSize: "1.15rem", opacity: 0.92 }}>
          {c.heroSupport}
        </p>
        <div className="animate-rise-delay-2" style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
          <Link href="/register" className="btn btn-primary">
            Start enrolment
          </Link>
          <Link href="/courses" className="btn btn-secondary">
            Explore courses
          </Link>
        </div>
        <p style={{ margin: "1.5rem 0 0", color: "#e6c65c", fontWeight: 700, letterSpacing: "0.04em" }}>{c.tagline}</p>
      </div>
    </section>
  );
}

export function AboutStory() {
  const c = aboutContent;
  return (
    <section className="section">
      <div className="container-page" style={{ maxWidth: 760 }}>
        <p className="about-kicker">Who we are</p>
        <h2>{c.storyTitle}</h2>
        <p className="lead">{c.storyLead}</p>
        <p style={{ margin: 0, lineHeight: 1.75, color: "var(--ink)", fontSize: "1.05rem" }}>{c.storyBody}</p>
      </div>
    </section>
  );
}

export function DifferentiatorGrid() {
  const c = aboutContent;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container-page">
        <p className="about-kicker">Support beyond the classroom</p>
        <h2>{c.differentiatorsTitle}</h2>
        <p className="lead">{c.differentiatorsLead}</p>
        <div style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {c.differentiators.map((item, i) => (
            <article
              key={item.title}
              className="about-diff"
              style={{ animation: `riseIn 0.65s ease ${0.08 * i}s both` }}
            >
              <span className="about-diff-index" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrainingApproach() {
  const c = aboutContent;
  return (
    <section className="section about-band">
      <div className="container-page">
        <p className="about-kicker" style={{ color: "#e6c65c" }}>
          Methodology
        </p>
        <h2 style={{ color: "white" }}>{c.approachTitle}</h2>
        <p className="lead" style={{ color: "rgba(255,255,255,0.78)" }}>
          {c.approachLead}
        </p>
        <ol className="about-steps">
          {c.approachSteps.map((s) => (
            <li key={s.step}>
              <span className="about-step-num">{s.step}</span>
              <div>
                <strong>{s.title}</strong>
                <p>{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function MissionVision() {
  const c = aboutContent;
  return (
    <section className="section">
      <div className="container-page" style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div>
          <p className="about-kicker">Purpose</p>
          <h2>{c.missionTitle}</h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: "var(--muted)", fontSize: "1.05rem" }}>{c.missionBody}</p>
        </div>
        <div>
          <p className="about-kicker">Ambition</p>
          <h2>{c.visionTitle}</h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: "var(--muted)", fontSize: "1.05rem" }}>{c.visionBody}</p>
        </div>
      </div>
    </section>
  );
}

export function PillarsRow() {
  const c = aboutContent;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container-page">
        <p className="about-kicker">Values</p>
        <h2>{c.pillarsTitle}</h2>
        <p className="lead">{c.pillarsLead}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
          {c.pillars.map((p, i) => (
            <div
              key={p.title}
              style={{
                textAlign: "center",
                padding: "1.25rem 0.75rem",
                borderTop: "3px solid var(--gold)",
                background: "var(--surface)",
                animation: `riseIn 0.6s ease ${0.1 * i}s both`,
              }}
            >
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
              <h3 style={{ margin: "0 0 0.25rem", color: "var(--navy)", fontSize: "1.1rem" }}>{p.title}</h3>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>{p.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyClare() {
  const c = aboutContent;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container-page">
        <p className="about-kicker">Why choose us</p>
        <h2>{c.whyTitle}</h2>
        <p className="lead">{c.whyLead}</p>
        <div style={{ display: "grid", gap: "0" }}>
          {c.whyItems.map((item, i) => (
            <div
              key={item.title}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(2.5rem, auto) 1fr",
                gap: "1rem",
                padding: "1.25rem 0",
                borderTop: i === 0 ? "1px solid rgba(11,31,58,0.12)" : undefined,
                borderBottom: "1px solid rgba(11,31,58,0.12)",
              }}
            >
              <span style={{ color: "var(--gold)", fontWeight: 800, fontFamily: "var(--font-fraunces), Georgia, serif" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 style={{ margin: "0 0 0.35rem", color: "var(--navy)", fontSize: "1.15rem" }}>{item.title}</h3>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.65 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AccommodationBrief() {
  const c = aboutContent;
  return (
    <section className="section about-hostel">
      <div className="container-page">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem" }}>
          <p className="about-kicker" style={{ margin: 0 }}>
            Student life
          </p>
          <span className="level-badge">{c.accommodationStatus}</span>
        </div>
        <h2>{c.accommodationTitle}</h2>
        <p className="lead">{c.accommodationLead}</p>
        <p style={{ fontWeight: 700, color: "var(--navy)", margin: "0 0 1.25rem" }}>{c.accommodationName}</p>
        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div>
            <h3 style={{ marginTop: 0, color: "var(--navy)", fontSize: "1.05rem" }}>Features</h3>
            <ul className="about-list">
              {c.accommodationFeatures.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ marginTop: 0, color: "var(--navy)", fontSize: "1.05rem" }}>Amenities included</h3>
            <ul className="about-list">
              {c.accommodationAmenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutContactCta() {
  const c = aboutContent;
  const contact = aboutContact;
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container-page about-cta">
        <h2 style={{ color: "white", margin: 0 }}>{c.ctaTitle}</h2>
        <p style={{ margin: "0.75rem 0 0", maxWidth: "36rem", color: "rgba(255,255,255,0.85)" }}>{c.ctaBody}</p>
        <div style={{ marginTop: "1.5rem", display: "grid", gap: "0.35rem", color: "rgba(255,255,255,0.9)" }}>
          <span style={{ color: "#e6c65c", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {contact.whatsappNote}
          </span>
          <a href={`tel:${contact.phones[0].replace(/\s/g, "")}`} style={{ fontWeight: 700 }}>
            {contact.phones[0]}
          </a>
          <a href={`tel:${contact.phones[1].replace(/\s/g, "")}`} style={{ fontWeight: 700 }}>
            {contact.phones[1]}
          </a>
          <a href={`mailto:${contact.email}`} style={{ marginTop: "0.35rem" }}>
            {contact.email}
          </a>
        </div>
        <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", marginTop: "1.75rem" }}>
          <Link href="/register" className="btn btn-primary">
            Enrol now
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact admissions
          </Link>
          <Link href="/courses" className="btn btn-secondary">
            View courses
          </Link>
        </div>
      </div>
    </section>
  );
}
