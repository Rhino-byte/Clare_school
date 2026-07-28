from dataclasses import dataclass

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import User, UserRole

_firebase_ready = False


def _init_firebase() -> bool:
    global _firebase_ready
    if _firebase_ready:
        return True
    settings = get_settings()
    try:
        import firebase_admin
        from firebase_admin import credentials

        if firebase_admin._apps:
            _firebase_ready = True
            return True

        if settings.firebase_credentials_json:
            import json

            cred = credentials.Certificate(json.loads(settings.firebase_credentials_json))
            firebase_admin.initialize_app(cred)
            _firebase_ready = True
            return True
        if settings.google_application_credentials:
            cred = credentials.Certificate(settings.google_application_credentials)
            firebase_admin.initialize_app(cred)
            _firebase_ready = True
            return True
    except Exception:
        return False
    return False


@dataclass
class AuthContext:
    firebase_uid: str
    email: str
    user: User | None


def _verify_token(token: str) -> tuple[str, str]:
    settings = get_settings()
    if _init_firebase():
        from firebase_admin import auth as fb_auth

        decoded = fb_auth.verify_id_token(token)
        return decoded["uid"], decoded.get("email") or ""

    if settings.auth_dev_bypass:
        # Dev token format: dev:<uid>:<email>
        if token.startswith("dev:"):
            parts = token.split(":", 2)
            if len(parts) == 3:
                return parts[1], parts[2]
        return "dev-user", "dev@stclare.local"

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Auth not configured")


def get_auth_context(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> AuthContext:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    uid, email = _verify_token(token)
    user = db.query(User).filter(User.firebase_uid == uid).first()
    return AuthContext(firebase_uid=uid, email=email, user=user)


def require_user(ctx: AuthContext = Depends(get_auth_context)) -> AuthContext:
    if not ctx.user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User profile required")
    return ctx


def require_roles(*roles: UserRole):
    def _dep(ctx: AuthContext = Depends(require_user)) -> AuthContext:
        assert ctx.user is not None
        if ctx.user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return ctx

    return _dep
