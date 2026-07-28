import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import AuthContext, get_auth_context, require_roles, require_user
from app.database import get_db
from app.models import (
    Course,
    DeliveryMode,
    Enrollment,
    MarketingPage,
    Module,
    ModuleProgress,
    ModuleStatus,
    ProgressStatus,
    User,
    UserRole,
)
from app.schemas import (
    ContactIn,
    CourseOut,
    MarketingPageIn,
    MarketingPageOut,
    ModuleIn,
    ModuleOut,
    ProgressIn,
    ProgressOut,
    RegisterIn,
    RoleUpdateIn,
    UserOut,
)

router = APIRouter()


def _parse_content(raw: str) -> list:
    try:
        data = json.loads(raw or "[]")
        return data if isinstance(data, list) else []
    except json.JSONDecodeError:
        return []


def module_to_out(m: Module) -> ModuleOut:
    return ModuleOut(
        id=m.id,
        course_id=m.course_id,
        author_id=m.author_id,
        title=m.title,
        summary=m.summary,
        content_json=_parse_content(m.content_json),
        status=m.status.value,
        order_index=m.order_index,
        created_at=m.created_at,
        updated_at=m.updated_at,
    )


@router.get("/health")
def health():
    return {"status": "ok", "service": "clare-api"}


@router.get("/courses", response_model=list[CourseOut])
def list_courses(db: Session = Depends(get_db), language: str | None = None):
    q = db.query(Course).filter(Course.is_active.is_(True))
    if language:
        q = q.filter(Course.language == language)
    return q.order_by(Course.language, Course.level).all()


@router.get("/courses/{course_id}", response_model=CourseOut)
def get_course(course_id: str, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found")
    return course


@router.post("/contact")
def contact(payload: ContactIn, db: Session = Depends(get_db)):
    from app.models import ContactMessage

    msg = ContactMessage(
        name=payload.name,
        email=str(payload.email),
        subject=payload.subject,
        message=payload.message,
    )
    db.add(msg)
    db.commit()
    return {"ok": True, "message": "Inquiry received. Staff will follow up by email."}


@router.post("/auth/register", response_model=UserOut)
def register(payload: RegisterIn, ctx: AuthContext = Depends(get_auth_context), db: Session = Depends(get_db)):
    if not payload.acknowledge_in_person:
        raise HTTPException(400, "You must acknowledge compulsory in-person attendance")
    course = db.query(Course).filter(Course.id == payload.course_id, Course.is_active.is_(True)).first()
    if not course:
        raise HTTPException(404, "Course not found")

    user = ctx.user
    if not user:
        email = ctx.email or f"{ctx.firebase_uid}@users.local"
        user = User(
            firebase_uid=ctx.firebase_uid,
            email=email,
            full_name=payload.full_name,
            role=UserRole.student,
        )
        db.add(user)
        db.flush()
    else:
        user.full_name = payload.full_name or user.full_name

    existing = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == user.id, Enrollment.course_id == course.id)
        .first()
    )
    if not existing:
        db.add(
            Enrollment(
                user_id=user.id,
                course_id=course.id,
                delivery_mode=DeliveryMode(payload.delivery_mode),
            )
        )
    db.commit()
    db.refresh(user)
    return user


@router.get("/me", response_model=UserOut)
def me(ctx: AuthContext = Depends(require_user)):
    assert ctx.user
    return ctx.user


@router.get("/me/enrollments", response_model=list[CourseOut])
def my_enrollments(ctx: AuthContext = Depends(require_user), db: Session = Depends(get_db)):
    assert ctx.user
    rows = db.query(Enrollment).filter(Enrollment.user_id == ctx.user.id).all()
    return [e.course for e in rows]


@router.get("/marketing/{slug}", response_model=MarketingPageOut)
def get_marketing(slug: str, db: Session = Depends(get_db)):
    page = db.query(MarketingPage).filter(MarketingPage.slug == slug).first()
    if not page:
        raise HTTPException(404, "Page not found")
    return page


@router.put("/admin/marketing/{slug}", response_model=MarketingPageOut)
def upsert_marketing(
    slug: str,
    payload: MarketingPageIn,
    ctx: AuthContext = Depends(require_roles(UserRole.admin)),
    db: Session = Depends(get_db),
):
    page = db.query(MarketingPage).filter(MarketingPage.slug == slug).first()
    if not page:
        page = MarketingPage(slug=slug, title=payload.title, body_md=payload.body_md)
        db.add(page)
    else:
        page.title = payload.title
        page.body_md = payload.body_md
    db.commit()
    db.refresh(page)
    return page


@router.get("/admin/users", response_model=list[UserOut])
def list_users(ctx: AuthContext = Depends(require_roles(UserRole.admin)), db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.patch("/admin/users/{user_id}/role", response_model=UserOut)
def update_role(
    user_id: str,
    payload: RoleUpdateIn,
    ctx: AuthContext = Depends(require_roles(UserRole.admin)),
    db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")
    user.role = UserRole(payload.role)
    db.commit()
    db.refresh(user)
    return user


@router.get("/modules", response_model=list[ModuleOut])
def list_modules(
    course_id: str | None = None,
    status: str | None = None,
    ctx: AuthContext = Depends(require_user),
    db: Session = Depends(get_db),
):
    assert ctx.user
    q = db.query(Module)
    if course_id:
        q = q.filter(Module.course_id == course_id)

    if ctx.user.role == UserRole.student:
        enrolled_ids = [
            e.course_id for e in db.query(Enrollment).filter(Enrollment.user_id == ctx.user.id).all()
        ]
        q = q.filter(Module.course_id.in_(enrolled_ids), Module.status == ModuleStatus.published)
    elif status:
        q = q.filter(Module.status == status)
    elif ctx.user.role == UserRole.teacher:
        pass

    return [module_to_out(m) for m in q.order_by(Module.order_index, Module.created_at).all()]


@router.get("/modules/{module_id}", response_model=ModuleOut)
def get_module(module_id: str, ctx: AuthContext = Depends(require_user), db: Session = Depends(get_db)):
    m = db.query(Module).filter(Module.id == module_id).first()
    if not m:
        raise HTTPException(404, "Module not found")
    assert ctx.user
    if ctx.user.role == UserRole.student and m.status != ModuleStatus.published:
        raise HTTPException(403, "Module not published")
    return module_to_out(m)


@router.post("/modules", response_model=ModuleOut)
def create_module(
    payload: ModuleIn,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    assert ctx.user
    m = Module(
        course_id=payload.course_id,
        author_id=ctx.user.id,
        title=payload.title,
        summary=payload.summary,
        content_json=json.dumps(payload.content_json),
        status=ModuleStatus(payload.status),
        order_index=payload.order_index,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return module_to_out(m)


@router.put("/modules/{module_id}", response_model=ModuleOut)
def update_module(
    module_id: str,
    payload: ModuleIn,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    assert ctx.user
    m = db.query(Module).filter(Module.id == module_id).first()
    if not m:
        raise HTTPException(404, "Module not found")
    if ctx.user.role == UserRole.teacher and m.author_id and m.author_id != ctx.user.id:
        raise HTTPException(403, "Not your module")
    m.course_id = payload.course_id
    m.title = payload.title
    m.summary = payload.summary
    m.content_json = json.dumps(payload.content_json)
    m.status = ModuleStatus(payload.status)
    m.order_index = payload.order_index
    db.commit()
    db.refresh(m)
    return module_to_out(m)


@router.post("/modules/{module_id}/duplicate", response_model=ModuleOut)
def duplicate_module(
    module_id: str,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    assert ctx.user
    m = db.query(Module).filter(Module.id == module_id).first()
    if not m:
        raise HTTPException(404, "Module not found")
    copy = Module(
        course_id=m.course_id,
        author_id=ctx.user.id,
        title=f"{m.title} (Copy)",
        summary=m.summary,
        content_json=m.content_json,
        status=ModuleStatus.draft,
        order_index=m.order_index,
    )
    db.add(copy)
    db.commit()
    db.refresh(copy)
    return module_to_out(copy)


@router.delete("/modules/{module_id}")
def delete_module(
    module_id: str,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    m = db.query(Module).filter(Module.id == module_id).first()
    if not m:
        raise HTTPException(404, "Module not found")
    db.delete(m)
    db.commit()
    return {"ok": True}


@router.post("/modules/{module_id}/progress", response_model=ProgressOut)
def upsert_progress(
    module_id: str,
    payload: ProgressIn,
    ctx: AuthContext = Depends(require_user),
    db: Session = Depends(get_db),
):
    assert ctx.user
    m = db.query(Module).filter(Module.id == module_id).first()
    if not m:
        raise HTTPException(404, "Module not found")
    row = (
        db.query(ModuleProgress)
        .filter(ModuleProgress.user_id == ctx.user.id, ModuleProgress.module_id == module_id)
        .first()
    )
    if not row:
        row = ModuleProgress(user_id=ctx.user.id, module_id=module_id)
        db.add(row)
    row.status = ProgressStatus(payload.status)
    row.score = payload.score
    db.commit()
    db.refresh(row)
    return row


@router.get("/modules/{module_id}/progress", response_model=list[ProgressOut])
def module_progress_list(
    module_id: str,
    ctx: AuthContext = Depends(require_roles(UserRole.teacher, UserRole.admin)),
    db: Session = Depends(get_db),
):
    return db.query(ModuleProgress).filter(ModuleProgress.module_id == module_id).all()


@router.get("/me/progress", response_model=list[ProgressOut])
def my_progress(ctx: AuthContext = Depends(require_user), db: Session = Depends(get_db)):
    assert ctx.user
    return db.query(ModuleProgress).filter(ModuleProgress.user_id == ctx.user.id).all()
