from datetime import datetime, timezone

from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Comment(db.Model):
    """
    Represents a comment on a report.

    Comments are authored by users and belong to a specific report.
    """

    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    body: Mapped[str] = mapped_column(db.Text, nullable=False)

    user_id: Mapped[int] = mapped_column(db.ForeignKey("users.id"), nullable=False, index=True)
    report_id: Mapped[int] = mapped_column(db.ForeignKey("reports.id"), nullable=False, index=True)

    created_at: Mapped[datetime] = mapped_column(
        db.DateTime, nullable=False, default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        db.DateTime,
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    author: Mapped["User"] = relationship("User", back_populates="comments")
    report: Mapped["Report"] = relationship("Report", back_populates="comments")

    def to_dict(self) -> dict:
        """
        Serialize the comment to a dictionary.

        Returns:
            dict: Comment data including body, author, and timestamps.
        """
        
        return {
            "id": self.id,
            "body": self.body,
            "user_id": self.user_id,
            "report_id": self.report_id,
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
        }
