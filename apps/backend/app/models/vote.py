from datetime import datetime, timezone

from sqlalchemy import Enum as SAEnum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Vote(db.Model):
    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(primary_key=True)
    vote_type: Mapped[str] = mapped_column(
        SAEnum("up", "down", name="vote_type"),
        nullable=False,
    )

    # Foreign Keys
    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False, index=True)
    report_id: Mapped[int] = mapped_column(db.ForeignKey("reports.id"), nullable=False, index=True)

    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )

    # Relaciones
    user: Mapped["User"] = relationship("User", back_populates="votes")
    report: Mapped["Report"] = relationship("Report", back_populates="votes")

    # Constraint: un usuario solo puede votar una vez por reporte
    __table_args__ = (
        UniqueConstraint("user_id", "report_id", name="uq_user_report_vote"),
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "vote_type": self.vote_type,
            "user_id": self.user_id,
            "report_id": self.report_id,
            "created_at": self.created_at.isoformat(),
        }
