"""
Attachment metadata operations with dual backend support (MongoDB or SQL).

Stores metadata about files uploaded as evidence for reports. Automatically
routes to SQL when MongoDB is not configured or unavailable.
"""

from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from flask import current_app

from app.extensions import db, mongo
from app.models.attachment import AttachmentEntry


class Attachment:
    """Manages attachment metadata with automatic backend routing."""

    @classmethod
    def _use_mongo(cls) -> bool:
        """
        Check if MongoDB should be used for this operation.

        Returns:
            bool: True if USE_MONGO is enabled and MongoDB is connected.
        """

        return current_app.config.get("USE_MONGO", False) and mongo.db is not None

    @classmethod
    def _collection(cls):
        """
        Get the MongoDB collection for attachments.

        Returns:
            object: The attachments collection handle.

        Raises:
            RuntimeError: If MongoDB is not connected.
        """

        if mongo.db is None:
            raise RuntimeError("MongoDB is not connected")
        return mongo.db.attachments

    @classmethod
    def create(
        cls,
        report_id: int,
        file_name: str,
        file_url: str,
        file_type: str,
        file_size: int,
        uploaded_by: int,
    ) -> dict:
        """
        Create a new attachment metadata entry in the active backend.

        Args:
            report_id: ID of the associated report.
            file_name: Original file name.
            file_url: URL or path to the stored file.
            file_type: MIME type (image, pdf, video, etc.).
            file_size: File size in bytes.
            uploaded_by: ID of the user who uploaded the file.

        Returns:
            dict: The created attachment entry.
        """

        if not cls._use_mongo():
            entry = AttachmentEntry(
                report_id=report_id,
                file_name=file_name,
                file_url=file_url,
                file_type=file_type,
                file_size=file_size,
                uploaded_by=uploaded_by,
            )
            db.session.add(entry)
            db.session.commit()
            return cls.to_dict(entry.to_dict())

        doc = {
            "report_id": report_id,
            "file_name": file_name,
            "file_url": file_url,
            "file_type": file_type,
            "file_size": file_size,
            "uploaded_by": uploaded_by,
            "created_at": datetime.now(timezone.utc),
        }
        result = cls._collection().insert_one(doc)
        doc["_id"] = result.inserted_id
        return cls.to_dict(doc)

    @classmethod
    def find_by_report(cls, report_id: int) -> list[dict]:
        """
        Find all attachments for a given report.

        Args:
            report_id: The report's unique identifier.

        Returns:
            list[dict]: List of attachment entries.

        Raises:
            TypeError: If report_id is not an integer.
        """

        if not isinstance(report_id, int):
            raise TypeError("report_id must be an integer")
        if not cls._use_mongo():
            entries = AttachmentEntry.query.filter_by(report_id=report_id).all()
            return [cls.to_dict(e.to_dict()) for e in entries]
        return [
            cls.to_dict(doc)
            for doc in cls._collection().find({"report_id": report_id})
        ]

    @classmethod
    def find_by_id(cls, attachment_id: str) -> Optional[dict]:
        """
        Find a single attachment by its ID.

        Args:
            attachment_id: The attachment's ID (MongoDB ObjectId string
                or SQL integer as string).

        Returns:
            Optional[dict]: The attachment entry, or None if not found.
        """

        if not cls._use_mongo():
            try:
                entry = AttachmentEntry.query.get(int(attachment_id))
                return cls.to_dict(entry.to_dict()) if entry else None
            except (ValueError, TypeError):
                return None
        try:
            doc = cls._collection().find_one({"_id": ObjectId(attachment_id)})
            return cls.to_dict(doc) if doc else None
        except Exception:
            return None

    @classmethod
    def delete_by_report(cls, report_id: int) -> int:
        """
        Delete all attachments for a given report.

        Args:
            report_id: The report's unique identifier.

        Returns:
            int: Number of deleted entries.

        Raises:
            TypeError: If report_id is not an integer.
        """

        if not isinstance(report_id, int):
            raise TypeError("report_id must be an integer")
        if not cls._use_mongo():
            count = AttachmentEntry.query.filter_by(report_id=report_id).delete()
            db.session.commit()
            return count
        result = cls._collection().delete_many({"report_id": report_id})
        return result.deleted_count

    @classmethod
    def to_dict(cls, doc: dict) -> dict:
        """
        Serialize an attachment document to a consistent dictionary format.

        Handles both MongoDB documents (with ``_id``) and SQL model dicts
        (with integer ``id``).

        Args:
            doc: The raw document or dictionary from either backend.

        Returns:
            dict: Serialized attachment data.
        """

        if doc is None:
            return {}

        if "id" in doc and isinstance(doc.get("id"), int):
            return {
                "id": doc["id"],
                "report_id": doc["report_id"],
                "file_name": doc["file_name"],
                "file_url": doc["file_url"],
                "file_type": doc["file_type"],
                "file_size": doc["file_size"],
                "uploaded_by": doc["uploaded_by"],
                "created_at": doc["created_at"].isoformat() if hasattr(doc["created_at"], "isoformat") else doc["created_at"],
            }

        return {
            "id": str(doc["_id"]),
            "report_id": doc["report_id"],
            "file_name": doc["file_name"],
            "file_url": doc["file_url"],
            "file_type": doc["file_type"],
            "file_size": doc["file_size"],
            "uploaded_by": doc["uploaded_by"],
            "created_at": doc["created_at"].isoformat() if hasattr(doc["created_at"], "isoformat") else doc["created_at"],
        }
