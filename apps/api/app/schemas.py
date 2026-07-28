from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, EmailStr, Field


class CourseOut(BaseModel):
    id: str
    language: str
    level: str
    title: str
    description: str
    delivery_modes: str
    is_active: bool

    model_config = {"from_attributes": True}


class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    firebase_uid: str

    model_config = {"from_attributes": True}


class RegisterIn(BaseModel):
    full_name: str = Field(min_length=1, max_length=255)
    course_id: str
    delivery_mode: Literal["physical", "online"] = "physical"
    acknowledge_in_person: bool = True


class ContactIn(BaseModel):
    name: str
    email: EmailStr
    subject: str = ""
    message: str = Field(min_length=1)


class ModuleIn(BaseModel):
    course_id: str
    title: str
    summary: str = ""
    content_json: list[dict[str, Any]] = Field(default_factory=list)
    status: Literal["draft", "published"] = "draft"
    order_index: int = 0


class ModuleOut(BaseModel):
    id: str
    course_id: str
    author_id: str | None
    title: str
    summary: str
    content_json: list[dict[str, Any]]
    status: str
    order_index: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProgressIn(BaseModel):
    status: Literal["not_started", "in_progress", "completed"]
    score: float | None = None


class ProgressOut(BaseModel):
    id: str
    user_id: str
    module_id: str
    status: str
    score: float | None
    updated_at: datetime

    model_config = {"from_attributes": True}


class QuestionIn(BaseModel):
    question_type: Literal["mcq", "true_false", "short_answer", "audio_response"]
    prompt: str
    options: list[str] = Field(default_factory=list)
    correct_answer: str = ""
    audio_prompt_key: str | None = None
    points: float = 1.0
    order_index: int = 0


class TestIn(BaseModel):
    course_id: str
    module_id: str | None = None
    title: str
    instructions: str = ""
    status: Literal["draft", "published"] = "draft"
    questions: list[QuestionIn] = Field(default_factory=list)


class QuestionOut(BaseModel):
    id: str
    question_type: str
    prompt: str
    options: list[str]
    audio_prompt_key: str | None
    points: float
    order_index: int
    # correct_answer omitted for students


class TestOut(BaseModel):
    id: str
    course_id: str
    module_id: str | None
    title: str
    instructions: str
    status: str
    questions: list[QuestionOut]


class AnswerIn(BaseModel):
    question_id: str
    text_response: str | None = None
    audio_key: str | None = None


class SubmitTestIn(BaseModel):
    answers: list[AnswerIn]


class GradeAnswerIn(BaseModel):
    points_awarded: float
    teacher_feedback: str = ""
    is_correct: bool | None = None


class SignedUploadIn(BaseModel):
    prefix: Literal["lessons", "prompts", "submissions"]
    filename: str
    content_type: str
    user_scoped: bool = False


class RoleUpdateIn(BaseModel):
    role: Literal["student", "teacher", "admin"]


class AssignIn(BaseModel):
    course_id: str
    module_id: str | None = None
    test_id: str | None = None


class MarketingPageOut(BaseModel):
    slug: str
    title: str
    body_md: str

    model_config = {"from_attributes": True}


class MarketingPageIn(BaseModel):
    title: str
    body_md: str
