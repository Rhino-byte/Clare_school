export type UserRole = "student" | "teacher" | "admin";

export type Language = "german" | "french" | "english";

export type DeliveryMode = "physical" | "online";

export type ModuleStatus = "draft" | "published";

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export type QuestionType =
  | "mcq"
  | "true_false"
  | "short_answer"
  | "audio_response";

export type SubmissionStatus =
  | "in_progress"
  | "submitted"
  | "graded"
  | "pending_review";

export const GERMAN_FRENCH_LEVELS = ["A1", "A2", "B1", "B2"] as const;

export const ENGLISH_LEVELS = [
  "Beginner",
  "Elementary",
  "Intermediate",
  "Advanced",
  "IELTS Preparation",
  "Business English",
] as const;

export const VALUE_PILLARS = [
  { key: "learn", title: "Learn", subtitle: "Quality Education" },
  { key: "grow", title: "Grow", subtitle: "Practical Skills" },
  { key: "achieve", title: "Achieve", subtitle: "Global Standards" },
  { key: "succeed", title: "Succeed", subtitle: "Better Futures" },
] as const;
