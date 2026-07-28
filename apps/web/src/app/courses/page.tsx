import type { Metadata } from "next";
import Link from "next/link";
import { API_URL, languageLabel, type Course } from "@/lib/api";

export const metadata: Metadata = { title: "Courses" };

async function getCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API_URL}/api/courses`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();
  const byLang = courses.reduce<Record<string, Course[]>>((acc, c) => {
    acc[c.language] = acc[c.language] || [];
    acc[c.language].push(c);
    return acc;
  }, {});

  return (
    <section className="section">
      <div className="container-page">
        <h2>Course catalogue</h2>
        <p className="lead">
          Choose German, French, or English — each structured by proficiency level. Delivery may include online components,
          but in-person attendance is compulsory.
        </p>
        {Object.keys(byLang).length === 0 && (
          <div className="notice">Start the API to load live catalogue data. Seeded courses appear once `/api/courses` is reachable.</div>
        )}
        <div style={{ display: "grid", gap: "2rem" }}>
          {Object.entries(byLang).map(([lang, list]) => (
            <div key={lang}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "1rem" }}>
                <h3 style={{ margin: 0, color: "var(--navy)", fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: "1.6rem" }}>
                  {languageLabel(lang)}
                </h3>
                <Link href={`/courses/${lang}`} style={{ color: "var(--navy)", fontWeight: 700 }}>
                  View pathway →
                </Link>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {list.map((c) => (
                  <span key={c.id} className={`level-badge ${lang}`}>
                    {c.level}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
