"""
MongoDB document operations for file attachments.

Stores metadata about files uploaded as evidence for reports.
"""

from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.extensions import mongo


class Attachment:
    """Manages attachment metadata stored in MongoDB."""

    @classmethod
    def _collection(cls) -> object:
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
        Create a new attachment metadata entry.

        Args:
            report_id: ID of the associated report.
            file_name: Original file name.
            file_url: URL or path to the stored file.
            file_type: MIME type (image, pdf, video, etc.).
            file_size: File size in bytes.
            uploaded_by: ID of the user who uploaded the file.

        Returns:
            dict: The created attachment document with its MongoDB ``_id``.
        """

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
        return doc

    @classmethod
    def find_by_report(cls, report_id: int) -> list[dict]:
        """
        Find all attachments for a given report.

        Args:
            report_id: The report's unique identifier.

        Returns:
            list[dict]: List of attachment documents.

        Raises:
            TypeError: If report_id is not an integer.
        """

        if not isinstance(report_id, int):
            raise TypeError("report_id must be an integer")
        return list(cls._collection().find({"report_id": report_id}))

    @classmethod
    def find_by_id(cls, attachment_id: str) -> Optional[dict]:
        """
        Find a single attachment by its MongoDB ID.

        Args:
            attachment_id: The attachment's MongoDB ObjectId as a string.

        Returns:
            Optional[dict]: The attachment document, or None if not found.
        """

        try:
            return cls._collection().find_one({"_id": ObjectId(attachment_id)})
        except Exception:
            return None

    @classmethod
    def delete_by_report(cls, report_id: int) -> int:
        """
        Delete all attachments for a given report.

        Args:
            report_id: The report's unique identifier.

        Returns:
            int: Number of deleted documents.

        Raises:
            TypeError: If report_id is not an integer.
        """

        if not isinstance(report_id, int):
            raise TypeError("report_id must be an integer")
        result = cls._collection().delete_many({"report_id": report_id})
        return result.deleted_count

    @classmethod
    def to_dict(cls, doc: dict) -> dict:
        """
        Serialize a MongoDB attachment document to a dictionary.

        Converts the MongoDB ``_id`` (ObjectId) to a string.

        Args:
            doc: The raw MongoDB document.

        Returns:
            dict: Serialized attachment data.
        """

        if doc is None:
            return {}
        return {
            "id": str(doc["_id"]),
            "report_id": doc["report_id"],
            "file_name": doc["file_name"],
            "file_url": doc["file_url"],
            "file_type": doc["file_type"],
            "file_size": doc["file_size"],
            "uploaded_by": doc["uploaded_by"],
            "created_at": doc["created_at"].isoformat(),
        }
