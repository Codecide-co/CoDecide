import uuid
from datetime import datetime, timezone

from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Report(db.Model):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(200), nullable=False)
    description: Mapped[str] = mapped_column(db.Text, nullable=False)
    status: Mapped[str] = mapped_column(
        SAEnum("open", "in_progress", "resolved", "closed", name="report_status"),
        nullable=False,
        default="open",
    )
    tracking_number: Mapped[str] = mapped_column(db.String(20), unique=True, nullable=False)
    location: Mapped[str | None] = mapped_column(db.String(255))

    # Foreign Keys
    category_id: Mapped[int] = mapped_column(db.ForeignKey("categories.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False)
    assigned_to: Mapped[int | None] = mapped_column(db.ForeignKey("users.id"), nullable=True)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relaciones
    author: Mapped["User"] = relationship("User", back_populates="reports")
    category: Mapped["Category"] = relationship("Category", back_populates="reports")
    comments: Mapped[list["Comment"]] = relationship(
        "Comment", back_populates="report", lazy="selectin"
    )
    votes: Mapped[list["Vote"]] = relationship(
        "Vote", back_populates="report", lazy="selectin"
    )

    @staticmethod
    def generate_tracking_number() -> str:
        """Genera un número de seguimiento único para el reporte."""
        return f"CD-{uuid.uuid4().hex[:8].upper()}"

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "tracking_number": self.tracking_number,
            "location": self.location,
            "category_id": self.category_id,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
