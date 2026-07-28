from sqlalchemy.orm import Session

from app.models import (
    Course,
    Language,
    MarketingPage,
    Module,
    ModuleStatus,
    Question,
    QuestionType,
    Test,
    User,
    UserRole,
)


GERMAN_FRENCH = ["A1", "A2", "B1", "B2"]
ENGLISH = [
    "Beginner",
    "Elementary",
    "Intermediate",
    "Advanced",
    "IELTS Preparation",
    "Business English",
]


def seed_catalog(db: Session) -> None:
    if db.query(Course).count() == 0:
        for level in GERMAN_FRENCH:
            db.add(
                Course(
                    language=Language.german,
                    level=level,
                    title=f"German {level}",
                    description=f"German language training at CEFR level {level}. Physical attendance is compulsory.",
                )
            )
            db.add(
                Course(
                    language=Language.french,
                    level=level,
                    title=f"French {level}",
                    description=f"French language training at CEFR level {level}. Physical attendance is compulsory.",
                )
            )
        for level in ENGLISH:
            db.add(
                Course(
                    language=Language.english,
                    level=level,
                    title=f"English — {level}",
                    description=(
                        f"English programme: {level}. Physical attendance is compulsory even when an online "
                        "component is offered."
                    ),
                )
            )

    if db.query(MarketingPage).count() == 0:
        pages = [
            (
                "about",
                "About St. Clare Language Institute",
                "St. Clare Language Institute is a branch of St. Francis Technical Institute / "
                "St. Clare Vocational College in Nairobi, Kenya. We provide professional German, French, "
                "and English training for education, employment, migration, and international communication. "
                "Tagline: **Building Skills. Shaping Futures.** "
                "Support includes career guidance, digital/LMS learning, and Goethe & ÖSD exam preparation. "
                "Student housing is available at St. Clare’s Girls Hostels. "
                "Contact: +254 722 595 645 / +254 786 566 994 · st.clarehostels@gmail.com",
            ),
            (
                "schedule-pricing",
                "Schedule & Pricing",
                "Class schedules and tuition details are confirmed at enrolment. "
                "Tuition is handled offline with admissions staff. Online registration reserves your place.",
            ),
            (
                "testimonials",
                "Testimonials",
                '"The speaking practice prepared me for real conversations abroad." — Alumni, German B1\n\n'
                '"Teachers made IELTS speaking feel manageable." — Alumni, IELTS Preparation',
            ),
        ]
        for slug, title, body in pages:
            db.add(MarketingPage(slug=slug, title=title, body_md=body))

    demos = [
        ("dev-admin", "admin@stclare.local", "Site Admin", UserRole.admin),
        ("dev-teacher", "teacher@stclare.local", "Lead Teacher", UserRole.teacher),
        ("dev-student", "student@stclare.local", "Demo Student", UserRole.student),
    ]
    for uid, email, name, role in demos:
        if not db.query(User).filter(User.firebase_uid == uid).first():
            db.add(User(firebase_uid=uid, email=email, full_name=name, role=role))

    db.commit()

    if db.query(Module).count() == 0:
        course = db.query(Course).filter(Course.language == Language.german, Course.level == "A1").first()
        teacher = db.query(User).filter(User.role == UserRole.teacher).first()
        if course and teacher:
            import json

            db.add(
                Module(
                    course_id=course.id,
                    author_id=teacher.id,
                    title="Greetings & Introductions",
                    summary="Learn basic German greetings and how to introduce yourself.",
                    content_json=json.dumps(
                        [
                            {
                                "type": "text",
                                "body": "Guten Tag! Wie heißen Sie?\n\n"
                                "Note: Some lesson wording may begin as machine-translated drafts and is reviewed "
                                "by instructors before publishing.",
                            },
                            {"type": "text", "body": "Practice saying your name and where you are from."},
                        ]
                    ),
                    status=ModuleStatus.published,
                    order_index=1,
                )
            )
            db.commit()

    if db.query(Test).count() == 0:
        course = db.query(Course).filter(Course.language == Language.german, Course.level == "A1").first()
        teacher = db.query(User).filter(User.role == UserRole.teacher).first()
        module = db.query(Module).first()
        if course and teacher:
            test = Test(
                course_id=course.id,
                module_id=module.id if module else None,
                author_id=teacher.id,
                title="German A1 — Greetings check",
                instructions="Answer the questions. Record a short spoken introduction for the speaking task.",
                status=ModuleStatus.published,
            )
            db.add(test)
            db.flush()
            db.add(
                Question(
                    test_id=test.id,
                    question_type=QuestionType.mcq,
                    prompt="What does 'Guten Tag' mean?",
                    options_json='["Good day", "Goodbye", "Thank you"]',
                    correct_answer="Good day",
                    points=1,
                    order_index=0,
                )
            )
            db.add(
                Question(
                    test_id=test.id,
                    question_type=QuestionType.true_false,
                    prompt="'Auf Wiedersehen' is a greeting used when meeting someone.",
                    options_json='["True", "False"]',
                    correct_answer="False",
                    points=1,
                    order_index=1,
                )
            )
            db.add(
                Question(
                    test_id=test.id,
                    question_type=QuestionType.short_answer,
                    prompt="Write one sentence introducing your name in German.",
                    options_json="[]",
                    correct_answer="",
                    points=2,
                    order_index=2,
                )
            )
            db.add(
                Question(
                    test_id=test.id,
                    question_type=QuestionType.audio_response,
                    prompt="Record yourself saying: Hallo, ich heiße … und ich komme aus …",
                    options_json="[]",
                    correct_answer="",
                    points=3,
                    order_index=3,
                )
            )
            db.commit()
