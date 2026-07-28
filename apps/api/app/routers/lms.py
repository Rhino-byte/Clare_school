import json
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session, joinedload

from app.auth import AuthContext, require_roles, require_user
from app.database import get_db
from app.models import (
    Answer,
    ClassAssignment,
    Enrollment,
    ModuleStatus,
    Question,
    QuestionType,
    Submission,
    SubmissionStatus,
    Test,
    User,
    UserRole,
)
from app.schemas import (
    AssignIn,
    GradeAnswerIn,
    QuestionOut,
    SignedUploadIn,
    SubmitTestIn,
    TestIn,
    TestOut,
)
from app.storage import (
    build_object_key,
    create_presigned_download,
    create_presigned_upload,
    get_local_object,
    store_local_object,
)

router = APIRouter()


def _options(raw: str) -> list[str]:
    try:
        data = json.loads(raw or "[]")
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def test_to_out(t: Test, include_answers: bool = False) -> TestOut:
    questions = []
    for q in sorted(t.questions, key=lambda x: x.order_index):
        item = QuestionOut(
            id=q.id,
            question_type=q.question_type.value,
            prompt=q.prompt,
            options=_options(q.options_json),
            audio_prompt_key=q.audio_prompt_key,
            points=q.points,
            order_index=q.order_index,
        )
        questions.append(item)
    return TestOut(
        id=t.id,
        course_id=t.course_id,
        module_id=t.module_id,
        title=t.title,
        instructions=t.instructions,
        status=t.status.value,
        questions=questions,
    )


@router.post("/media/signed-upload")
def signed_upload(
    payload: SignedUploadIn,
    ctx: AuthContext = Depends(require_user),
):
    assert ctx.user
    user_id = ctx.user.id if payload.user_scoped or payload.prefix == "submissions" else None
    if payload.prefix == "submissions" and ctx.user.role != UserRole.student and not payload.user_scoped:
        user_id = ctx.user.id
    key = build_object_key(payload.prefix, payload.filename, user_id=user_id)
    return create_presigned_upload(key, payload.content_type)


@router.get("/media/signed-download")
def signed_download(key: str, ctx: AuthContext = Depends(require_user)):
    assert ctx.user
    # Students may only fetch their own submissions; teachers/admins can fetch any
    if key.startswith("submissions/") and ctx.user.role == UserRole.student:
        if f"/{ctx.user.id}/" not in key:
            raise HTTPException(403, "Not allowed")
    return create_presigned_download(key)


@router.put("/media/local-upload")
async def local_upload(key: str, request: Request):
    data = await request.body()
    store_local_object(key, data)
    return {"ok": True, "key": key}


@router.get("/media/local-download")
def local_download(key: str):
    data = get_local_object(key)
    return Response(content=data, media_type="application/octet-stream")


@router.get("/tests", response_model=list[TestOut])
def list_tests(
    course_id: str | None = None,
    ctx: AuthContext = Depends(require_user),
    db: Session = Depends(get_db),
):
    assert ctx.user
    q = db.query(Test).options(joinedload(Test.questions))
    if course_id:
        q = q.filter(Test.course_id == course_id)
    if ctx.user.role == UserRole.student:
        enrolled = [e.course_id for e in db.query(Enrollment).filter(Enrollment.user_id == ctx.user.id)]
        q = q.filter(Test.course_id.in_(enrolled), Test.status == ModuleStatus.published)
    tests = q.all()
    return [test_to_out(t) for t in tests]


@router.get("/tests/{test_id}", response_model=TestOut)
def get_test(test_id: str, ctx: AuthContext = Depends(require_user), db: Session = Depends(get_db)):
    t = db.query(Test).options(joinedload(Test.questions)).filter(Test.id == test_id).first()
    if not t:
        raise HTTPException(404, "Test not found")
    assert ctx.user
    if ctx.user.role == UserRole.student and t.status != ModuleStatus.published:
        raise HTTPException(403, "Test not published")
    return test_to_out(t)


@router.post("/tests", response_model=TestOut)
def create_test(
    payload: TestIn,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    assert ctx.user
    t = Test(
        course_id=payload.course_id,
        module_id=payload.module_id,
        author_id=ctx.user.id,
        title=payload.title,
        instructions=payload.instructions,
        status=ModuleStatus(payload.status),
    )
    db.add(t)
    db.flush()
    for qi in payload.questions:
        db.add(
            Question(
                test_id=t.id,
                question_type=QuestionType(qi.question_type),
                prompt=qi.prompt,
                options_json=json.dumps(qi.options),
                correct_answer=qi.correct_answer,
                audio_prompt_key=qi.audio_prompt_key,
                points=qi.points,
                order_index=qi.order_index,
            )
        )
    db.commit()
    t = db.query(Test).options(joinedload(Test.questions)).filter(Test.id == t.id).one()
    return test_to_out(t)


@router.put("/tests/{test_id}", response_model=TestOut)
def update_test(
    test_id: str,
    payload: TestIn,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    t = db.query(Test).options(joinedload(Test.questions)).filter(Test.id == test_id).first()
    if not t:
        raise HTTPException(404, "Test not found")
    t.course_id = payload.course_id
    t.module_id = payload.module_id
    t.title = payload.title
    t.instructions = payload.instructions
    t.status = ModuleStatus(payload.status)
    for q in list(t.questions):
        db.delete(q)
    db.flush()
    for qi in payload.questions:
        db.add(
            Question(
                test_id=t.id,
                question_type=QuestionType(qi.question_type),
                prompt=qi.prompt,
                options_json=json.dumps(qi.options),
                correct_answer=qi.correct_answer,
                audio_prompt_key=qi.audio_prompt_key,
                points=qi.points,
                order_index=qi.order_index,
            )
        )
    db.commit()
    t = db.query(Test).options(joinedload(Test.questions)).filter(Test.id == test_id).one()
    return test_to_out(t)


@router.post("/tests/{test_id}/duplicate", response_model=TestOut)
def duplicate_test(
    test_id: str,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    assert ctx.user
    t = db.query(Test).options(joinedload(Test.questions)).filter(Test.id == test_id).first()
    if not t:
        raise HTTPException(404, "Test not found")
    copy = Test(
        course_id=t.course_id,
        module_id=t.module_id,
        author_id=ctx.user.id,
        title=f"{t.title} (Copy)",
        instructions=t.instructions,
        status=ModuleStatus.draft,
    )
    db.add(copy)
    db.flush()
    for q in t.questions:
        db.add(
            Question(
                test_id=copy.id,
                question_type=q.question_type,
                prompt=q.prompt,
                options_json=q.options_json,
                correct_answer=q.correct_answer,
                audio_prompt_key=q.audio_prompt_key,
                points=q.points,
                order_index=q.order_index,
            )
        )
    db.commit()
    copy = db.query(Test).options(joinedload(Test.questions)).filter(Test.id == copy.id).one()
    return test_to_out(copy)


@router.post("/tests/{test_id}/submit")
def submit_test(
    test_id: str,
    payload: SubmitTestIn,
    ctx: AuthContext = Depends(require_user),
    db: Session = Depends(get_db),
):
    assert ctx.user
    t = db.query(Test).options(joinedload(Test.questions)).filter(Test.id == test_id).first()
    if not t or t.status != ModuleStatus.published:
        raise HTTPException(404, "Test not available")

    qmap = {q.id: q for q in t.questions}
    auto_score = 0.0
    max_score = sum(q.points for q in t.questions)
    needs_review = False
    answers: list[Answer] = []

    for ans in payload.answers:
        q = qmap.get(ans.question_id)
        if not q:
            continue
        row = Answer(
            question_id=q.id,
            text_response=ans.text_response,
            audio_key=ans.audio_key,
        )
        if q.question_type in (QuestionType.mcq, QuestionType.true_false):
            correct = (ans.text_response or "").strip().lower() == (q.correct_answer or "").strip().lower()
            row.is_correct = correct
            row.points_awarded = q.points if correct else 0.0
            row.needs_review = False
            auto_score += row.points_awarded or 0.0
        else:
            row.needs_review = True
            needs_review = True
        answers.append(row)

    sub = Submission(
        test_id=t.id,
        user_id=ctx.user.id,
        status=SubmissionStatus.pending_review if needs_review else SubmissionStatus.graded,
        score=None if needs_review else auto_score,
        max_score=max_score,
        graded_at=None if needs_review else datetime.utcnow(),
    )
    db.add(sub)
    db.flush()
    for a in answers:
        a.submission_id = sub.id
        db.add(a)
    db.commit()
    db.refresh(sub)
    return {
        "submission_id": sub.id,
        "status": sub.status.value,
        "score": sub.score,
        "max_score": sub.max_score,
        "message": "Submitted. Some answers await teacher review." if needs_review else "Graded automatically.",
    }


@router.get("/grading/queue")
def grading_queue(
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    subs = (
        db.query(Submission)
        .options(joinedload(Submission.answers), joinedload(Submission.test))
        .filter(Submission.status == SubmissionStatus.pending_review)
        .order_by(Submission.created_at.asc())
        .all()
    )
    result = []
    for s in subs:
        user = db.query(User).filter(User.id == s.user_id).first()
        result.append(
            {
                "submission_id": s.id,
                "test_id": s.test_id,
                "test_title": s.test.title if s.test else "",
                "student_name": user.full_name if user else "",
                "student_email": user.email if user else "",
                "created_at": s.created_at.isoformat(),
                "answers": [
                    {
                        "id": a.id,
                        "question_id": a.question_id,
                        "text_response": a.text_response,
                        "audio_key": a.audio_key,
                        "needs_review": a.needs_review,
                        "points_awarded": a.points_awarded,
                    }
                    for a in s.answers
                    if a.needs_review
                ],
            }
        )
    return result


@router.post("/grading/answers/{answer_id}")
def grade_answer(
    answer_id: str,
    payload: GradeAnswerIn,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    answer = db.query(Answer).filter(Answer.id == answer_id).first()
    if not answer:
        raise HTTPException(404, "Answer not found")
    answer.points_awarded = payload.points_awarded
    answer.teacher_feedback = payload.teacher_feedback
    answer.is_correct = payload.is_correct
    answer.needs_review = False

    sub = db.query(Submission).options(joinedload(Submission.answers)).filter(Submission.id == answer.submission_id).first()
    assert sub
    if all(not a.needs_review for a in sub.answers):
        sub.score = sum(a.points_awarded or 0.0 for a in sub.answers)
        sub.status = SubmissionStatus.graded
        sub.graded_at = datetime.utcnow()
    db.commit()
    return {"ok": True, "submission_status": sub.status.value, "score": sub.score}


@router.get("/gradebook")
def gradebook(
    course_id: str | None = None,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    q = db.query(Submission).options(joinedload(Submission.test), joinedload(Submission.answers))
    if course_id:
        q = q.join(Test).filter(Test.course_id == course_id)
    rows = []
    for s in q.order_by(Submission.created_at.desc()).all():
        user = db.query(User).filter(User.id == s.user_id).first()
        rows.append(
            {
                "submission_id": s.id,
                "student_name": user.full_name if user else "",
                "student_email": user.email if user else "",
                "test_title": s.test.title if s.test else "",
                "course_id": s.test.course_id if s.test else None,
                "status": s.status.value,
                "score": s.score,
                "max_score": s.max_score,
                "graded_at": s.graded_at.isoformat() if s.graded_at else None,
            }
        )
    return rows


@router.get("/me/results")
def my_results(ctx: AuthContext = Depends(require_user), db: Session = Depends(get_db)):
    assert ctx.user
    subs = (
        db.query(Submission)
        .options(joinedload(Submission.test))
        .filter(Submission.user_id == ctx.user.id)
        .order_by(Submission.created_at.desc())
        .all()
    )
    return [
        {
            "submission_id": s.id,
            "test_title": s.test.title if s.test else "",
            "status": s.status.value,
            "score": s.score,
            "max_score": s.max_score,
            "created_at": s.created_at.isoformat(),
        }
        for s in subs
    ]


@router.post("/assignments")
def create_assignment(
    payload: AssignIn,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    assert ctx.user
    row = ClassAssignment(
        course_id=payload.course_id,
        module_id=payload.module_id,
        test_id=payload.test_id,
        assigned_by=ctx.user.id,
    )
    db.add(row)
    db.commit()
    return {"ok": True, "id": row.id}
