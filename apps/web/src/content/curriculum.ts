/**
 * Marketing curriculum copy aligned to public CEFR / English level guides.
 * Soft ops notes only - no invented fees, intake dates, or class hours.
 */

export type CurriculumLanguage = "german" | "french" | "english";

export type CurriculumModule = {
  title: string;
  topics: string[];
};

export type LevelCurriculum = {
  language: CurriculumLanguage;
  level: string;
  headline: string;
  summary: string;
  outcomes: string[];
  skills: string[];
  modules: CurriculumModule[];
  whoFor: string[];
  requirements: string[];
  pathways: string[];
  durationNote: string;
  modeNote: string;
  storyHook?: string;
};

const SOFT_DURATION = "Duration and pacing are confirmed at enrolment with admissions.";
const SOFT_MODE =
  "In-person attendance is compulsory; online components may support study between classes.";

function cefrLevel(
  language: "german" | "french",
  level: "A1" | "A2" | "B1" | "B2",
  langLabel: string,
): LevelCurriculum {
  const shared = {
    language,
    level,
    durationNote: SOFT_DURATION,
    modeNote: SOFT_MODE,
  } as const;

  if (level === "A1") {
    return {
      ...shared,
      headline: `${langLabel} A1: First steps`,
      summary: `Understand and use familiar everyday expressions and very basic phrases for concrete needs in ${langLabel}.`,
      outcomes: [
        "Introduce yourself and others with basic personal details",
        "Ask and answer simple questions about where you live, people you know, and things you have",
        "Interact slowly when the other person speaks clearly and is willing to help",
        "Recognise familiar words on signs, forms, and short notices",
      ],
      skills: ["Speaking", "Listening", "Reading", "Writing"],
      modules: [
        {
          title: "Module 1: Greetings & identity",
          topics: ["Hello / goodbye routines", "Names and nationalities", "Numbers and dates", "Alphabet and spelling"],
        },
        {
          title: "Module 2: Daily life basics",
          topics: ["Family and friends", "Home and neighbourhood", "Food and drinks", "Telling the time"],
        },
        {
          title: "Module 3: Getting around",
          topics: ["Directions and places in town", "Shopping phrases", "Public transport words", "Simple requests for help"],
        },
        {
          title: "Module 4: First conversations",
          topics: ["Short dialogues", "Listening for key words", "Writing a simple postcard or message", "Pronunciation foundations"],
        },
      ],
      whoFor: [
        "Absolute beginners with little or no prior study",
        "Learners preparing for travel or first contact with the language",
        "Students who need a clear CEFR starting point before A2",
      ],
      requirements: [
        "No prior language level required",
        "Willingness to practise speaking in class",
        "Basic literacy in your first language",
      ],
      pathways: ["Progress to A2", "Everyday survival communication", "Foundation for Goethe / DELF-style pathways later"],
      storyHook: "From zero to first real conversations",
    };
  }

  if (level === "A2") {
    return {
      ...shared,
      headline: `${langLabel} A2: Everyday independence`,
      summary: `Handle simple, routine exchanges and describe your background and immediate environment in ${langLabel}.`,
      outcomes: [
        "Understand frequently used expressions about personal and family information, shopping, and local geography",
        "Communicate in simple routine tasks requiring a direct exchange of information",
        "Describe aspects of your background and matters of immediate need in simple terms",
        "Follow short, clear announcements and write brief notes or messages",
      ],
      skills: ["Speaking", "Listening", "Reading", "Writing"],
      modules: [
        {
          title: "Module 1: Routines & habits",
          topics: ["Daily schedules", "Work and studies", "Hobbies and free time", "Present and past basics"],
        },
        {
          title: "Module 2: Shopping & services",
          topics: ["Shops and markets", "Ordering food", "Health and body", "Making appointments"],
        },
        {
          title: "Module 3: Travel & places",
          topics: ["Travel plans", "Hotels and lodging", "Weather and seasons", "Describing your town"],
        },
        {
          title: "Module 4: Stories & messages",
          topics: ["Short personal narratives", "Email and SMS style", "Listening for detail", "Classroom presentations"],
        },
      ],
      whoFor: [
        "Learners who completed A1 or equivalent placement",
        "People who need practical language for daily life abroad",
        "Students building toward independent B1 use",
      ],
      requirements: [
        "Solid A1 can-do skills or placement confirmation",
        "Regular class attendance and homework practice",
      ],
      pathways: ["Progress to B1", "More confident travel and social talk", "Stronger reading of everyday texts"],
      storyHook: "Routine situations start to feel manageable",
    };
  }

  if (level === "B1") {
    return {
      ...shared,
      headline: `${langLabel} B1: Confident independence`,
      summary: `Deal with most situations while travelling, produce connected text on familiar topics, and explain opinions and plans in ${langLabel}.`,
      outcomes: [
        "Understand the main points of clear standard input on familiar matters at work, school, and leisure",
        "Handle most situations likely to arise while travelling where the language is spoken",
        "Produce simple connected text on topics that are familiar or of personal interest",
        "Describe experiences, hopes, and ambitions and briefly give reasons for opinions",
      ],
      skills: ["Speaking", "Listening", "Reading", "Writing"],
      modules: [
        {
          title: "Module 1: Work, study & goals",
          topics: ["Education and careers", "CV-style self-description", "Future plans", "Formal vs informal register"],
        },
        {
          title: "Module 2: Opinions & discussion",
          topics: ["Agreeing and disagreeing", "Media and culture", "Environment and society", "Justifying a viewpoint"],
        },
        {
          title: "Module 3: Travel & problem-solving",
          topics: ["Complaints and requests", "Narrating past events", "Instructions and advice", "Phone and email exchanges"],
        },
        {
          title: "Module 4: Connected writing & speaking",
          topics: ["Short essays and reports", "Structured presentations", "Listening to longer dialogues", "Exam-style tasks where relevant"],
        },
      ],
      whoFor: [
        "Learners aiming for independent everyday and workplace communication",
        "Candidates preparing for study or migration pathways that expect B1",
        "Students ready to move beyond survival phrases",
      ],
      requirements: [
        "A2 completion or equivalent placement",
        "Comfortable producing short spoken turns in class",
      ],
      pathways: [
        "Progress to B2",
        "Stronger workplace and study readiness",
        "Preparation track toward recognised exams (e.g. Goethe / DELF-style)",
      ],
      storyHook: "Opinions and travel situations become real",
    };
  }

  return {
    ...shared,
    headline: `${langLabel} B2: Fluent & nuanced`,
    summary: `Interact with fluency on concrete and abstract topics, argue a case, and understand the main ideas of complex texts in ${langLabel}.`,
    outcomes: [
      "Understand the main ideas of complex texts on concrete and abstract topics, including technical discussion in your field",
      "Interact with native speakers with a degree of fluency and spontaneity",
      "Produce clear, detailed text on a wide range of subjects",
      "Explain a viewpoint on current issues, giving advantages and disadvantages",
    ],
    skills: ["Speaking", "Listening", "Reading", "Writing"],
    modules: [
      {
        title: "Module 1: Complex input",
        topics: ["Longer articles and reports", "Nuanced listening", "Idioms and fixed phrases", "Register and tone"],
      },
      {
        title: "Module 2: Argument & debate",
        topics: ["Structuring formal speech", "Pros and cons", "Persuasion techniques", "Responding under pressure"],
      },
      {
        title: "Module 3: Professional & academic use",
        topics: ["Meetings and discussions", "Emails and proposals", "Summarising sources", "Field-specific vocabulary"],
      },
      {
        title: "Module 4: Independent production",
        topics: ["Extended essays", "Presentations with Q&A", "Critical reading", "Mock exam practice where relevant"],
      },
    ],
    whoFor: [
      "Learners who need near-independent professional or academic language use",
      "Candidates targeting university or workplace requirements around B2",
      "Students refining accuracy and rhetorical skill after B1",
    ],
    requirements: [
      "B1 completion or equivalent placement",
      "Willingness to engage in extended speaking and writing tasks",
    ],
    pathways: [
      "Exam readiness (Goethe / DELF-style B2 tracks)",
      "Study and employment abroad with greater confidence",
      "Continued refinement toward advanced use",
    ],
    storyHook: "Debate and professional talk without panic",
  };
}

const ENGLISH_LEVELS: LevelCurriculum[] = [
  {
    language: "english",
    level: "Beginner",
    headline: "English Beginner: First contact",
    summary: "Read and speak in simple everyday situations using short sentences and core vocabulary.",
    outcomes: [
      "Use greetings, numbers, colours, days, and basic personal details",
      "Talk about family, routines, food, clothes, and places around you",
      "Understand slow, clear speech on familiar topics",
      "Write very short sentences about yourself",
    ],
    skills: ["Speaking", "Listening", "Reading", "Writing"],
    modules: [
      {
        title: "Module 1: Foundations",
        topics: ["Alphabet and sounds", "Greetings and introductions", "Numbers and time", "Classroom English"],
      },
      {
        title: "Module 2: People & places",
        topics: ["Family and jobs", "Home and city", "Food and shopping", "Directions"],
      },
      {
        title: "Module 3: Daily English",
        topics: ["Present simple routines", "Weather and seasons", "Hobbies", "Simple questions"],
      },
      {
        title: "Module 4: First fluency",
        topics: ["Short dialogues", "Listening for key words", "Guided writing", "Pronunciation practice"],
      },
    ],
    whoFor: ["Absolute beginners", "Learners returning after a long break", "Students who need a gentle entry before Elementary"],
    requirements: ["No prior English required", "Commitment to speak in class"],
    pathways: ["Move to Elementary", "Everyday survival English", "Foundation for school or work English later"],
    durationNote: SOFT_DURATION,
    modeNote: SOFT_MODE,
    storyHook: "The first confident hello in English",
  },
  {
    language: "english",
    level: "Elementary",
    headline: "English Elementary: Broader everyday use",
    summary: "Expand beyond basics into travel, shopping, health, work, and short social conversations.",
    outcomes: [
      "Communicate in routine situations with frequently used expressions",
      "Describe surroundings and immediate needs more clearly",
      "Handle short exchanges about travel, health, studies, and free time",
      "Write short messages and simple paragraphs",
    ],
    skills: ["Speaking", "Listening", "Reading", "Writing"],
    modules: [
      {
        title: "Module 1: Expanding grammar",
        topics: ["Past and future basics", "Comparisons", "Countable / uncountable", "Question forms"],
      },
      {
        title: "Module 2: Life outside class",
        topics: ["Travel and transport", "Shopping and services", "Health and lifestyle", "Technology basics"],
      },
      {
        title: "Module 3: Social English",
        topics: ["Invitations and plans", "Opinions in simple form", "Stories about the past", "Phone messages"],
      },
      {
        title: "Module 4: Connected skills",
        topics: ["Short reading passages", "Listening for detail", "Paragraph writing", "Mini presentations"],
      },
    ],
    whoFor: ["Learners who finished Beginner or place at A2-ish", "People needing practical English for daily life"],
    requirements: ["Beginner completion or placement", "Regular practice outside class"],
    pathways: ["Progress to Intermediate", "Stronger social and travel English"],
    durationNote: SOFT_DURATION,
    modeNote: SOFT_MODE,
    storyHook: "Routine English without freezing",
  },
  {
    language: "english",
    level: "Intermediate",
    headline: "English Intermediate: Independent communication",
    summary: "Interact on familiar subjects, join discussions, and write connected texts about interests and work.",
    outcomes: [
      "Understand information about familiar topics in clear standard English",
      "Communicate in most situations while travelling in English-speaking contexts",
      "Write simple connected texts on familiar topics",
      "Take part in meetings or discussions with support and preparation",
    ],
    skills: ["Speaking", "Listening", "Reading", "Writing"],
    modules: [
      {
        title: "Module 1: Fluency building",
        topics: ["Narrating experience", "Giving reasons and explanations", "Agreeing and disagreeing", "Discourse markers"],
      },
      {
        title: "Module 2: Work & study English",
        topics: ["Education and careers", "Emails and reports", "Online meetings language", "Problem-solving talk"],
      },
      {
        title: "Module 3: Global topics",
        topics: ["Culture and media", "Travel and cities", "Relationships and lifestyle", "News listening"],
      },
      {
        title: "Module 4: Accuracy & range",
        topics: ["Tense review", "Conditionals introduction", "Longer writing tasks", "Presentation skills"],
      },
    ],
    whoFor: ["Learners ready for independent everyday and workplace English", "Students preparing for Advanced or exam tracks"],
    requirements: ["Elementary completion or placement", "Willingness to speak at length in class"],
    pathways: ["Progress to Advanced", "Bridge into IELTS or Business English"],
    durationNote: SOFT_DURATION,
    modeNote: SOFT_MODE,
    storyHook: "Speaking up in meetings and travel",
  },
  {
    language: "english",
    level: "Advanced",
    headline: "English Advanced: Precision & nuance",
    summary: "Express complex ideas with fluency, understand long texts, and use English flexibly in social, academic, and professional settings.",
    outcomes: [
      "Understand a wide range of demanding, longer texts",
      "Express yourself fluently and spontaneously without much searching for expressions",
      "Use language flexibly for social, academic, and professional purposes",
      "Produce clear, well-structured, detailed text on complex subjects",
    ],
    skills: ["Speaking", "Listening", "Reading", "Writing"],
    modules: [
      {
        title: "Module 1: Sophisticated input",
        topics: ["Long-form reading", "Lectures and podcasts", "Implicit meaning", "Idioms and collocations"],
      },
      {
        title: "Module 2: High-stakes speaking",
        topics: ["Debate and persuasion", "Interviews", "Public speaking", "Handling interruption and nuance"],
      },
      {
        title: "Module 3: Professional & academic writing",
        topics: ["Essays and proposals", "Summarising and paraphrasing", "Tone and register", "Editing for clarity"],
      },
      {
        title: "Module 4: Mastery practice",
        topics: ["Complex grammar fine-tuning", "Vocabulary depth", "Case discussions", "Mock performance tasks"],
      },
    ],
    whoFor: ["Confident Intermediate graduates", "Professionals needing polished English", "Learners preparing for demanding study or leadership roles"],
    requirements: ["Intermediate completion or placement", "Comfort with extended speaking and writing"],
    pathways: ["IELTS Preparation", "Business English specialisation", "High-stakes professional communication"],
    durationNote: SOFT_DURATION,
    modeNote: SOFT_MODE,
    storyHook: "Nuance, debate, and boardroom English",
  },
  {
    language: "english",
    level: "IELTS Preparation",
    headline: "IELTS Preparation: Exam-ready skills",
    summary: "Build academic reading, writing, listening, and speaking strategies aimed at the IELTS test format.",
    outcomes: [
      "Apply skimming, scanning, and time management to Reading passages",
      "Plan and write Task 1 and Task 2 responses with clearer structure",
      "Practise Listening for detail, gist, and map/diagram tasks",
      "Deliver Speaking Part 1-3 answers with stronger fluency and coherence",
    ],
    skills: ["Speaking", "Listening", "Reading", "Writing"],
    modules: [
      {
        title: "Module 1: Test overview & strategy",
        topics: ["Band descriptors", "Timing and pacing", "Common traps", "Diagnostic practice"],
      },
      {
        title: "Module 2: Reading & Listening",
        topics: ["Question types", "Note completion", "Matching headings", "Multiple choice tactics"],
      },
      {
        title: "Module 3: Writing",
        topics: ["Task 1 graphs and processes", "Task 2 essay structures", "Cohesion and vocabulary", "Teacher feedback loops"],
      },
      {
        title: "Module 4: Speaking & mocks",
        topics: ["Part 2 long turn", "Part 3 discussion", "Pronunciation and fluency", "Full mock exams"],
      },
    ],
    whoFor: [
      "Learners targeting study or migration pathways that require IELTS",
      "Students with Intermediate+ English who need exam technique",
    ],
    requirements: [
      "Solid Intermediate English or placement recommendation",
      "Commitment to timed practice outside class",
    ],
    pathways: ["University applications", "Visa / study-abroad documentation", "Continued Advanced English"],
    durationNote: SOFT_DURATION,
    modeNote: SOFT_MODE,
    storyHook: "Exam day feels practised, not surprising",
  },
  {
    language: "english",
    level: "Business English",
    headline: "Business English: Workplace communication",
    summary: "Develop meetings, negotiations, presentations, and professional writing for real workplace goals.",
    outcomes: [
      "Participate more confidently in meetings and conference calls",
      "Deliver clearer presentations and handle questions",
      "Write professional emails, enquiries, and short reports",
      "Use vocabulary for organisations, careers, projects, and feedback",
    ],
    skills: ["Speaking", "Listening", "Reading", "Writing"],
    modules: [
      {
        title: "Module 1: The workplace",
        topics: ["Company structures", "Roles and departments", "Career stories", "Networking language"],
      },
      {
        title: "Module 2: Meetings & collaboration",
        topics: ["Agendas and turn-taking", "Agreeing and disagreeing", "Giving feedback", "Project updates"],
      },
      {
        title: "Module 3: Presenting & persuading",
        topics: ["Presentation structure", "Visuals and clarity", "Negotiating politely", "Handling objections"],
      },
      {
        title: "Module 4: Professional writing",
        topics: ["Emails and memos", "Enquiries and complaints", "CVs and cover letters", "Interview practice"],
      },
    ],
    whoFor: [
      "Working professionals and job seekers",
      "Students preparing for internships or international teams",
      "Learners who need workplace English beyond general conversation",
    ],
    requirements: [
      "Intermediate English or placement recommendation",
      "Willingness to role-play workplace scenarios in class",
    ],
    pathways: ["Stronger employability", "Internal promotion readiness", "Complement to Advanced or IELTS tracks"],
    durationNote: SOFT_DURATION,
    modeNote: SOFT_MODE,
    storyHook: "Meetings and emails without second-guessing",
  },
];

export const CURRICULUM: LevelCurriculum[] = [
  ...(["A1", "A2", "B1", "B2"] as const).map((l) => cefrLevel("german", l, "German")),
  ...(["A1", "A2", "B1", "B2"] as const).map((l) => cefrLevel("french", l, "French")),
  ...ENGLISH_LEVELS,
];

export const CURRICULUM_LANGUAGES: CurriculumLanguage[] = ["german", "french", "english"];

export function getLevelsForLanguage(language: CurriculumLanguage): LevelCurriculum[] {
  return CURRICULUM.filter((c) => c.language === language);
}

export function findCurriculum(language: string, level: string): LevelCurriculum | undefined {
  const lang = language.toLowerCase() as CurriculumLanguage;
  return CURRICULUM.find(
    (c) => c.language === lang && c.level.toLowerCase() === level.toLowerCase(),
  );
}

/** Map API English short labels (IELTS / Business) to curriculum keys if needed */
export function matchCurriculumLevel(language: string, apiLevel: string): LevelCurriculum | undefined {
  const direct = findCurriculum(language, apiLevel);
  if (direct) return direct;
  if (language.toLowerCase() === "english") {
    const aliases: Record<string, string> = {
      ielts: "IELTS Preparation",
      business: "Business English",
    };
    const key = aliases[apiLevel.toLowerCase()];
    if (key) return findCurriculum("english", key);
  }
  return undefined;
}
