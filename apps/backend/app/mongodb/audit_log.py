"""
Audit log operations with dual backend support (MongoDB or SQL).

Provides an immutable activity trail for transparency and traceability
of all significant actions in the system. Automatically routes to SQL
when MongoDB is not configured or unavailable.
"""

import json
from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId
from flask import current_app

from app.extensions import db, mongo
from app.models.audit_log import AuditLogEntry


class AuditLog:
    """Manages audit log entries with automatic backend routing."""

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
        Create a new audit log entry in the active backend.

        Args:
            user_id: ID of the user who performed the action.
            action: Action type (create, update, delete, status_change, etc.).
            entity_type: Type of entity affected (report, comment, user).
            entity_id: ID of the affected entity.
            details: Additional context about the action (optional).
            ip_address: IP address of the user (optional).

        Returns:
            dict: The created audit log entry.
        """

        if not cls._use_mongo():
            entry = AuditLogEntry(
                user_id=user_id,
                action=action,
                entity_type=entity_type,
                entity_id=entity_id,
                details=json.dumps(details or {}),
                ip_address=ip_address,
            )
            db.session.add(entry)
            db.session.commit()
            return cls.to_dict(entry.to_dict())

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
        return cls.to_dict(doc)

    @classmethod
    def find_by_entity(cls, entity_type: str, entity_id: int) -> list[dict]:
        """
        Find audit log entries for a specific entity.

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
        if not cls._use_mongo():
            entries = (
                AuditLogEntry.query
                .filter_by(entity_type=entity_type, entity_id=entity_id)
                .order_by(AuditLogEntry.created_at.desc())
                .all()
            )
            return [cls.to_dict(e.to_dict()) for e in entries]
        return [
            cls.to_dict(doc)
            for doc in cls._collection()
            .find({"entity_type": entity_type, "entity_id": entity_id})
            .sort("created_at", -1)
        ]

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
        if not cls._use_mongo():
            entries = (
                AuditLogEntry.query
                .filter_by(user_id=user_id)
                .order_by(AuditLogEntry.created_at.desc())
                .limit(limit)
                .all()
            )
            return [cls.to_dict(e.to_dict()) for e in entries]
        return [
            cls.to_dict(doc)
            for doc in cls._collection()
            .find({"user_id": user_id})
            .sort("created_at", -1)
            .limit(limit)
        ]

    @classmethod
    def find_all(cls, limit: int = 100) -> list[dict]:
        """
        Find all audit log entries.

        Args:
            limit: Maximum number of entries to return (default: 100).

        Returns:
            list[dict]: Audit log entries sorted by creation date descending.
        """

        if not cls._use_mongo():
            entries = (
                AuditLogEntry.query
                .order_by(AuditLogEntry.created_at.desc())
                .limit(limit)
                .all()
            )
            return [cls.to_dict(e.to_dict()) for e in entries]
        return [
            cls.to_dict(doc)
            for doc in cls._collection().find().sort("created_at", -1).limit(limit)
        ]

    @classmethod
    def to_dict(cls, doc: dict) -> dict:
        """
        Serialize an audit log document to a consistent dictionary format.

        Handles both MongoDB documents (with ``_id``) and SQL model dicts
        (with integer ``id``).

        Args:
            doc: The raw document or dictionary from either backend.

        Returns:
            dict: Serialized audit log data.
        """

        if doc is None:
            return {}

        if "id" in doc and isinstance(doc.get("id"), int):
            return {
                "id": doc["id"],
                "user_id": doc["user_id"],
                "action": doc["action"],
                "entity_type": doc["entity_type"],
                "entity_id": doc["entity_id"],
                "details": doc.get("details"),
                "ip_address": doc.get("ip_address"),
                "created_at": doc["created_at"].isoformat() if hasattr(doc["created_at"], "isoformat") else doc["created_at"],
            }

        return {
            "id": str(doc["_id"]),
            "user_id": doc["user_id"],
            "action": doc["action"],
            "entity_type": doc["entity_type"],
            "entity_id": doc["entity_id"],
            "details": doc["details"],
            "ip_address": doc["ip_address"],
            "created_at": doc["created_at"].isoformat() if hasattr(doc["created_at"], "isoformat") else doc["created_at"],
        }
