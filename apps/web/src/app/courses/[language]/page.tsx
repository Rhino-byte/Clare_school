import type { Metadata } from "next";
import Link from "next/link";
import { API_URL, languageLabel, type Course } from "@/lib/api";

type Props = { params: Promise<{ language: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { language } = await params;
  return { title: `${languageLabel(language)} courses` };
}

async function getCourses(language: string): Promise<Course[]> {
  try {
    const res = await fetch(`${API_URL}/api/courses?language=${language}`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function LanguageCoursesPage({ params }: Props) {
  const { language } = await params;
  const courses = await getCourses(language);

  return (
    <section className="section">
      <div className="container-page">
        <h2>{languageLabel(language)}</h2>
        <p className="lead">Levels offered at St. Clare. Register for a level that matches your goals.</p>
        <div style={{ display: "grid", gap: "1rem" }}>
          {courses.map((c) => (
            <article key={c.id} className="panel" style={{ display: "grid", gap: "0.75rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <h3 style={{ margin: 0, color: "var(--navy)" }}>{c.title}</h3>
                <span className={`level-badge ${language}`}>{c.level}</span>
                <span className="level-badge">Physical</span>
                <span className="level-badge english">Online component</span>
              </div>
              <p style={{ margin: 0, color: "var(--muted)" }}>{c.description}</p>
              <div>
                <Link href={`/register?course=${c.id}`} className="btn btn-navy" style={{ padding: "0.55rem 1rem" }}>
                  Enrol in {c.level}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
