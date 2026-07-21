"""
Avatar service layer.

Handles avatar file upload, validation, and user profile updates.
"""

import os
import uuid

from flask import current_app
from flask_babel import gettext

from app.extensions import db
from app.models.user import User
from app.services.auth_service import AuthService

ALLOWED_AVATAR_EXTENSIONS = {"png", "jpg", "jpeg", "svg", "gif"}


class AvatarService:
    """Service for avatar upload and management operations."""

    @staticmethod
    def upload_avatar(file, user_id: int):
        """
        Validate and save an uploaded avatar file, then update the user's
        avatar_url. Deletes the previous uploaded avatar file if one exists.

        Args:
            file: FileStorage object from the request.
            user_id: ID of the user uploading the avatar.

        Returns:
            User: The updated User instance.

        Raises:
            ValueError: If validation fails.
        """

        if not file or not file.filename:
            raise ValueError(gettext("No file selected"))

        ext = file.filename.rsplit(".", 1)[1].lower() if "." in file.filename else ""
        if ext not in ALLOWED_AVATAR_EXTENSIONS:
            raise ValueError(
                gettext("File type not allowed. Allowed: %(extensions)s") % {"extensions": ', '.join(sorted(ALLOWED_AVATAR_EXTENSIONS))}
            )

        max_size = current_app.config.get("MAX_CONTENT_LENGTH", 16 * 1024 * 1024)
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        if size > max_size:
            limit_mb = max_size // (1024 * 1024)
            raise ValueError(gettext("File exceeds %(limit)s MB limit") % {"limit": limit_mb})

        user = db.session.get(User, user_id)
        if not user:
            raise ValueError(gettext("User not found"))

        AvatarService._delete_previous_upload(user.avatar_url)

        saved_name = f"{uuid.uuid4().hex}.{ext}"
        upload_path = os.path.join(current_app.config["UPLOAD_FOLDER"], saved_name)
        file.save(upload_path)

        avatar_url = f"/uploads/{saved_name}"
        return AuthService.update_profile(user_id, avatar_url=avatar_url)

    @staticmethod
    def _delete_previous_upload(avatar_url: str | None) -> None:
        """
        Delete the previous uploaded avatar file from disk if it exists and
        is a custom upload (not a gallery avatar).

        Args:
            avatar_url: The current avatar_url path from the user record.
        """

        if not avatar_url or not avatar_url.startswith("/uploads/"):
            return

        filename = avatar_url.rsplit("/", 1)[-1]
        file_path = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
        if os.path.exists(file_path):
            os.remove(file_path)
