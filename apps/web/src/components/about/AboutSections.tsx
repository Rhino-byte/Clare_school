import Link from "next/link";
import { AboutHero } from "@/components/about/AboutHero";
import { aboutContact, aboutContent } from "@/content/about";

export { AboutHero };

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
        <div className="about-mv">
          <p className="about-kicker">Purpose</p>
          <h2>{c.missionTitle}</h2>
          <p style={{ margin: 0, lineHeight: 1.7, color: "var(--muted)", fontSize: "1.05rem" }}>{c.missionBody}</p>
        </div>
        <div className="about-mv">
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
              className="about-pillar"
              style={{ animation: `riseIn 0.6s ease ${0.1 * i}s both` }}
            >
              <div aria-hidden className="about-pillar-icon">
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
              className="about-why-row"
              style={{
                borderTop: i === 0 ? "1px solid rgba(11,31,58,0.12)" : undefined,
                borderBottom: "1px solid rgba(11,31,58,0.12)",
              }}
            >
              <span className="about-why-num">
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
          <a className="about-contact-link" href={`tel:${contact.phones[0].replace(/\s/g, "")}`}>
            {contact.phones[0]}
          </a>
          <a className="about-contact-link" href={`tel:${contact.phones[1].replace(/\s/g, "")}`}>
            {contact.phones[1]}
          </a>
          <a className="about-contact-link" href={`mailto:${contact.email}`} style={{ marginTop: "0.35rem" }}>
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
