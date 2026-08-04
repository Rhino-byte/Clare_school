"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CURRICULUM_LANGUAGES,
  type CurriculumLanguage,
  getLevelsForLanguage,
} from "@/content/curriculum";
import { languageLabel, type Course } from "@/lib/api";
import { LevelCard } from "./LevelCard";

type Props = {
  courses?: Course[];
  initialLang?: string | null;
  initialLevel?: string | null;
};

function normalizeLang(raw: string | null | undefined): CurriculumLanguage {
  const v = (raw || "german").toLowerCase();
  if (v === "french" || v === "english" || v === "german") return v;
  return "german";
}

export function LevelExplorer({ courses = [], initialLang, initialLevel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const langFromUrl = normalizeLang(searchParams.get("lang") || initialLang);
  const levelFromUrl = searchParams.get("level") || initialLevel || "";

  const [lang, setLang] = useState<CurriculumLanguage>(langFromUrl);
  const [expandedLevel, setExpandedLevel] = useState<string | null>(levelFromUrl || null);

  useEffect(() => {
    setLang(langFromUrl);
  }, [langFromUrl]);

  useEffect(() => {
    if (levelFromUrl) setExpandedLevel(levelFromUrl);
  }, [levelFromUrl]);

  const levels = useMemo(() => getLevelsForLanguage(lang), [lang]);

  const courseIdByLevel = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of courses) {
      if (c.language.toLowerCase() === lang) {
        map.set(c.level.toLowerCase(), c.id);
      }
    }
    return map;
  }, [courses, lang]);

  function updateQuery(nextLang: CurriculumLanguage, nextLevel: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLang);
    if (nextLevel) params.set("level", nextLevel);
    else params.delete("level");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function onSelectLang(next: CurriculumLanguage) {
    setLang(next);
    setExpandedLevel(null);
    updateQuery(next, null);
  }

  function onToggle(level: string) {
    const next = expandedLevel === level ? null : level;
    setExpandedLevel(next);
    updateQuery(lang, next);
  }

  return (
    <div className="level-explorer">
      <div className="level-tabs" role="tablist" aria-label="Language">
        {CURRICULUM_LANGUAGES.map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={lang === l}
            className={`level-tab ${lang === l ? "is-active" : ""}`}
            onClick={() => onSelectLang(l)}
          >
            {languageLabel(l)}
          </button>
        ))}
      </div>

      <p className="level-explorer-lead">
        {lang === "english"
          ? "Tap Beginner through Advanced, or IELTS / Business, to see what’s inside and how to join."
          : "Tap a level to see what you’ll learn, who it’s for, and how to enrol."}
      </p>

      <div className="level-card-grid">
        {levels.map((item) => {
          const courseId = courseIdByLevel.get(item.level.toLowerCase());
          return (
            <LevelCard
              key={`${item.language}-${item.level}`}
              item={item}
              expanded={expandedLevel?.toLowerCase() === item.level.toLowerCase()}
              onToggle={() => onToggle(item.level)}
              enrolHref={courseId ? `/register?course=${courseId}` : null}
            />
          );
        })}
      </div>
    </div>
  );
}
