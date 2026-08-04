import type { Metadata } from "next";
import Link from "next/link";
import { API_URL, languageLabel, type Course } from "@/lib/api";
import { MarketingIntro, RevealItem, RevealList } from "@/components/marketing/MarketingIntro";
import { matchCurriculumLevel } from "@/content/curriculum";

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
    <MarketingIntro
      title="Course catalogue"
      lead="Browse by language, open a level to learn what’s taught, then continue to the full pathway or enrol."
      imageSrc="/images/band-languages.jpg"
      imageAlt="Language immersion study materials"
    >
      {Object.keys(byLang).length === 0 && (
        <div className="notice">
          Start the API to load live catalogue data. Seeded courses appear once `/api/courses` is reachable.
        </div>
      )}
      <RevealList style={{ display: "grid", gap: "2.25rem" }}>
        {Object.entries(byLang).map(([lang, list]) => (
          <RevealItem key={lang}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  color: "var(--navy)",
                  fontFamily: "var(--font-fraunces), Georgia, serif",
                  fontSize: "1.6rem",
                }}
              >
                {languageLabel(lang)}
              </h3>
              <Link href={`/courses/${lang}`} style={{ color: "var(--navy)", fontWeight: 700 }}>
                View pathway →
              </Link>
            </div>
            <div className="course-level-grid">
              {list.map((c) => {
                const cur = matchCurriculumLevel(lang, c.level);
                return (
                  <Link
                    key={c.id}
                    href={`/levels?lang=${lang}&level=${encodeURIComponent(c.level)}`}
                    className="course-level-card"
                  >
                    <span className={`level-badge ${lang}`}>{c.level}</span>
                    <h4>{cur?.headline ?? c.title}</h4>
                    <p>{cur?.summary ?? c.description}</p>
                    <span className="course-level-cta">What’s in this level →</span>
                  </Link>
                );
              })}
            </div>
          </RevealItem>
        ))}
      </RevealList>
    </MarketingIntro>
  );
}
