import type { Metadata } from "next";

export const metadata: Metadata = { title: "Levels & Curriculum" };

export default function LevelsPage() {
  return (
    <section className="section">
      <div className="container-page">
        <h2>Levels & curriculum</h2>
        <p className="lead">Clear pathways so learners know where they start and what they are working toward.</p>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div className="panel">
            <h3 style={{ color: "var(--navy)", marginTop: 0 }}>German & French</h3>
            <p style={{ color: "var(--muted)" }}>CEFR-aligned levels A1, A2, B1, and B2 with speaking, listening, reading, and writing practice.</p>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {["A1", "A2", "B1", "B2"].map((l) => (
                <span key={l} className="level-badge french">
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div className="panel">
            <h3 style={{ color: "var(--navy)", marginTop: 0 }}>English</h3>
            <p style={{ color: "var(--muted)" }}>
              Beginner through Advanced, plus IELTS Preparation and Business English for study and workplace goals.
            </p>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {["Beginner", "Elementary", "Intermediate", "Advanced", "IELTS", "Business"].map((l) => (
                <span key={l} className="level-badge english">
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
