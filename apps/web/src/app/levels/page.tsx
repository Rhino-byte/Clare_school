import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingIntro } from "@/components/marketing/MarketingIntro";
import { LevelExplorer } from "@/components/marketing/LevelExplorer";
import { API_URL, type Course } from "@/lib/api";

export const metadata: Metadata = { title: "Levels & Curriculum" };

async function getCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API_URL}/api/courses`, { next: { revalidate: 30 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function LevelsPage() {
  const courses = await getCourses();

  return (
    <MarketingIntro
      title="Levels & curriculum"
      lead="Not sure where you fit? Pick a language, open a level that matches your goal, then enrol or ask admissions to confirm placement."
      imageSrc="/images/band-languages.jpg"
      imageAlt="Structured language learning pathway"
    >
      <Suspense fallback={<div className="skeleton" style={{ height: 220 }} />}>
        <LevelExplorer courses={courses} />
      </Suspense>
    </MarketingIntro>
  );
}
