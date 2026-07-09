from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.extensions import mongo


class Attachment:
    """Metadatos de archivos adjuntos almacenados en MongoDB."""

    @classmethod
    def _collection(cls):
        if mongo.db is None:
            raise RuntimeError("MongoDB no está conectado")
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
        if not isinstance(report_id, int):
            raise TypeError("report_id must be an integer")
        return list(cls._collection().find({"report_id": report_id}))

    @classmethod
    def find_by_id(cls, attachment_id: str) -> Optional[dict]:
        try:
            return cls._collection().find_one({"_id": ObjectId(attachment_id)})
        except Exception:
            return None

    @classmethod
    def delete_by_report(cls, report_id: int) -> int:
        if not isinstance(report_id, int):
            raise TypeError("report_id must be an integer")
        result = cls._collection().delete_many({"report_id": report_id})
        return result.deleted_count

    @classmethod
    def to_dict(cls, doc: dict) -> dict:
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
