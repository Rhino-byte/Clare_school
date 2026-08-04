import type { Metadata } from "next";
import Link from "next/link";
import { MarketingIntro, RevealItem, RevealList } from "@/components/marketing/MarketingIntro";
import { LEARNER_STORIES } from "@/content/stories";

export const metadata: Metadata = { title: "Learner stories" };

export default function TestimonialsPage() {
  return (
    <MarketingIntro
      title="Learner stories"
      lead="Read how learners used these programmes, then follow a story into the matching level if you want the same path."
      imageSrc="/images/band-stories.jpg"
      imageAlt="St. Clare learners celebrating progress"
    >
      <RevealList className="story-grid">
        {LEARNER_STORIES.map((s) => (
          <RevealItem key={s.id}>
            <article className="story-card">
              <span className="story-outcome-tag">{s.outcomeTag}</span>
              <blockquote className="story-card-quote">&ldquo;{s.quote}&rdquo;</blockquote>
              <div className="story-card-meta">
                <span className="story-avatar" aria-hidden>
                  {s.initials}
                </span>
                <div>
                  <strong>{s.displayName}</strong>
                  <span>
                    {s.role} · {s.track} {s.level}
                  </span>
                </div>
              </div>
              <Link
                href={`/levels?lang=${s.language}&level=${encodeURIComponent(s.level)}`}
                style={{ color: "var(--navy)", fontWeight: 700, fontSize: "0.9rem" }}
              >
                Explore this level →
              </Link>
            </article>
          </RevealItem>
        ))}
      </RevealList>
    </MarketingIntro>
  );
}
