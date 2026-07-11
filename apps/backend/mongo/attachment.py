from datetime import datetime, timezone
from typing import Optional

from bson import ObjectId

from app.extensions import mongo


class Attachment:
    """Metadatos de archivos adjuntos almacenados en MongoDB."""

    collection = mongo.db.attachments

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
        Crea un registro de adjunto en MongoDB.

        Args:
            report_id: ID del reporte asociado.
            file_name: Nombre original del archivo.
            file_url: URL o ruta donde se almacena el archivo.
            file_type: Tipo de archivo (image, pdf, video).
            file_size: Tamaño del archivo en bytes.
            uploaded_by: ID del usuario que subió el archivo.

        Returns:
            El documento insertado con su ObjectId.
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
        result = cls.collection.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc

    @classmethod
    def find_by_report(cls, report_id: int) -> list[dict]:
        """
        Busca todos los adjuntos de un reporte.

        Args:
            report_id: ID del reporte.

        Returns:
            Lista de documentos de adjuntos.
        """
        return list(cls.collection.find({"report_id": report_id}))

    @classmethod
    def find_by_id(cls, attachment_id: str) -> Optional[dict]:
        """
        Busca un adjunto por su ObjectId.

        Args:
            attachment_id: ObjectId del adjunto como string.

        Returns:
            El documento si existe, None de lo contrario.
        """
        try:
            return cls.collection.find_one({"_id": ObjectId(attachment_id)})
        except Exception:
            return None

    @classmethod
    def delete_by_report(cls, report_id: int) -> int:
        """
        Elimina todos los adjuntos de un reporte.

        Args:
            report_id: ID del reporte.

        Returns:
            Número de documentos eliminados.
        """
        result = cls.collection.delete_many({"report_id": report_id})
        return result.deleted_count

    @classmethod
    def to_dict(cls, doc: dict) -> dict:
        """Serializa un documento de adjunto a diccionario."""
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
