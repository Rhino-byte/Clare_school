import type { Metadata } from "next";
import Link from "next/link";
import { API_URL, languageLabel, type Course } from "@/lib/api";
import { MarketingIntro, RevealItem, RevealList } from "@/components/marketing/MarketingIntro";
import { matchCurriculumLevel } from "@/content/curriculum";

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
    <MarketingIntro
      title={`${languageLabel(language)} pathway`}
      lead="Compare levels below. Enrol when you’re ready, or open the full curriculum if you want more detail first."
      imageSrc="/images/band-languages.jpg"
      imageAlt={`${languageLabel(language)} language pathway`}
    >
      {courses.length === 0 && (
        <div className="notice">No courses found for this language. Confirm the API is running.</div>
      )}
      <RevealList style={{ display: "grid", gap: "1rem" }}>
        {courses.map((c) => {
          const cur = matchCurriculumLevel(language, c.level);
          return (
            <RevealItem key={c.id}>
              <article className="panel" style={{ display: "grid", gap: "0.85rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <h3 style={{ margin: 0, color: "var(--navy)" }}>{cur?.headline ?? c.title}</h3>
                  <span className={`level-badge ${language}`}>{c.level}</span>
                  <span className="level-badge">Physical</span>
                  <span className="level-badge english">Online component</span>
                </div>
                <p style={{ margin: 0, color: "var(--muted)", lineHeight: 1.55 }}>
                  {cur?.summary ?? c.description}
                </p>
                {cur && (
                  <ul style={{ margin: 0, paddingLeft: "1.15rem", color: "var(--muted)", lineHeight: 1.5 }}>
                    {cur.outcomes.slice(0, 3).map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
                  <Link href={`/register?course=${c.id}`} className="btn btn-navy" style={{ padding: "0.55rem 1rem" }}>
                    Enrol in {c.level}
                  </Link>
                  <Link
                    href={`/levels?lang=${language}&level=${encodeURIComponent(c.level)}`}
                    style={{ color: "var(--navy)", fontWeight: 700 }}
                  >
                    Open full level guide →
                  </Link>
                </div>
              </article>
            </RevealItem>
          );
        })}
      </RevealList>
    </MarketingIntro>
  );
}
