from datetime import datetime, timedelta, timezone
from uuid import uuid4

import boto3
from botocore.client import Config
from fastapi import HTTPException

from app.config import get_settings

_LOCAL_STORE: dict[str, bytes] = {}


def _r2_configured() -> bool:
    s = get_settings()
    return bool(s.r2_account_id and s.r2_access_key_id and s.r2_secret_access_key)


def get_s3_client():
    s = get_settings()
    if not _r2_configured():
        return None
    endpoint = f"https://{s.r2_account_id}.r2.cloudflarestorage.com"
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=s.r2_access_key_id,
        aws_secret_access_key=s.r2_secret_access_key,
        config=Config(signature_version="s3v4"),
        region_name="auto",
    )


def build_object_key(prefix: str, filename: str, user_id: str | None = None) -> str:
    safe_name = filename.replace(" ", "_")
    if user_id:
        return f"{prefix.rstrip('/')}/{user_id}/{uuid4().hex}_{safe_name}"
    return f"{prefix.rstrip('/')}/{uuid4().hex}_{safe_name}"


def create_presigned_upload(
    key: str,
    content_type: str,
    max_bytes: int | None = None,
) -> dict:
    s = get_settings()
    client = get_s3_client()
    expires = s.signed_url_expires_seconds
    if client is None:
        # Local/dev fallback: API will accept direct upload to /media/local-upload
        return {
            "mode": "local",
            "key": key,
            "upload_url": f"/media/local-upload?key={key}",
            "method": "PUT",
            "headers": {"Content-Type": content_type},
            "expires_in": expires,
            "max_bytes": max_bytes or s.max_audio_bytes,
        }

    url = client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": s.r2_bucket_name,
            "Key": key,
            "ContentType": content_type,
        },
        ExpiresIn=expires,
    )
    return {
        "mode": "r2",
        "key": key,
        "upload_url": url,
        "method": "PUT",
        "headers": {"Content-Type": content_type},
        "expires_in": expires,
        "max_bytes": max_bytes or s.max_audio_bytes,
    }


def create_presigned_download(key: str) -> dict:
    s = get_settings()
    client = get_s3_client()
    expires = s.signed_url_expires_seconds
    if client is None:
        return {
            "mode": "local",
            "key": key,
            "download_url": f"/media/local-download?key={key}",
            "expires_in": expires,
            "expires_at": (datetime.now(timezone.utc) + timedelta(seconds=expires)).isoformat(),
        }

    url = client.generate_presigned_url(
        "get_object",
        Params={"Bucket": s.r2_bucket_name, "Key": key},
        ExpiresIn=expires,
    )
    return {
        "mode": "r2",
        "key": key,
        "download_url": url,
        "expires_in": expires,
        "expires_at": (datetime.now(timezone.utc) + timedelta(seconds=expires)).isoformat(),
    }


def store_local_object(key: str, data: bytes) -> None:
    if len(data) > get_settings().max_audio_bytes:
        raise HTTPException(status_code=413, detail="File too large")
    _LOCAL_STORE[key] = data


def get_local_object(key: str) -> bytes:
    if key not in _LOCAL_STORE:
        raise HTTPException(status_code=404, detail="Object not found")
    return _LOCAL_STORE[key]
