from datetime import datetime, timezone

from sqlalchemy import Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(db.String(100), nullable=False)
    email: Mapped[str] = mapped_column(db.String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(db.String(255), nullable=False)
    role: Mapped[str] = mapped_column(
        SAEnum("resident", "admin", name="user_role"),
        nullable=False,
        default="resident",
    )
    apartment: Mapped[str | None] = mapped_column(db.String(20))
    tower: Mapped[str | None] = mapped_column(db.String(10))
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    last_seen: Mapped[datetime | None] = mapped_column(db.DateTime, nullable=True)

    # Relaciones
    reports: Mapped[list["Report"]] = relationship(
        "Report", back_populates="author", lazy="selectin", foreign_keys="Report.user_id"
    )
    assigned_reports: Mapped[list["Report"]] = relationship(
        "Report", back_populates="assignee", lazy="selectin", foreign_keys="Report.assigned_to"
    )
    comments: Mapped[list["Comment"]] = relationship(
        "Comment", back_populates="author", lazy="selectin"
    )
    votes: Mapped[list["Vote"]] = relationship(
        "Vote", back_populates="user", lazy="selectin"
    )
    comunicados: Mapped[list["Comunicado"]] = relationship(
        "Comunicado", back_populates="author", lazy="selectin"
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "apartment": self.apartment,
            "tower": self.tower,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
