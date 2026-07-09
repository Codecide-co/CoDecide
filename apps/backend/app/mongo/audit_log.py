from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.extensions import mongo


class AuditLog:
    """Registro de actividad inmutable para transparencia."""

    @classmethod
    def _collection(cls):
        if mongo.db is None:
            raise RuntimeError("MongoDB no está conectado")
        return mongo.db.audit_logs

    @classmethod
    def create(
        cls,
        user_id: int,
        action: str,
        entity_type: str,
        entity_id: int,
        details: Optional[dict] = None,
        ip_address: Optional[str] = None,
    ) -> dict:
        doc = {
            "user_id": user_id,
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "details": details or {},
            "ip_address": ip_address,
            "created_at": datetime.now(timezone.utc),
        }
        result = cls._collection().insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    @classmethod
    def find_by_entity(cls, entity_type: str, entity_id: int) -> list[dict]:
        if not isinstance(entity_id, int):
            raise TypeError("entity_id must be an integer")
        return list(
            cls._collection().find({"entity_type": entity_type, "entity_id": entity_id})
            .sort("created_at", -1)
        )

    @classmethod
    def find_by_user(cls, user_id: int, limit: int = 50) -> list[dict]:
        if not isinstance(user_id, int):
            raise TypeError("user_id must be an integer")
        return list(
            cls._collection().find({"user_id": user_id})
            .sort("created_at", -1)
            .limit(limit)
        )

    @classmethod
    def find_all(cls, limit: int = 100) -> list[dict]:
        return list(cls._collection().find().sort("created_at", -1).limit(limit))

    @classmethod
    def to_dict(cls, doc: dict) -> dict:
        if doc is None:
            return {}
        return {
            "id": str(doc["_id"]),
            "user_id": doc["user_id"],
            "action": doc["action"],
            "entity_type": doc["entity_type"],
            "entity_id": doc["entity_id"],
            "details": doc["details"],
            "ip_address": doc["ip_address"],
            "created_at": doc["created_at"].isoformat(),
        }
