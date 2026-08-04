export type LearnerStory = {
  id: string;
  initials: string;
  displayName: string;
  role: string;
  track: string;
  level: string;
  language: "german" | "french" | "english";
  quote: string;
  outcomeTag: string;
};

/** Fabricated marketing stories (not real student PII). */
export const LEARNER_STORIES: LearnerStory[] = [
  {
    id: "s1",
    initials: "AM",
    displayName: "Amina M.",
    role: "Nursing graduate",
    track: "German",
    level: "B1",
    language: "german",
    quote:
      "Speaking practice stopped feeling like theatre. By B1 I could explain my plans and handle travel situations without switching to English mid-sentence.",
    outcomeTag: "Study abroad readiness",
  },
  {
    id: "s2",
    initials: "JK",
    displayName: "James K.",
    role: "Sales associate",
    track: "English",
    level: "Business English",
    language: "english",
    quote:
      "Meetings used to be the scariest part of my week. Role-plays for agendas, feedback, and polite disagreement made workplace English feel usable, not textbook.",
    outcomeTag: "Workplace confidence",
  },
  {
    id: "s3",
    initials: "NW",
    displayName: "Njeri W.",
    role: "Undergraduate applicant",
    track: "English",
    level: "IELTS Preparation",
    language: "english",
    quote:
      "Teachers broke Writing Task 2 into structures I could reuse under time pressure. Mock speaking days made exam day feel practised, not surprising.",
    outcomeTag: "Exam ready",
  },
  {
    id: "s4",
    initials: "DO",
    displayName: "Daniel O.",
    role: "Hospitality trainee",
    track: "French",
    level: "A2",
    language: "french",
    quote:
      "I started at A1 with almost nothing. A2 gave me shopping, directions, and guest phrases I actually use on the floor, not just vocabulary lists.",
    outcomeTag: "Everyday fluency",
  },
  {
    id: "s5",
    initials: "ST",
    displayName: "Sarah T.",
    role: "Project coordinator",
    track: "German",
    level: "B2",
    language: "german",
    quote:
      "B2 pushed me into debate and longer emails. I still make mistakes, but I can argue a case and follow complex discussions without freezing.",
    outcomeTag: "Professional communication",
  },
  {
    id: "s6",
    initials: "BL",
    displayName: "Brian L.",
    role: "First-time learner",
    track: "English",
    level: "Beginner",
    language: "english",
    quote:
      "I was embarrassed to speak at first. Small dialogues and patient correction got me to a confident hello, then full sentences about my routine.",
    outcomeTag: "First conversations",
  },
  {
    id: "s7",
    initials: "FK",
    displayName: "Faith K.",
    role: "Secondary teacher",
    track: "French",
    level: "B1",
    language: "french",
    quote:
      "I needed French for a partnership programme. B1 helped me justify opinions and write connected texts, and suddenly exchanges with partners felt possible.",
    outcomeTag: "Career mobility",
  },
  {
    id: "s8",
    initials: "MO",
    displayName: "Michael O.",
    role: "IT support",
    track: "English",
    level: "Advanced",
    language: "english",
    quote:
      "Advanced was about nuance: tone in emails, handling tough questions in demos, and reading long docs without translating every line.",
    outcomeTag: "Precision & nuance",
  },
];
