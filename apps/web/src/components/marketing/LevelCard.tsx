"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { LevelCurriculum } from "@/content/curriculum";

type Props = {
  item: LevelCurriculum;
  expanded: boolean;
  onToggle: () => void;
  enrolHref?: string | null;
};

export function LevelCard({ item, expanded, onToggle, enrolHref }: Props) {
  const badgeClass =
    item.language === "french" ? "french" : item.language === "english" ? "english" : "";

  return (
    <article className={`level-card ${expanded ? "is-expanded" : ""}`}>
      <button type="button" className="level-card-trigger" onClick={onToggle} aria-expanded={expanded}>
        <div className="level-card-top">
          <span className={`level-badge ${badgeClass}`}>{item.level}</span>
          <span className="level-card-chevron" aria-hidden>
            {expanded ? "−" : "+"}
          </span>
        </div>
        <h3 className="level-card-title">{item.headline}</h3>
        <p className="level-card-summary">{item.summary}</p>
        <div className="level-card-skills">
          {item.skills.map((s) => (
            <span key={s} className="level-skill-chip">
              {s}
            </span>
          ))}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            className="level-card-detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="level-card-detail-inner">
              <div className="level-ops-strip">
                <div>
                  <strong>Duration</strong>
                  <p>{item.durationNote}</p>
                </div>
                <div>
                  <strong>Mode</strong>
                  <p>{item.modeNote}</p>
                </div>
                <div>
                  <strong>Next step</strong>
                  <p>Ready to join? Enrol online, or contact admissions to confirm your level and schedule.</p>
                </div>
              </div>

              <section className="level-detail-block">
                <h4>What will you learn?</h4>
                <ul>
                  {item.outcomes.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </section>

              <section className="level-detail-block">
                <h4>Who is this for?</h4>
                <ul>
                  {item.whoFor.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </section>

              <section className="level-detail-block">
                <h4>Requirements</h4>
                <ul>
                  {item.requirements.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </section>

              <section className="level-detail-block">
                <h4>Course curriculum</h4>
                <div className="level-modules">
                  {item.modules.map((m, idx) => (
                    <div key={m.title} className="level-module">
                      <h5>
                        <span className="level-module-index">{idx + 1}</span>
                        {m.title.replace(/^Module \d+:\s*/, "")}
                      </h5>
                      <ul>
                        {m.topics.map((t) => (
                          <li key={t}>{t}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <section className="level-detail-block">
                <h4>Pathways after this level</h4>
                <ul>
                  {item.pathways.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </section>

              <div className="level-card-ctas">
                {enrolHref ? (
                  <Link href={enrolHref} className="btn btn-navy" style={{ padding: "0.55rem 1rem" }}>
                    Enrol in {item.level}
                  </Link>
                ) : (
                  <Link href="/contact" className="btn btn-navy" style={{ padding: "0.55rem 1rem" }}>
                    Enquire about {item.level}
                  </Link>
                )}
                <Link href={`/courses/${item.language}`} className="level-card-secondary-link">
                  View {item.language} pathway →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
