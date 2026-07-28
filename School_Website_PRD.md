# Product Requirements Document (PRD)
## St. Clare Language Institute Website
### (A Branch of St. Francis Technical Institute — Nairobi, Kenya)

**Version:** 0.2 (Updated draft)
**Date:** July 28, 2026
**Owner:** [Fill in — Project/Product Owner]
**Status:** Draft

---

## 1. Overview

St. Clare, a branch of St. Francis Technical Institute (Nairobi, Kenya), offers German, French, and English language training under the tagline **"Building Skills. Shaping Futures,"** preparing learners for global education and career opportunities.

The website will serve two audiences at once:

1. **Prospective students / the public** — marketing-facing pages showcasing the institute, its course offerings, and outcomes.
2. **Enrolled students & teachers** — an embedded learning environment where students complete learning modules and tests, and teachers manage that content directly, without needing a developer.

The platform interface language is **English** (the common working language). Course *content* is delivered in **German, French, and English**.

---

## 2. Institute Context (from provided branding materials)

- **Name:** St. Clare — a branch of St. Francis Technical Institute
- **Location:** Nairobi, Kenya
- **Tagline:** "Building Skills. Shaping Futures."
- **Value pillars:** Learn (Quality Education), Grow (Practical Skills), Achieve (Global Standards), Succeed (Better Futures)
- **Courses offered:**
  - **German** — A1, A2, B1, B2
  - **French** — A1, A2, B1, B2
  - **English** — Beginner, Elementary, Intermediate, Advanced, IELTS Preparation, Business English
- **Delivery modes:** Physical and Online classes available
- **Important note from materials:** *All language programs are compulsory in-person* — i.e., even where an online component exists, in-person attendance is a requirement. The site/UX should reflect this.

This reframes the platform as a **language training institute site** (largely adult/young-adult learners pursuing career and further-education goals) rather than a K-12 school. This affects the compliance section below.

---

## 3. Goals & Success Metrics

| Goal | Metric |
|---|---|
| Attract and convert prospective students | Increase inquiry/registration form submissions by X% |
| Give students a working self-serve learning space | X% of enrolled students complete assigned modules monthly |
| Let teachers manage content independently | Teachers publish/edit a module without IT support |
| Serve a trilingual course catalog | 100% of German/French/English course content structured by level (A1-B2 / Beginner-Business English) |
| Support real proficiency development | Students can practice speaking, not just reading/writing |

*(Fill in target numbers once baseline data is available.)*

---

## 4. Users & Personas

| Persona | Needs |
|---|---|
| **Prospective student** | Learn about courses/levels, see pricing/schedule, self-register for a course |
| **Enrolled student** | Log in, view assigned modules, complete lessons and tests (including audio/speaking tasks), track progress |
| **Teacher** | Create/edit/publish learning modules and tests across all levels and languages, review student submissions (incl. audio), track class progress |
| **Administrator** | Manage site-wide settings, accounts, course catalog, published marketing content |
| **IT/Web admin** | Manage technical configuration, integrations, backups |

**Registration model:** Students **self-register** (create their own account, select course/language/level) rather than being provisioned by staff. Registration flow should clearly state the in-person attendance requirement per the "compulsory in-person" policy.

---

## 5. Scope

### 5.1 In Scope

**A. Marketing Website**
- Home, About, Courses (German/French/English), Levels & Curriculum, Schedule/Pricing, Testimonials, Contact/Enrollment pages
- Reflects institute branding (crest/shield logo, navy/gold color scheme, tagline, 4-pillar value section) - see Section 10 for design notes
- Self-registration / enrollment forms per course & level
- SEO basics (meta tags, sitemap, structured data)
- Responsive design (mobile/tablet/desktop)

**B. Learning Modules**
- Structured lessons (text, video, images, audio, embedded files) organized by **language then level** (e.g., French A1, French A2 ... English IELTS Prep, English Business English)
- Progress tracking per student (started/completed/score)

**C. Testing / Assessments**
- Quizzes/tests attached to modules: multiple choice, short answer, **and audio response** (for speaking practice/assessment - important for language proficiency testing, e.g., IELTS speaking-style tasks)
- Auto-grading for objective question types; audio and short-answer responses reviewed/graded by teacher
- Gradebook/results view for teachers; results view for students

**D. Teacher Content Management (CMS)**
- Teacher login with role-based permissions
- Create/edit/delete modules and tests without code, including audio prompt upload and audio-response review
- Rich text/media editor
- Draft vs. published states
- Ability to duplicate/reuse content across levels or classes
- Assign modules/tests to specific classes or student groups

**E. Accounts & Access**
- Roles: Admin, Teacher, Student, (Public/Anonymous)
- **Authentication via Firebase Auth** (email/password, optionally Google sign-in)
- **Self-registration** flow for students (choose language + level at sign-up)

### 5.2 Out of Scope (for v1 - confirm)
- Payment/tuition processing (flag if enrollment requires payment - not yet specified)
- Full LMS features like discussion forums (unless requested)
- Native mobile app (site should be responsive, not a packaged app, for v1)

---

## 6. Functional Requirements

### 6.1 Marketing Site
- FR1: Public pages editable by Admin without code
- FR2: Course catalog page structured by language and level, matching promotional materials (A1-B2 for German/French; Beginner-Business English/IELTS Prep for English)
- FR3: Enrollment/self-registration form captures course, level, and delivery mode (physical/online), with a clear note that in-person attendance is compulsory
- FR4: Contact/inquiry form routes to designated staff email

### 6.2 Learning Modules
- FR5: Teachers can create a module containing text, images, video, audio, and downloadable files
- FR6: Modules organized by language and proficiency level
- FR7: Modules can be set to Draft or Published
- FR8: Students see only modules assigned to their enrolled course/level
- FR9: Student progress (completed, in-progress, not started) tracked and visible to teacher

### 6.3 Testing
- FR10: Teachers can build tests with: multiple choice, true/false, short answer, **and audio-response prompts**
- FR11: Objective question types auto-grade; short answer and audio responses are queued for teacher review
- FR12: Students receive a score/result after grading is complete
- FR13: Teachers can view results per student and per class, including playback of audio submissions

### 6.4 Teacher CMS
- FR14: Teachers log in and see only their own classes/content (Admins see all)
- FR15: WYSIWYG editor for lessons/tests - no code required
- FR16: Teachers can record/upload audio prompts for speaking exercises
- FR17: Teachers can duplicate content across levels

### 6.5 Accounts
- FR18: Students self-register, selecting language(s) and starting level
- FR19: Firebase Authentication handles login/session management for all roles
- FR20: Platform UI text is in English throughout (no UI localization required at this stage)

---

## 7. Non-Functional Requirements

- **Performance:** Public pages load in <2-3s on standard connections
- **Accessibility:** WCAG 2.1 AA compliance where practical
- **Security:** Firebase Auth with proper role-based access rules (Firestore/Storage security rules restricting student/teacher/admin data access)
- **Audio handling:** Reliable audio recording/upload from browser (mobile + desktop); reasonable file size limits and compression
- **Scalability:** Support expected number of students/teachers/concurrent test-takers (fill in numbers)
- **Browser support:** Latest 2 versions of major browsers, mobile responsive
- **Uptime:** Target 99.5%+ during class hours

---

## 8. Compliance & Privacy Considerations

Since St. Clare primarily serves students pursuing further education/career goals (largely adult or young-adult learners) in Kenya:

- Confirm applicability of Kenya's **Data Protection Act (2019)** for handling student personal data
- If any enrolled students are minors, revisit consent/data-handling requirements accordingly
- Since content will rely on **machine translation** initially (see Section 9), include a disclaimer where relevant that some translated content is machine-generated and may be refined over time
- Define data retention policy for audio submissions and test results

*This section should still be reviewed with a legal/compliance contact before build, particularly around audio data storage and retention.*

---

## 9. Content & Localization Approach

- **Platform UI:** English only (confirmed common language for now)
- **Course content:** Authored per language taught (German course content in German, etc.), using **machine translation** as the initial method for any cross-language content needs, with manual review recommended before publishing given this is graded language instruction (MT errors are higher-risk here than in general marketing copy - worth flagging even though MT is the chosen approach)
- **Speaking assessment:** Audio response capture required as a core content/test type across all three languages, particularly relevant for IELTS Preparation and B1/B2-level speaking practice

---

## 10. Branding & Design Notes (from provided flyer)

- Crest/shield logo (navy and gold), open book + cross motif
- Color palette: navy blue, gold/yellow accent, red accent (used for "FRENCH" highlight)
- Bold, high-contrast headline typography; navy banner blocks with white text
- 4-icon feature row: Learn / Grow / Achieve / Succeed, each with a simple line icon
- Course level "badge" style for A1/A2/B1/B2 and English levels (colored pill/tag badges) - consider replicating this as a UI component for the course catalog and student dashboard (progress badges)
- "Physical Classes Only" / "Online Classes" iconography per course - reuse as delivery-mode indicators in the enrollment flow

---

## 11. Technical Stack (Confirmed)

| Layer | Choice |
|---|---|
| Frontend | **Next.js** |
| Backend | **Python** (framework TBD - e.g., FastAPI or Django; FastAPI pairs well with Next.js) |
| Authentication | **Firebase Auth** |
| Database/Storage | TBD - Firebase (Firestore/Storage) would pair naturally with Firebase Auth; alternatively Python backend + separate DB (e.g., Postgres) with Firebase used only for auth. Recommend deciding this next, since it affects how audio files and progress data are stored. |
| Hosting | TBD |
| Audio storage | TBD - likely Firebase Storage or equivalent object storage, given Firebase Auth is already in use |

**Open technical decision:** Whether to keep the whole data layer in Firebase (Firestore + Storage) for simplicity, or use Firebase only for auth and run a separate Python-managed database - this decision should be made before backend work starts.

---

## 12. Timeline (Draft - to be refined with stakeholder input)

| Phase | Deliverable | Estimated Duration |
|---|---|---|
| Phase 1 | Marketing site (institute info, course catalog, self-registration forms) | 3-4 weeks |
| Phase 2 | Auth (Firebase) + student/teacher accounts + basic learning modules (text/media, no testing yet) | 4-6 weeks |
| Phase 3 | Testing engine: multiple choice, short answer, **audio response** + teacher grading/review dashboard | 4-5 weeks |
| Phase 4 | Polish, progress dashboards, QA, machine-translation content pass, launch | 2-3 weeks |

**Total estimated timeline: ~13-18 weeks**, depending on backend architecture decision (Section 11) and content volume (how many modules/tests need to be authored across 3 languages x multiple levels before launch). This is a rough planning estimate - recommend confirming with the actual dev team once the Firebase/DB decision is made.

---

## 13. Resolved Decisions Log

| # | Question | Decision |
|---|---|---|
| 1 | Grade levels/context | Language training institute (St. Clare/St. Francis Technical Institute), not K-12 |
| 2 | Tech stack | Next.js frontend, Python backend, Firebase Authentication |
| 3 | Registration | Students self-register |
| 4 | Platform language | English (common language for now) |
| 5 | Question types | Audio response required, in addition to standard types |
| 6 | Timeline | Draft phased timeline provided (Section 12) - refine with dev team |
| 7 | Translation | Machine translation for content |
| 8 | Branding | Use provided flyer branding (Section 10) |

---

## 14. Remaining Open Questions

1. Data layer: all-Firebase (Firestore/Storage) vs. Firebase Auth + separate Python-managed database?
2. Is there a payment/tuition component to enrollment, or is registration free with payment handled offline?
3. Are any enrolled students minors? (Affects compliance approach in Section 8.)
4. Should machine-translated content be reviewed/approved by a human before publishing, given it's used for actual language instruction?
5. Any existing student/course data to migrate from a current system?
