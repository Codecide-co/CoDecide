from datetime import datetime, timezone

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Comunicado(db.Model):
    """
    Represents an official announcement published by an admin.

    Comunicados are visible to all residents and contain important
    community information.
    """

    __tablename__ = "comunicados"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(db.String(200), nullable=False)
    body: Mapped[str] = mapped_column(db.Text, nullable=False)
    author_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    author: Mapped["User"] = relationship("User", back_populates="comunicados")

    def to_dict(self) -> dict:
        """
        Serialize the comunicado to a dictionary.

        Returns:
            dict: Comunicado data including title, body, author, and timestamps.
        """
        
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "author_id": self.author_id,
            "author_name": self.author.name if self.author else None,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
