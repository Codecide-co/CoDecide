from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.extensions import mongo


class AuditLog:
    """Registro de actividad inmutable para transparencia."""

    collection = mongo.db.audit_logs

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
        Crea un registro de auditoría inmutable.

        Args:
            user_id: ID del usuario que realizó la acción.
            action: Tipo de acción (create, update, delete, login, status_change).
            entity_type: Tipo de entidad afectada (report, comment, user).
            entity_id: ID de la entidad afectada.
            details: Detalles adicionales de la acción.
            ip_address: Dirección IP del usuario.

        Returns:
            El documento insertado.
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
        result = cls.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    @classmethod
    def find_by_entity(cls, entity_type: str, entity_id: int) -> list[dict]:
        """
        Busca todos los logs de una entidad específica.

        Args:
            entity_type: Tipo de entidad.
            entity_id: ID de la entidad.

        Returns:
            Lista de documentos de auditoría ordenados por fecha descendente.
        """
        return list(
            cls.collection.find({"entity_type": entity_type, "entity_id": entity_id})
            .sort("created_at", -1)
        )

    @classmethod
    def find_by_user(cls, user_id: int, limit: int = 50) -> list[dict]:
        """
        Busca los logs de un usuario específico.

        Args:
            user_id: ID del usuario.
            limit: Número máximo de registros a retornar.

        Returns:
            Lista de documentos de auditoría del usuario.
        """
        return list(
            cls.collection.find({"user_id": user_id})
            .sort("created_at", -1)
            .limit(limit)
        )

    @classmethod
    def find_all(cls, limit: int = 100) -> list[dict]:
        """
        Busca todos los logs de auditoría (para admin).

        Args:
            limit: Número máximo de registros a retornar.

        Returns:
            Lista de documentos de auditoría ordenados por fecha descendente.
        """
        return list(cls.collection.find().sort("created_at", -1).limit(limit))

    @classmethod
    def to_dict(cls, doc: dict) -> dict:
        """Serializa un documento de auditoría a diccionario."""
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
