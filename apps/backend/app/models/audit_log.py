import json
from datetime import datetime, timezone

from sqlalchemy.orm import Mapped, mapped_column

from app.extensions import db


class AuditLogEntry(db.Model):
    """
    Represents an immutable audit log entry.

    Stores a traceable activity trail for transparency of all significant
    actions in the system. Can be stored in SQL or MongoDB depending on
    the USE_MONGO configuration flag.
    """

    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False)
    action: Mapped[str] = mapped_column(db.String(50), nullable=False)
    entity_type: Mapped[str] = mapped_column(db.String(50), nullable=False)
    entity_id: Mapped[int] = mapped_column(db.Integer, nullable=False)
    details: Mapped[str] = mapped_column(db.Text, nullable=True)
    ip_address: Mapped[str] = mapped_column(db.String(45), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    def to_dict(self) -> dict:
        """
        Serialize the audit log entry to a dictionary.

        Returns:
            dict: Audit log data including action, entity, and timestamp.
        """

        return {
            "id": self.id,
            "user_id": self.user_id,
            "action": self.action,
            "entity_type": self.entity_type,
            "entity_id": self.entity_id,
            "details": json.loads(self.details) if self.details else {},
            "ip_address": self.ip_address,
            "created_at": self.created_at.isoformat(),
        }
