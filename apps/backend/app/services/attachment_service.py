"""
Attachment service layer.

Handles file upload, metadata storage in MongoDB, and file serving.
"""

import os
import uuid

from flask import current_app
from werkzeug.utils import secure_filename

from app.extensions import db
from app.models.report import Report
from app.mongo.attachment import Attachment

ALLOWED_EXTENSIONS = {
    "png", "jpg", "jpeg", "gif", "webp",
    "pdf", "doc", "docx",
    "mp4", "mov", "avi",
}


class AttachmentService:
    """Service for attachment operations."""

    @staticmethod
    def _allowed_file(filename: str) -> bool:
        return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

    @staticmethod
    def upload(file, report_id: int, uploaded_by: int) -> dict:
        """
        Upload a file as an attachment to a report.

        Validates the file type and size, saves to the uploads directory,
        and stores metadata in MongoDB.

        Args:
            file: FileStorage object from the request.
            report_id: ID of the associated report.
            uploaded_by: ID of the user uploading the file.

        Returns:
            dict: The created attachment metadata.

        Raises:
            ValueError: If validation fails or the report is not found.
        """

        if not file or not file.filename:
            raise ValueError("No file provided")

        report = db.session.get(Report, report_id)
        if not report:
            raise ValueError("Report not found")

        if not AttachmentService._allowed_file(file.filename):
            raise ValueError("File type not allowed")

        max_size = current_app.config.get("MAX_CONTENT_LENGTH", 16 * 1024 * 1024)
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        if size > max_size:
            limit_mb = max_size // (1024 * 1024)
            raise ValueError(f"File exceeds {limit_mb} MB limit")

        ext = file.filename.rsplit(".", 1)[1].lower()
        saved_name = f"{uuid.uuid4().hex}.{ext}"
        upload_folder = current_app.config["UPLOAD_FOLDER"]
        file_path = os.path.join(upload_folder, saved_name)
        file.save(file_path)

        file_type = file.content_type or "application/octet-stream"
        file_url = f"/uploads/{saved_name}"

        doc = Attachment.create(
            report_id=report_id,
            file_name=secure_filename(file.filename),
            file_url=file_url,
            file_type=file_type,
            file_size=size,
            uploaded_by=uploaded_by,
        )

        return Attachment.to_dict(doc)
