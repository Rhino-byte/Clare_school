import Link from "next/link";

const pillars = [
  { title: "Learn", subtitle: "Quality Education" },
  { title: "Grow", subtitle: "Practical Skills" },
  { title: "Achieve", subtitle: "Global Standards" },
  { title: "Succeed", subtitle: "Better Futures" },
];

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "St. Clare Language Institute",
    description: "German, French, and English language training in Nairobi, Kenya.",
    slogan: "Building Skills. Shaping Futures.",
    parentOrganization: "St. Francis Technical Institute",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section
        style={{
          minHeight: "calc(100vh - 76px)",
          display: "grid",
          alignItems: "end",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(115deg, rgba(7,21,40,0.92) 0%, rgba(11,31,58,0.78) 42%, rgba(11,31,58,0.45) 100%), radial-gradient(circle at 70% 40%, rgba(201,162,39,0.35), transparent 40%), linear-gradient(160deg, #0b1f3a, #1a3d6d 55%, #0b1f3a)",
          color: "white",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 14px)",
            opacity: 0.35,
          }}
        />
        <div className="container-page" style={{ position: "relative", padding: "5rem 0 4rem" }}>
          <p className="animate-rise" style={{ color: "#e6c65c", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            St. Clare · Nairobi
          </p>
          <h1
            className="animate-rise-delay"
            style={{
              fontFamily: "var(--font-fraunces), Georgia, serif",
              fontSize: "clamp(2.8rem, 7vw, 5.2rem)",
              lineHeight: 1.02,
              margin: "0 0 1rem",
              maxWidth: "14ch",
            }}
          >
            St. Clare
          </h1>
          <p className="animate-rise-delay-2" style={{ fontSize: "clamp(1.1rem, 2.4vw, 1.45rem)", maxWidth: "34rem", margin: "0 0 1.75rem", opacity: 0.92 }}>
            Building Skills. Shaping Futures. — German, French, and English for global study and careers.
          </p>
          <div className="animate-rise-delay-2" style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
            <Link href="/register" className="btn btn-primary">
              Start enrolment
            </Link>
            <Link href="/courses" className="btn btn-secondary">
              Explore courses
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <h2>Learn. Grow. Achieve. Succeed.</h2>
          <p className="lead">Four pillars guide every programme at St. Clare, a branch of St. Francis Technical Institute.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
            {pillars.map((p, i) => (
              <div
                key={p.title}
                className="panel"
                style={{
                  textAlign: "center",
                  animation: `riseIn 0.6s ease ${0.1 * i}s both`,
                  borderTop: "3px solid var(--gold)",
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
                <h3 style={{ margin: "0 0 0.25rem", color: "var(--navy)" }}>{p.title}</h3>
                <p style={{ margin: 0, color: "var(--muted)" }}>{p.subtitle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container-page panel" style={{ display: "grid", gap: "1rem", background: "var(--navy)", color: "white" }}>
          <h2 style={{ color: "white", margin: 0 }}>Languages for real progression</h2>
          <p style={{ margin: 0, opacity: 0.9, maxWidth: "40rem" }}>
            Structured pathways from A1–B2 in German and French, plus English from Beginner through IELTS Preparation and
            Business English. Physical attendance is compulsory for all programmes.
          </p>
          <div>
            <Link href="/courses" className="btn btn-primary">
              View course catalogue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
