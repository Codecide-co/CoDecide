"""
MongoDB document operations for immutable audit logging.

Stores an immutable activity trail for transparency and traceability
of all significant actions in the system.
"""

from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.extensions import mongo


class AuditLog:
    """Manages immutable audit log entries stored in MongoDB."""

    @classmethod
    def _collection(cls) -> object:
        """
        Get the MongoDB collection for audit logs.

        Returns:
            object: The audit_logs collection handle.

        Raises:
            RuntimeError: If MongoDB is not connected.
        """

        if mongo.db is None:
            raise RuntimeError("MongoDB is not connected")
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
        """
        Create a new audit log entry.

        Args:
            user_id: ID of the user who performed the action.
            action: Action type (create, update, delete, status_change, etc.).
            entity_type: Type of entity affected (report, comment, user).
            entity_id: ID of the affected entity.
            details: Additional context about the action (optional).
            ip_address: IP address of the user (optional).

        Returns:
            dict: The created audit log document with its MongoDB ``_id``.
        """

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
        """Find audit log entries for a specific entity.

        Args:
            entity_type: Type of entity (report, comment, user).
            entity_id: ID of the entity.

        Returns:
            list[dict]: Audit log entries sorted by creation date descending.

        Raises:
            TypeError: If entity_id is not an integer.
        """
        if not isinstance(entity_id, int):
            raise TypeError("entity_id must be an integer")
        return list(
            cls._collection().find({"entity_type": entity_type, "entity_id": entity_id})
            .sort("created_at", -1)
        )

    @classmethod
    def find_by_user(cls, user_id: int, limit: int = 50) -> list[dict]:
        """
        Find audit log entries for a specific user.

        Args:
            user_id: ID of the user.
            limit: Maximum number of entries to return (default: 50).

        Returns:
            list[dict]: Audit log entries sorted by creation date descending.

        Raises:
            TypeError: If user_id is not an integer.
        """

        if not isinstance(user_id, int):
            raise TypeError("user_id must be an integer")
        return list(
            cls._collection().find({"user_id": user_id})
            .sort("created_at", -1)
            .limit(limit)
        )

    @classmethod
    def find_all(cls, limit: int = 100) -> list[dict]:
        """
        Find all audit log entries.

        Args:
            limit: Maximum number of entries to return (default: 100).

        Returns:
            list[dict]: Audit log entries sorted by creation date descending.
        """

        return list(cls._collection().find().sort("created_at", -1).limit(limit))

    @classmethod
    def to_dict(cls, doc: dict) -> dict:
        """
        Serialize a MongoDB audit log document to a dictionary.

        Args:
            doc: The raw MongoDB document.

        Returns:
            dict: Serialized audit log data.
        """
        
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
